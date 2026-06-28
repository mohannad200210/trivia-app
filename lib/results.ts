import { supabase } from './supabase'
import type { ResultsData } from './types'

/**
 * results.ts — /results data fetcher per /SKILL.md §5.
 *
 * Two parallel queries: the game row (for status display) and the 2
 * teams ordered by display_order (so the winner/tie rendering can
 * reference them in stable order).
 *
 * We don't need the 36 game_cells on /results — the cell-level state
 * was the board's concern, not the final scoreboard.
 */

export async function fetchResultsData(gameId: string): Promise<ResultsData> {
  const [gameRes, teamsRes] = await Promise.all([
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
  ])

  if (gameRes.error) {
    throw new Error(`fetchResultsData: game lookup failed: ${gameRes.error.message}`)
  }
  if (!gameRes.data) {
    throw new Error('fetchResultsData: game not found')
  }
  if (teamsRes.error) {
    throw new Error(`fetchResultsData: teams lookup failed: ${teamsRes.error.message}`)
  }

  return {
    game: gameRes.data,
    teams: teamsRes.data ?? [],
  }
}
