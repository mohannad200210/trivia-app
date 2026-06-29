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
import type { Category, SuperCategory, CategoryExtended, SuperCategoryWithSubs } from './types'

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

/**
 * Fetch all super-categories and their sub-categories in one round-trip.
 * Returns them sorted by super_category.sort_order, with subcategories
 * sorted by categories.sort_order within each group.
 *
 * Used exclusively by /create-game. Does not affect board/game pages.
 *
 * Graceful fallback: returns [] on any error (DB unreachable, missing
 * tables, etc.) so the page renders an empty state instead of crashing.
 */
export async function fetchGroupedCategories(): Promise<SuperCategoryWithSubs[]> {
  try {
    // 1. Fetch super-categories
    const { data: supers, error: supErr } = await supabase
      .from('super_categories')
      .select('id, name_ar, icon_emoji, icon_url, sort_order')
      .order('sort_order', { ascending: true })

    if (supErr) throw new Error(`fetchGroupedCategories (supers) failed: ${supErr.message}`)

    // 2. Fetch all sub-categories (new columns included)
    const { data: cats, error: catErr } = await supabase
      .from('categories')
      .select('id, name_ar, name_en, icon_url, sort_order, super_category_id, cover_image_url, remaining_games, star_rating')
      .order('sort_order', { ascending: true })

    if (catErr) throw new Error(`fetchGroupedCategories (cats) failed: ${catErr.message}`)

    // 3. Determine which category IDs are "playable" (have >=2 active questions
    //    for EACH of 200, 400, 600 — required by create_board_game RPC).
    const { data: qCounts } = await supabase
      .from('questions')
      .select('category_id, point_value')
      .eq('is_active', true)

    const countMap = new Map<string, Map<number, number>>()
    for (const q of qCounts ?? []) {
      if (!countMap.has(q.category_id)) countMap.set(q.category_id, new Map())
      const pv = countMap.get(q.category_id)!
      pv.set(q.point_value, (pv.get(q.point_value) ?? 0) + 1)
    }
    const playableIds = new Set<string>()
    Array.from(countMap.entries()).forEach(([catId, pvMap]) => {
      if (
        (pvMap.get(200) ?? 0) >= 2 &&
        (pvMap.get(400) ?? 0) >= 2 &&
        (pvMap.get(600) ?? 0) >= 2
      ) {
        playableIds.add(catId)
      }
    })

    // 4. Group sub-categories under their super-category, decorating with has_questions
    const superMap = new Map<string, CategoryExtended[]>()
    for (const cat of cats ?? []) {
      if (!cat.super_category_id) continue
      if (!superMap.has(cat.super_category_id)) {
        superMap.set(cat.super_category_id, [])
      }
      superMap.get(cat.super_category_id)!.push({
        ...(cat as CategoryExtended),
        has_questions: playableIds.has(cat.id),
      })
    }

    return (supers ?? []).map((s) => ({
      superCategory: s as SuperCategory,
      subcategories: superMap.get(s.id) ?? [],
    }))
  } catch (err) {
    console.error('fetchGroupedCategories failed:', err)
    return []
  }
}
