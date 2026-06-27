/**
 * lib/questions.ts — Supabase question queries.
 *
 * Drop-in replacement for lib/mock-questions.ts.
 * The function signature matches exactly; return type changes from Question[]
 * to Promise<Question[]> — the only change callers need.
 *
 * SKILL.md §9: never pull more than needed — filter category + difficulty
 * in the query, not client-side on a full table dump.
 */

import { supabase } from '@/lib/supabase'
import type { Question } from '@/lib/types'

// ── Fisher-Yates shuffle ──────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Fetch `count` random questions filtered by category UUIDs and difficulty.
 *
 * Strategy: request up to `count × 3` rows (all filtered server-side),
 * shuffle client-side, return the first `count`. This keeps the query
 * tight while giving enough variety even if some categories are small.
 *
 * @param categoryIds - Real Supabase category UUIDs (empty = all categories)
 * @param difficulty  - 'easy' | 'medium' | 'hard'
 * @param count       - Questions per game (default 10)
 * @throws            - If Supabase returns an error (play page shows fallback)
 */
export async function selectQuestions(
  categoryIds: string[],
  difficulty: 'easy' | 'medium' | 'hard',
  count = 10
): Promise<Question[]> {
  const pool = count * 3 // fetch a pool; shuffle for randomness

  let query = supabase
    .from('questions')
    .select(
      'id, category_id, difficulty, question_text_ar, question_text_en, choices, correct_choice_id, media_url, is_active'
    )
    .eq('difficulty', difficulty)
    .eq('is_active', true)
    .limit(pool)

  // Only filter by category if specific ones were chosen
  if (categoryIds.length > 0) {
    query = query.in('category_id', categoryIds)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`selectQuestions failed: ${error.message}`)
  }

  if (!data || data.length === 0) return []

  // choices is returned as jsonb — matches Choice[] per SKILL.md §4 schema
  return shuffle(data as Question[]).slice(0, count)
}
