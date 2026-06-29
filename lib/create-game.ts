import { supabase } from './supabase'
import type { CreateBoardGameParams } from './types'

/**
 * create-game.ts — Server-side board-game creation per /SKILL.md §4 + §5.
 *
 * Wraps the create_board_game Postgres RPC. The RPC does all the work
 * atomically: 1 game row + 2 teams + 36 game_cells (2 per category ×
 * point value) + sets current_turn_team_id randomly.
 *
 * Host identity is a random UUID stored in localStorage until Phase 2
 * auth (SKILL.md §5). We generate it on first use and reuse it across
 * sessions.
 */

const HOST_SESSION_KEY = 'host_session_id'

/** Get or create the host's anon session id (random UUID). */
export function getOrCreateHostSessionId(): string {
  if (typeof window === 'undefined') {
    // Server-side: fall back to a stable placeholder. The page is
    // 'use client' so this branch only fires in odd contexts (e.g. tests).
    return '00000000-0000-0000-0000-000000000000'
  }
  const existing = window.localStorage.getItem(HOST_SESSION_KEY)
  if (existing) return existing
  const fresh =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : fallbackUuid()
  window.localStorage.setItem(HOST_SESSION_KEY, fresh)
  return fresh
}

function fallbackUuid(): string {
  // RFC 4122 v4-ish — used only when crypto.randomUUID is unavailable.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Resolve the host's identity for the create_board_game RPC.
 * Prefers the authenticated Supabase user id (real per-user tracking).
 * Falls back to a localStorage random UUID for the unauthenticated edge case.
 */
async function resolveHostSessionId(): Promise<string> {
  const { data } = await supabase.auth.getSession()
  if (data.session?.user?.id) return data.session.user.id
  return getOrCreateHostSessionId()
}

/**
 * Default team colors. Per SKILL.md §5, /create-game can offer a color
 * picker "if it still applies" — keeping it simple with fixed defaults
 * for now (the first two choice-tile colors from DESIGN.md, which are
 * also visually distinct on the dark board).
 */
export const DEFAULT_TEAM_COLORS = {
  team1: '#3A86FF', // blue
  team2: '#E85D04', // amber
} as const

export interface CreateGameResult {
  gameId: string
}

/**
 * Create a new board game atomically. Throws on RPC failure.
 *
 * The client is responsible for having already chosen exactly 6
 * category ids; the RPC validates this and raises if the count is off.
 */
export async function createBoardGame(
  params: Omit<CreateBoardGameParams, 'hostSessionId' | 'team1Color' | 'team2Color'> &
    Partial<Pick<CreateBoardGameParams, 'team1Color' | 'team2Color'>>
): Promise<CreateGameResult> {
  const hostSessionId = await resolveHostSessionId()

  const { data, error } = await supabase.rpc('create_board_game', {
    p_host_session_id: hostSessionId,
    p_selected_category_ids: params.selectedCategoryIds,
    p_team1_name: params.team1Name,
    p_team1_color: params.team1Color ?? DEFAULT_TEAM_COLORS.team1,
    p_team2_name: params.team2Name,
    p_team2_color: params.team2Color ?? DEFAULT_TEAM_COLORS.team2,
  })

  if (error) {
    throw new Error(`create_board_game failed: ${error.message}`)
  }
  if (!data || typeof data !== 'string') {
    throw new Error('create_board_game returned no game id')
  }

  return { gameId: data }
}
