import { supabase } from './supabase'
import type { BoardData, Category } from './types'

/**
 * board.ts — /board data fetcher per /SKILL.md §5.
 *
 * Loads everything the board page needs in four parallel queries:
 *   1. the game row (current_turn_team_id, status)
 *   2. the 2 teams (name, color, score)
 *   3. the 36 game_cells (id, point_value, slot_index, is_answered, ...)
 *   4. the 8 categories (for column header names)
 *
 * The page joins cells <-> categories client-side via category_id. We
 * intentionally avoid Supabase's embed syntax here: without a typed
 * Database, the inferred shape of `categories(...)` (single object vs
 * array) is ambiguous, and a separate fetch is one extra round-trip
 * for 8 rows that changes nothing perf-wise.
 */

export async function fetchBoardData(gameId: string): Promise<BoardData> {
  const [gameRes, teamsRes, cellsRes, categoriesRes] = await Promise.all([
    supabase
      .from('games')
      .select('id, created_at, host_session_id, status, selected_category_ids, current_turn_team_id')
      .eq('id', gameId)
      .single(),
    supabase
      .from('teams')
      .select('id, game_id, name, color, score, display_order')
      .eq('game_id', gameId)
      .order('display_order', { ascending: true, nullsFirst: false }),
    supabase
      .from('game_cells')
      .select('id, game_id, category_id, point_value, slot_index, question_id, is_answered, answered_by_team_id')
      .eq('game_id', gameId),
    supabase
      .from('categories')
      .select('id, name_ar, name_en, icon_url, sort_order')
      .order('sort_order', { ascending: true }),
  ])

  if (gameRes.error) {
    throw new Error(`fetchBoardData: game lookup failed: ${gameRes.error.message}`)
  }
  if (!gameRes.data) {
    throw new Error('fetchBoardData: game not found')
  }
  if (teamsRes.error) {
    throw new Error(`fetchBoardData: teams lookup failed: ${teamsRes.error.message}`)
  }
  if (cellsRes.error) {
    throw new Error(`fetchBoardData: cells lookup failed: ${cellsRes.error.message}`)
  }
  if (categoriesRes.error) {
    throw new Error(`fetchBoardData: categories lookup failed: ${categoriesRes.error.message}`)
  }

  return {
    game: gameRes.data,
    teams: teamsRes.data ?? [],
    cells: cellsRes.data ?? [],
    categories: (categoriesRes.data ?? []) as Category[],
  }
}
