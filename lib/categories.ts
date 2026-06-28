/**
 * categories.ts — Visual category config + DB fetch.
 *
 * LOCAL_CATEGORIES is the visual source of truth (emoji + tile color from
 * DESIGN.md). The categories table in Supabase is the canonical id source;
 * fetchCategories() returns DB rows, and callers match by name_en to attach
 * the local visual metadata. This way design tokens stay in code (no need
 * to store colors in the DB) while game_cells FKs still reference real UUIDs.
 */

import { supabase } from './supabase'
import type { Category } from './types'

export interface LocalCategory {
  /** Stable slug — NOT a UUID. Used as a React key and to look up visual meta. */
  id: string
  name_ar: string
  name_en: string
  emoji: string
  /** Hex accent colour — unique per category, exact value from DESIGN.md */
  color: string
}

// DESIGN.md category tile colors — sort_order 1-8, one source of truth
export const LOCAL_CATEGORIES: LocalCategory[] = [
  { id: 'general',  name_ar: 'معلومات عامة',   name_en: 'General Knowledge', emoji: '🧠', color: '#2D6A4F' },
  { id: 'geo',      name_ar: 'جغرافيا',          name_en: 'Geography',         emoji: '🌍', color: '#1B4965' },
  { id: 'sports',   name_ar: 'رياضة',            name_en: 'Sports',            emoji: '⚽', color: '#7B2D8E' },
  { id: 'movies',   name_ar: 'أفلام ومسلسلات',  name_en: 'Movies & TV',       emoji: '🎬', color: '#B5179E' },
  { id: 'history',  name_ar: 'تاريخ',            name_en: 'History',           emoji: '📜', color: '#E85D04' },
  { id: 'science',  name_ar: 'علوم',             name_en: 'Science',           emoji: '🔬', color: '#3A86FF' },
  { id: 'gaming',   name_ar: 'ألعاب',            name_en: 'Gaming',            emoji: '🎮', color: '#6A994E' },
  { id: 'art',      name_ar: 'فن وموسيقى',      name_en: 'Art & Music',       emoji: '🎵', color: '#9D0208' },
]

/** Visual metadata keyed by name_en — used to attach emoji/color to DB rows. */
export const CATEGORY_META: Record<string, { emoji: string; color: string }> =
  Object.fromEntries(
    LOCAL_CATEGORIES.map((c) => [c.name_en, { emoji: c.emoji, color: c.color }])
  )

/** A DB category row decorated with its visual meta. */
export interface CategoryWithMeta extends Category {
  emoji: string
  color: string
}

/** Fetch all categories from the DB, in display order, with visual meta attached. */
export async function fetchCategories(): Promise<CategoryWithMeta[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name_ar, name_en, icon_url, sort_order')
    .order('sort_order', { ascending: true })

  if (error) {
    throw new Error(`fetchCategories failed: ${error.message}`)
  }

  return (data ?? []).map((row) => {
    const meta = CATEGORY_META[row.name_en]
    return {
      ...row,
      emoji: meta?.emoji ?? '❓',
      color: meta?.color ?? '#4A4A52',
    }
  })
}
