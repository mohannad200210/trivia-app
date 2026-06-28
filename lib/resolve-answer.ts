import { supabase } from './supabase'
import type { ResolveAnswerParams } from './types'

/**
 * resolve-answer.ts — Client wrapper for the resolve_answer RPC.
 *
 * Atomic per /SKILL.md §5 + §6: awards points, marks the cell answered,
 * and always flips the turn to the other team. Throws on RPC failure
 * (the page should show the error and let the host retry).
 */
export async function resolveAnswer(params: ResolveAnswerParams): Promise<void> {
  const { data, error } = await supabase.rpc('resolve_answer', {
    p_cell_id: params.cellId,
    p_awarded_team_id: params.awardedTeamId,
  })

  if (error) {
    throw new Error(`resolve_answer failed: ${error.message}`)
  }
  // The function returns void; data is null. The check above is just to
  // satisfy the linter — we don't use the return value.
  void data
}
