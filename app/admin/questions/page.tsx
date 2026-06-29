'use client'

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import {
  fetchAdminCategories,
  fetchQuestionsForCategory,
  fetchDifficultyCounts,
  addQuestion,
  deactivateQuestion,
  uploadQuestionMedia,
  type AdminCategory,
  type AdminQuestion,
  type DifficultyCounts,
} from '@/lib/admin'
import type { PointValue } from '@/lib/types'

/**
 * /admin/questions — Manage the question bank.
 * Two-column layout (stacks on mobile):
 *  - Left: super/sub category selector + playability pill + question list
 *  - Right: add-question form (or empty state if no category selected)
 *
 * No auth (Phase 2 — SKILL.md §11). RLS policies on the `questions` table
 * and the `question-media` storage bucket are what actually gate writes.
 */

const POINT_OPTIONS: { value: PointValue; label: string; color: string }[] = [
  { value: 200, label: 'سهل 200',    color: 'bg-green-500'  },
  { value: 400, label: 'متوسط 400', color: 'bg-amber-500'  },
  { value: 600, label: 'صعب 600',   color: 'bg-red-500'    },
]

const VIDEO_RE = /\.(mp4|webm|mov|avi)$/i

export default function AdminQuestionsPage() {
  /* ── Left-panel state ─────────────────────────────────────────────────── */
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [superId, setSuperId] = useState<string>('')
  const [subId, setSubId] = useState<string>('')
  const [questions, setQuestions] = useState<AdminQuestion[]>([])
  const [counts, setCounts] = useState<DifficultyCounts>({ c200: 0, c400: 0, c600: 0 })
  const [questionsError, setQuestionsError] = useState<string | null>(null)

  /* ── Right-panel state ────────────────────────────────────────────────── */
  const [difficulty, setDifficulty] = useState<PointValue>(200)
  const [questionText, setQuestionText] = useState('')
  const [answerText, setAnswerText] = useState('')
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successFlash, setSuccessFlash] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /* ── Initial load: categories ─────────────────────────────────────────── */
  useEffect(() => {
    fetchAdminCategories()
      .then(setCategories)
      .catch((e) => setLoadError(e instanceof Error ? e.message : 'فشل التحميل'))
  }, [])

  /* ── Group categories by super-category name for the first dropdown ─── */
  const superOptions = useMemo(() => {
    const map = new Map<string, { id: string; name: string; count: number }>()
    for (const c of categories) {
      const key = c.super_category_name_ar ?? '__none__'
      if (!map.has(key)) {
        map.set(key, { id: key, name: c.super_category_name_ar ?? 'بدون فئة رئيسية', count: 0 })
      }
      map.get(key)!.count++
    }
    return Array.from(map.values())
  }, [categories])

  const subOptions = useMemo(
    () => categories.filter((c) => (c.super_category_name_ar ?? '__none__') === superId),
    [categories, superId]
  )

  /* ── When a sub-category is selected, load its questions + counts ───── */
  useEffect(() => {
    if (!subId) {
      setQuestions([])
      setCounts({ c200: 0, c400: 0, c600: 0 })
      setQuestionsError(null)
      return
    }
    setQuestionsError(null)
    Promise.all([fetchQuestionsForCategory(subId), fetchDifficultyCounts(subId)])
      .then(([qs, dc]) => {
        setQuestions(qs)
        setCounts(dc)
      })
      .catch((e) => setQuestionsError(e instanceof Error ? e.message : 'فشل تحميل الأسئلة'))
  }, [subId])

  /* ── Cleanup object URL when media changes / component unmounts ────── */
  useEffect(() => {
    return () => {
      if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl)
    }
  }, [mediaPreviewUrl])

  /* ── File selection (click or drop) ─────────────────────────────────── */
  const handleFileChosen = (file: File | null) => {
    if (!file) return
    if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl)
    setMediaFile(file)
    setMediaPreviewUrl(URL.createObjectURL(file))
    setSubmitError(null)
  }

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileChosen(e.target.files?.[0] ?? null)
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileChosen(e.dataTransfer.files?.[0] ?? null)
  }

  /* ── Deactivate (soft delete) ───────────────────────────────────────── */
  const handleDelete = async (q: AdminQuestion) => {
    if (!confirm(`حذف هذا السؤال؟\n\n${q.question_text_ar}`)) return
    try {
      await deactivateQuestion(q.id)
      setQuestions((prev) => prev.filter((x) => x.id !== q.id))
      // Update counts optimistically
      setCounts((prev) => {
        const key = q.point_value === 200 ? 'c200' : q.point_value === 400 ? 'c400' : 'c600'
        return { ...prev, [key]: Math.max(0, prev[key] - 1) }
      })
    } catch (e) {
      alert(e instanceof Error ? e.message : 'فشل الحذف')
    }
  }

  /* ── Submit new question ────────────────────────────────────────────── */
  const handleSubmit = async () => {
    if (!subId) {
      setSubmitError('اختر فئة أولاً')
      return
    }
    if (!questionText.trim() || !answerText.trim()) {
      setSubmitError('نص السؤال والإجابة مطلوبان')
      return
    }
    setIsUploading(true)
    setUploadProgress(0)
    setSubmitError(null)
    try {
      let mediaUrl: string | null = null
      if (mediaFile) {
        // Simulated progress — Supabase JS SDK doesn't emit real progress events,
        // so we tick a counter for UX feedback.
        const ticker = setInterval(() => {
          setUploadProgress((p) => Math.min(p + 10, 90))
        }, 150)
        try {
          mediaUrl = await uploadQuestionMedia(mediaFile)
        } finally {
          clearInterval(ticker)
          setUploadProgress(100)
        }
      }
      await addQuestion({
        categoryId: subId,
        pointValue: difficulty,
        questionTextAr: questionText,
        answerTextAr: answerText,
        mediaUrl,
      })
      // Reset form
      setQuestionText('')
      setAnswerText('')
      if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl)
      setMediaFile(null)
      setMediaPreviewUrl(null)
      setUploadProgress(0)
      // Refresh list + counts
      const [qs, dc] = await Promise.all([
        fetchQuestionsForCategory(subId),
        fetchDifficultyCounts(subId),
      ])
      setQuestions(qs)
      setCounts(dc)
      setSuccessFlash(true)
      setTimeout(() => setSuccessFlash(false), 2000)
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'فشل الحفظ')
    } finally {
      setIsUploading(false)
    }
  }

  /* ── Playability pill logic ─────────────────────────────────────────── */
  const totalActive = counts.c200 + counts.c400 + counts.c600
  const isPlayable = counts.c200 >= 2 && counts.c400 >= 2 && counts.c600 >= 2

  const selectedCategory = categories.find((c) => c.id === subId) ?? null

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ── Page header ──────────────────────────────────────────────── */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold">إدارة الأسئلة</h1>
          <a
            href="/admin"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← العودة
          </a>
        </header>

        {loadError ? (
          <p className="bg-red-900/30 text-red-300 rounded-2xl p-4 text-sm font-mono" dir="ltr" style={{ textAlign: 'left' }}>
            {loadError}
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ═══════════════════════════════════════════════════════════
                LEFT PANEL — Category selector + question list
               ═══════════════════════════════════════════════════════════ */}
            <section className="bg-gray-900 rounded-2xl border border-gray-800 p-4 sm:p-6 space-y-5">
              <h2 className="text-lg font-bold text-gray-200">اختر فئة</h2>

              {/* Super-category dropdown */}
              <div>
                <label htmlFor="super-select" className="block text-xs text-gray-400 mb-1">
                  الفئة الرئيسية
                </label>
                <select
                  id="super-select"
                  value={superId}
                  onChange={(e) => { setSuperId(e.target.value); setSubId('') }}
                  className="w-full rounded-xl bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FB6B2C]"
                >
                  <option value="">— اختر —</option>
                  {superOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub-category dropdown */}
              <div>
                <label htmlFor="sub-select" className="block text-xs text-gray-400 mb-1">
                  الفئة الفرعية
                </label>
                <select
                  id="sub-select"
                  value={subId}
                  onChange={(e) => setSubId(e.target.value)}
                  disabled={!superId}
                  className="w-full rounded-xl bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FB6B2C] disabled:opacity-50"
                >
                  <option value="">— اختر —</option>
                  {subOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name_ar} ({c.active_question_count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Playability status pill */}
              {subId && (
                <div className="pt-2">
                  {isPlayable ? (
                    <span className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 border border-green-500/40 rounded-full px-3 py-1 text-xs font-bold">
                      🟢 جاهز للعب
                    </span>
                  ) : totalActive === 0 ? (
                    <span className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 border border-red-500/40 rounded-full px-3 py-1 text-xs font-bold">
                      🔴 فارغ — لا أسئلة
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full px-3 py-1 text-xs font-bold">
                      🟡 ناقص — {totalActive}/6 أسئلة
                    </span>
                  )}
                  <p className="text-[11px] text-gray-500 mt-2 tabular-nums" dir="ltr" style={{ textAlign: 'left' }}>
                    200: {counts.c200}  ·  400: {counts.c400}  ·  600: {counts.c600}
                  </p>
                </div>
              )}

              {/* Existing questions list */}
              {subId && (
                <div className="border-t border-gray-800 pt-4 space-y-2">
                  <h3 className="text-sm font-bold text-gray-300 mb-2">
                    الأسئلة الحالية ({questions.length})
                  </h3>
                  {questionsError ? (
                    <p className="text-red-400 text-xs font-mono" dir="ltr" style={{ textAlign: 'left' }}>
                      {questionsError}
                    </p>
                  ) : questions.length === 0 ? (
                    <p className="text-gray-500 text-xs text-center py-6">
                      لا توجد أسئلة بعد — أضف واحداً من اللوحة اليمنى
                    </p>
                  ) : (
                    <ul className="space-y-2 max-h-96 overflow-y-auto pe-1">
                      {questions.map((q) => (
                        <li
                          key={q.id}
                          className={`flex items-center gap-3 rounded-xl bg-gray-800/60 border border-gray-700/50 p-2.5 ${!q.is_active ? 'opacity-50' : ''}`}
                        >
                          <DifficultyPill value={q.point_value} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white truncate">
                              {q.question_text_ar}
                            </p>
                          </div>
                          {q.media_kind === 'video' ? (
                            <span
                              className="text-base flex-shrink-0"
                              aria-label="فيديو"
                              title="فيديو"
                            >
                              🎬
                            </span>
                          ) : q.media_kind === 'image' ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={q.media_url!}
                              alt=""
                              className="w-8 h-8 rounded object-cover flex-shrink-0"
                            />
                          ) : null}
                          <button
                            type="button"
                            onClick={() => handleDelete(q)}
                            className="w-7 h-7 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/40 flex items-center justify-center flex-shrink-0 text-sm font-bold transition-colors"
                            aria-label="حذف"
                            title="حذف"
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </section>

            {/* ═══════════════════════════════════════════════════════════
                RIGHT PANEL — Add-question form
               ═══════════════════════════════════════════════════════════ */}
            <section className="bg-gray-900 rounded-2xl border border-gray-800 p-4 sm:p-6 space-y-5">
              {!subId ? (
                <div className="min-h-[400px] flex items-center justify-center text-center">
                  <div>
                    <p className="text-5xl mb-4" aria-hidden="true">👈</p>
                    <p className="text-gray-400 text-sm">
                      اختر فئة من اليسار للبدء
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Selected category (read-only display) */}
                  <div>
                    <span className="text-xs text-gray-400 block mb-1">الفئة المختارة</span>
                    <div className="rounded-xl bg-gray-800 border border-gray-700 px-3 py-2 text-sm">
                      {selectedCategory ? (
                        <>
                          <span className="text-white font-bold">{selectedCategory.name_ar}</span>
                          {selectedCategory.super_category_name_ar && (
                            <span className="text-gray-400 text-xs me-2">
                              ({selectedCategory.super_category_name_ar})
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </div>
                  </div>

                  {/* Difficulty selector */}
                  <div>
                    <span className="text-xs text-gray-400 block mb-2">المستوى</span>
                    <div className="grid grid-cols-3 gap-2">
                      {POINT_OPTIONS.map((opt) => {
                        const active = difficulty === opt.value
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setDifficulty(opt.value)}
                            className={[
                              'rounded-xl py-3 text-sm font-bold transition-all',
                              active
                                ? `${opt.color} text-white shadow-lg scale-105`
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700',
                            ].join(' ')}
                          >
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Question text */}
                  <div>
                    <label htmlFor="q-text" className="text-xs text-gray-400 block mb-1">
                      نص السؤال
                    </label>
                    <textarea
                      id="q-text"
                      rows={4}
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      placeholder="اكتب نص السؤال هنا..."
                      className="w-full rounded-xl bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FB6B2C] text-start"
                      dir="rtl"
                    />
                  </div>

                  {/* Answer text */}
                  <div>
                    <label htmlFor="a-text" className="text-xs text-gray-400 block mb-1">
                      الإجابة الصحيحة
                    </label>
                    <input
                      id="a-text"
                      type="text"
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="الإجابة الصحيحة"
                      className="w-full rounded-xl bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FB6B2C] text-start"
                      dir="rtl"
                    />
                  </div>

                  {/* Media upload */}
                  <div>
                    <span className="text-xs text-gray-400 block mb-1">
                      صورة أو فيديو (اختياري)
                    </span>
                    {!mediaPreviewUrl ? (
                      <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={onDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={[
                          'rounded-xl border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-colors',
                          isDragging
                            ? 'border-[#FB6B2C] bg-[#FB6B2C]/10'
                            : 'border-gray-700 hover:border-gray-500 bg-gray-800/50',
                        ].join(' ')}
                      >
                        <p className="text-2xl mb-1" aria-hidden="true">📎</p>
                        <p className="text-xs text-gray-400">
                          اسحب الملف هنا أو اضغط للاختيار
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">
                          صورة أو فيديو (mp4, webm, mov)
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*,video/mp4,video/webm,video/quicktime"
                          onChange={onFileInputChange}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-3">
                        <div className="flex justify-center mb-2">
                          {mediaFile && VIDEO_RE.test(mediaFile.name) ? (
                            <video
                              src={mediaPreviewUrl}
                              controls
                              className="max-h-40 max-w-full rounded-lg"
                            />
                          ) : (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={mediaPreviewUrl}
                              alt="معاينة"
                              className="max-h-40 max-w-full rounded-lg object-contain"
                            />
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 truncate flex-1 ms-2">
                            {mediaFile?.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl)
                              setMediaFile(null)
                              setMediaPreviewUrl(null)
                            }}
                            className="text-red-400 hover:text-red-300 font-bold"
                          >
                            إزالة
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Upload progress bar */}
                  {isUploading && (
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#FB6B2C] h-full transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}

                  {/* Error / success messages */}
                  {submitError && (
                    <p className="bg-red-900/30 text-red-300 rounded-xl px-3 py-2 text-xs font-mono" dir="ltr" style={{ textAlign: 'left' }}>
                      {submitError}
                    </p>
                  )}
                  {successFlash && (
                    <p className="bg-green-900/30 text-green-300 rounded-xl px-3 py-2 text-sm font-bold text-center">
                      ✓ تمت الإضافة
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isUploading}
                    className="w-full rounded-2xl bg-[#FB6B2C] py-3 text-white font-bold text-base shadow-[0_6px_0_0_rgba(0,0,0,0.35)] hover:brightness-110 active:translate-y-[6px] active:shadow-[0_0px_0_0_rgba(0,0,0,0.35)] transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0"
                  >
                    {isUploading ? 'جاري الرفع…' : 'إضافة السؤال'}
                  </button>
                </>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  )
}

/* ── Small pill component for the difficulty badge ────────────────────── */
function DifficultyPill({ value }: { value: PointValue }) {
  const cls =
    value === 200 ? 'bg-green-500' :
    value === 400 ? 'bg-amber-500' :
    'bg-red-500'
  return (
    <span
      className={`${cls} text-white text-[10px] font-bold rounded-full px-2 py-0.5 flex-shrink-0 tabular-nums`}
    >
      {value}
    </span>
  )
}
