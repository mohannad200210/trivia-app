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

export const LOCAL_CATEGORIES: LocalCategory[] = [
  { id: 'general',  name_ar: 'معلومات عامة',   name_en: 'General Knowledge', emoji: '🧠', color: '#6366f1' },
  { id: 'geo',      name_ar: 'جغرافيا',          name_en: 'Geography',         emoji: '🌍', color: '#14b8a6' },
  { id: 'sports',   name_ar: 'رياضة',            name_en: 'Sports',            emoji: '⚽', color: '#f97316' },
  { id: 'movies',   name_ar: 'أفلام ومسلسلات',  name_en: 'Movies & TV',       emoji: '🎬', color: '#ec4899' },
  { id: 'history',  name_ar: 'تاريخ',            name_en: 'History',           emoji: '📜', color: '#f59e0b' },
  { id: 'science',  name_ar: 'علوم',             name_en: 'Science',           emoji: '🔬', color: '#06b6d4' },
  { id: 'gaming',   name_ar: 'ألعاب',            name_en: 'Gaming',            emoji: '🎮', color: '#22c55e' },
  { id: 'art',      name_ar: 'فن وموسيقى',      name_en: 'Art & Music',       emoji: '🎵', color: '#a855f7' },
]
