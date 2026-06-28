import { supabase } from './supabase'

/**
 * finish-game.ts — Mark a game as finished.
 *
 * Used by the "انتهاء اللعبة" button on /board, /question, /answer, and
 * by the /board auto-finish check when all 36 cells are answered. A
 * simple UPDATE is enough — no RPC needed because the /results page
 * reads the game + teams independently, so atomicity with reading
 * scores isn't required.
 *
 * The function is idempotent: setting status to 'finished' when it's
 * already 'finished' is a no-op.
 */

export async function finishGame(gameId: string): Promise<void> {
  const { error } = await supabase
    .from('games')
    .update({ status: 'finished' })
    .eq('id', gameId)

  if (error) {
    throw new Error(`finishGame failed: ${error.message}`)
  }
}
