/**
 * admin.ts — Admin dashboard data layer.
 *
 * Used exclusively by /admin/* pages. No gameplay pages depend on this.
 * No auth yet — that ships in Phase 2 (see SKILL.md §11).
 *
 * Conventions:
 *  - All queries go through the anon Supabase client. RLS policies in
 *    Supabase gate write access on the `questions` and `storage.objects`
 *    tables. Without RLS or service-role keys, these calls only work if
 *    the anon role is allowed to INSERT/UPDATE on those tables.
 *  - Functions throw on Supabase errors so the caller can render an
 *    error boundary message. The page also catches them.
 */

import { supabase } from './supabase'
import type { PointValue, Question } from './types'

/* ─── Shapes used by the admin UI ────────────────────────────────────────── */

/** A category with its super-category name + active question count. */
export interface AdminCategory {
  id: string
  name_ar: string
  name_en: string
  super_category_name_ar: string | null
  active_question_count: number
}

/** A question row decorated with the computed thumbnail kind. */
export interface AdminQuestion extends Question {
  /** "image" | "video" | null — derived from media_url extension. */
  media_kind: 'image' | 'video' | null
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const VIDEO_RE = /\.(mp4|webm|mov|avi)$/i

function classifyMedia(url: string | null): 'image' | 'video' | null {
  if (!url) return null
  return VIDEO_RE.test(url) ? 'video' : 'image'
}

/* ─── 1. fetchAdminCategories ────────────────────────────────────────────── */

/**
 * Fetch all categories with their super-category name and active question count.
 * Sorted by super_category.sort_order, then categories.sort_order.
 */
export async function fetchAdminCategories(): Promise<AdminCategory[]> {
  // 1. Categories
  const { data: cats, error: catErr } = await supabase
    .from('categories')
    .select('id, name_ar, name_en, sort_order, super_category_id')
    .order('sort_order', { ascending: true })

  if (catErr) throw new Error(`fetchAdminCategories (cats) failed: ${catErr.message}`)

  // 2. Super-categories (so we can attach name_ar)
  const { data: supers, error: supErr } = await supabase
    .from('super_categories')
    .select('id, name_ar, sort_order')
    .order('sort_order', { ascending: true })

  if (supErr) throw new Error(`fetchAdminCategories (supers) failed: ${supErr.message}`)

  const supNameById = new Map<string, string>()
  for (const s of supers ?? []) {
    supNameById.set(s.id, s.name_ar)
  }

  // 3. Active question counts per category
  const { data: qRows, error: qErr } = await supabase
    .from('questions')
    .select('category_id')
    .eq('is_active', true)

  if (qErr) throw new Error(`fetchAdminCategories (counts) failed: ${qErr.message}`)

  const countByCat = new Map<string, number>()
  for (const q of qRows ?? []) {
    countByCat.set(q.category_id, (countByCat.get(q.category_id) ?? 0) + 1)
  }

  return (cats ?? []).map((c) => ({
    id: c.id,
    name_ar: c.name_ar,
    name_en: c.name_en,
    super_category_name_ar: c.super_category_id
      ? supNameById.get(c.super_category_id) ?? null
      : null,
    active_question_count: countByCat.get(c.id) ?? 0,
  }))
}

/* ─── 2. fetchQuestionsForCategory ───────────────────────────────────────── */

/**
 * Fetch all (active + inactive) questions for a chosen category.
 * Ordered by point_value ascending, then id ascending.
 */
export async function fetchQuestionsForCategory(
  categoryId: string
): Promise<AdminQuestion[]> {
  // questions table has no created_at column — order by id for stable display.
  const { data, error } = await supabase
    .from('questions')
    .select('id, category_id, point_value, question_text_ar, answer_text_ar, media_url, is_active')
    .eq('category_id', categoryId)
    .order('point_value', { ascending: true })
    .order('id', { ascending: true })

  if (error) {
    throw new Error(`fetchQuestionsForCategory failed: ${error.message}`)
  }

  return (data ?? []).map((q) => ({
    id: q.id,
    category_id: q.category_id,
    point_value: q.point_value,
    question_text_ar: q.question_text_ar,
    answer_text_ar: q.answer_text_ar,
    media_url: q.media_url,
    is_active: q.is_active,
    created_at: '',  // not present in this table — kept for shape compatibility
    media_kind: classifyMedia(q.media_url),
  }))
}

/* ─── 3. addQuestion ─────────────────────────────────────────────────────── */

export interface AddQuestionParams {
  categoryId: string
  pointValue: PointValue
  questionTextAr: string
  answerTextAr: string
  mediaUrl: string | null
}

/**
 * Insert one question row. Returns the new question id.
 */
export async function addQuestion(params: AddQuestionParams): Promise<string> {
  const row = {
    category_id: params.categoryId,
    point_value: params.pointValue,
    question_text_ar: params.questionTextAr.trim(),
    answer_text_ar: params.answerTextAr.trim(),
    media_url: params.mediaUrl,
    is_active: true,
  }

  const { data, error } = await supabase
    .from('questions')
    .insert(row)
    .select('id')
    .single()

  if (error) throw new Error(`addQuestion failed: ${error.message}`)
  if (!data) throw new Error('addQuestion returned no id')
  return data.id
}

/* ─── 4. deactivateQuestion ──────────────────────────────────────────────── */

/**
 * Soft-delete a question by setting is_active = false.
 * The row stays in the table for audit / undo, but is hidden everywhere else.
 */
export async function deactivateQuestion(questionId: string): Promise<void> {
  const { error } = await supabase
    .from('questions')
    .update({ is_active: false })
    .eq('id', questionId)

  if (error) throw new Error(`deactivateQuestion failed: ${error.message}`)
}

/* ─── 5. uploadQuestionMedia ─────────────────────────────────────────────── */

const STORAGE_BUCKET = 'question-media'

/**
 * Upload a single image or video file to the `question-media` bucket and
 * return its public URL.
 *
 * Path pattern: `${Date.now()}-${random}.${ext}` — collision-resistant
 * and easy to read in the dashboard.
 */
export async function uploadQuestionMedia(file: File): Promise<string> {
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase()
  const random = Math.random().toString(36).slice(2, 10)
  const path = `${Date.now()}-${random}.${ext}`

  const { error: upErr } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || undefined,
    })

  if (upErr) throw new Error(`uploadQuestionMedia failed: ${upErr.message}`)

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  if (!data?.publicUrl) {
    throw new Error('uploadQuestionMedia: no public URL returned')
  }
  return data.publicUrl
}

/* ─── Bonus: per-difficulty question counts (used by the playability pill) */

export interface DifficultyCounts {
  c200: number
  c400: number
  c600: number
}

/** Count active questions for a single category, grouped by point_value. */
export async function fetchDifficultyCounts(
  categoryId: string
): Promise<DifficultyCounts> {
  const { data, error } = await supabase
    .from('questions')
    .select('point_value')
    .eq('category_id', categoryId)
    .eq('is_active', true)

  if (error) throw new Error(`fetchDifficultyCounts failed: ${error.message}`)

  const counts: DifficultyCounts = { c200: 0, c400: 0, c600: 0 }
  for (const q of data ?? []) {
    if (q.point_value === 200) counts.c200++
    else if (q.point_value === 400) counts.c400++
    else if (q.point_value === 600) counts.c600++
  }
  return counts
}
