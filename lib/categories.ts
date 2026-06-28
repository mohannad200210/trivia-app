/**
 * categories.ts — Hard-coded category list for Phase 1 (pre-Supabase).
 * Swap the data source to a Supabase query in Phase 1 once the project URL is set.
 * Colours and emojis are intentionally varied per SKILL.md §7 (no single brand colour).
 */

export interface LocalCategory {
  id: string
  name_ar: string
  name_en: string
  emoji: string
  /** Hex accent colour — unique per category */
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

/** Lookup by name_en — used by the categories page to map Supabase rows to visuals. */
export const CATEGORY_META: Record<string, { emoji: string; color: string }> =
  Object.fromEntries(
    LOCAL_CATEGORIES.map((c) => [c.name_en, { emoji: c.emoji, color: c.color }])
  )
