'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import CategoryCard from '@/components/game/CategoryCard'
import { supabase } from '@/lib/supabase'
import { CATEGORY_META, type LocalCategory } from '@/lib/categories'

const MAX_CATEGORIES = 6

export default function CategoriesPage() {
  const router = useRouter()

  // ── Categories from Supabase ───────────────────────────────────────────────
  const [categories, setCategories] = useState<LocalCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('categories')
      .select('id, name_ar, name_en, sort_order')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setFetchError(error.message)
        } else if (data) {
          setCategories(
            data.map((cat) => ({
              id: cat.id as string,
              name_ar: cat.name_ar as string,
              name_en: cat.name_en as string,
              emoji: CATEGORY_META[cat.name_en as string]?.emoji ?? '❓',
              color: CATEGORY_META[cat.name_en as string]?.color ?? '#2D6A4F',
            }))
          )
        }
        setLoading(false)
      })
  }, [])

  // ── Selection state ────────────────────────────────────────────────────────
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id)
      if (prev.length >= MAX_CATEGORIES) return prev
      return [...prev, id]
    })
  }

  const handleNext = () => {
    if (selected.length === 0) return
    const params = new URLSearchParams({ categories: selected.join(',') })
    router.push(`/difficulty?${params.toString()}`)
  }

  const selectionLabel =
    selected.length === 0
      ? 'اختر فئة واحدة على الأقل'
      : selected.length === MAX_CATEGORIES
      ? `تم اختيار ${MAX_CATEGORIES} فئات (الحد الأقصى)`
      : `${selected.length} / ${MAX_CATEGORIES} فئات مختارة`

  return (
    // DESIGN.md: Primary gradient as page background on every screen
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-[#FB6B2C] to-[#C61E45]">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="pt-10 pb-4 text-center px-4 sm:px-8">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="mb-6 text-white/70 hover:text-white text-sm transition-colors"
          aria-label="العودة للصفحة الرئيسية"
        >
          ← العودة
        </button>
        {/* DESIGN.md h2: text-3xl sm:text-4xl font-bold text-white */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          اختر الفئات
        </h1>
        <p className="text-white/70 text-base font-medium">
          اختر حتى{' '}
          <span className="text-white font-bold">{MAX_CATEGORIES}</span>
          {' '}فئات
        </p>
      </header>

      {/* ── Category grid ──────────────────────────────────────────────────── */}
      <section
        aria-label="فئات الأسئلة"
        className="flex-1 px-4 sm:px-8 py-4 max-w-5xl mx-auto w-full"
      >
        {/* Error */}
        {fetchError && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <span className="text-5xl" aria-hidden="true">⚠️</span>
            <p className="text-white font-bold text-lg">تعذّر تحميل الفئات</p>
            <p className="text-white/60 text-sm">{fetchError}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full bg-white text-[#C61E45] font-bold px-6 py-2 text-sm
                         shadow-[0_6px_0_0_rgba(0,0,0,0.25)] transition-all duration-100
                         active:translate-y-[6px] active:shadow-none"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Loading skeleton — DESIGN.md tile radius */}
        {loading && !fetchError && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-36 rounded-2xl bg-white/20 animate-pulse"
                aria-hidden="true"
              />
            ))}
          </div>
        )}

        {/* Loaded grid */}
        {!loading && !fetchError && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                selected={selected.includes(cat.id)}
                disabled={
                  selected.length >= MAX_CATEGORIES &&
                  !selected.includes(cat.id)
                }
                onToggle={toggle}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Footer / next action ────────────────────────────────────────────── */}
      <footer className="sticky bottom-0 bg-black/30 backdrop-blur-md border-t border-white/20 px-4 sm:px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <p
            id="selection-status"
            aria-live="polite"
            className="text-sm text-white/70 font-medium"
          >
            {loading ? 'جارٍ التحميل…' : selectionLabel}
          </p>

          {/* DESIGN.md chunky button style */}
          <button
            id="next-to-difficulty"
            type="button"
            onClick={handleNext}
            disabled={selected.length === 0 || loading}
            className={[
              'rounded-full text-lg font-bold px-8 py-3 transition-all duration-100',
              selected.length > 0 && !loading
                ? 'bg-white text-[#C61E45] shadow-[0_6px_0_0_rgba(0,0,0,0.25)] active:translate-y-[6px] active:shadow-none hover:brightness-95'
                : 'bg-white/30 text-white/50 cursor-not-allowed',
            ].join(' ')}
          >
            التالي ←
          </button>
        </div>
      </footer>
    </main>
  )
}
