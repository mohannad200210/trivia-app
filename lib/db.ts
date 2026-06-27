/**
 * lib/db.ts — All Supabase write operations for a game session.
 *
 * Keep write logic here, not in components (SKILL.md §3).
 * Components call these functions and stay presentational.
 *
 * Write functions used inside game event handlers are fire-and-forget:
 * callers do NOT await them so the UI stays snappy. Errors are logged
 * but never crash the session — a failed DB write should never kill gameplay.
 */

import { supabase } from '@/lib/supabase'

// ── Game lifecycle ─────────────────────────────────────────────────────────────

/**
 * Create a new game row and return its UUID.
 * Called once when the host taps "ابدأ اللعبة" on the teams screen.
 */
export async function createGame(
  hostSessionId: string,
  categoryIds: string[],
  difficulty: 'easy' | 'medium' | 'hard'
): Promise<string> {
  const { data, error } = await supabase
    .from('games')
    .insert({
      host_session_id: hostSessionId,
      selected_category_ids: categoryIds,
      difficulty,
      status: 'active',
      is_free_game: true,
    })
    .select('id')
    .single()

  if (error) throw new Error(`createGame failed: ${error.message}`)
  return (data as { id: string }).id
}

/**
 * Update the game status to 'finished'.
 * Called when all questions are answered or host taps "إنهاء اللعبة".
 * Fire-and-forget — log errors, never throw.
 */
export function finishGame(gameId: string): void {
  supabase
    .from('games')
    .update({ status: 'finished' })
    .eq('id', gameId)
    .then(({ error }) => {
      if (error) console.error('finishGame failed:', error.message)
    })
}

// ── Teams ──────────────────────────────────────────────────────────────────────

/**
 * Insert team rows linked to a game, return teams with their Supabase UUIDs.
 * Called immediately after createGame on the teams screen.
 */
export async function createTeams(
  gameId: string,
  teams: { name: string; color: string }[]
): Promise<{ id: string; name: string; color: string }[]> {
  const rows = teams.map((t) => ({
    game_id: gameId,
    name: t.name,
    color: t.color,
    score: 0,
  }))

  const { data, error } = await supabase
    .from('teams')
    .insert(rows)
    .select('id, name, color')

  if (error) throw new Error(`createTeams failed: ${error.message}`)
  return data as { id: string; name: string; color: string }[]
}

/**
 * Update a team's score column.
 * Fire-and-forget — log errors, never throw.
 */
export function updateTeamScore(teamId: string, newScore: number): void {
  supabase
    .from('teams')
    .update({ score: newScore })
    .eq('id', teamId)
    .then(({ error }) => {
      if (error) console.error('updateTeamScore failed:', error.message)
    })
}

// ── Questions ──────────────────────────────────────────────────────────────────

/**
 * Record a played question row.
 * `answeredByTeamId` is null when the host skips (no team got it right).
 * Fire-and-forget — log errors, never throw.
 */
export function recordGameQuestion(
  gameId: string,
  questionId: string,
  orderIndex: number,
  answeredByTeamId: string | null
): void {
  supabase
    .from('game_questions')
    .insert({
      game_id: gameId,
      question_id: questionId,
      order_index: orderIndex,
      answered_by_team_id: answeredByTeamId,
    })
    .then(({ error }) => {
      if (error) console.error('recordGameQuestion failed:', error.message)
    })
}
