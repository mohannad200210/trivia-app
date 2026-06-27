/**
 * game-logic.ts — All game business logic lives here, not in components.
 * Components call these functions; they stay presentational. (SKILL.md §3 + §5)
 *
 * Phase 1 contains:
 *  - canStartNewGame()  — free-game limit gate (swap this for wallet check in Phase 2)
 *  - getOrCreateHostSessionId() — anon host identity via localStorage
 *
 * Add question-selection and scoring helpers here in Phase 1 as screens are built.
 */

const FREE_GAME_KEY = 'hasPlayedFreeGame'
const HOST_SESSION_KEY = 'host_session_id'

/**
 * Returns true if the host is allowed to start a new game.
 *
 * MVP rule: each browser gets exactly one free game.
 * localStorage key `hasPlayedFreeGame` is set to "true" when a game starts.
 *
 * Phase 2: replace this function body with a real wallet-balance check.
 * The call site in /teams never needs to change — it always calls canStartNewGame().
 */
export function canStartNewGame(): boolean {
  if (typeof window === 'undefined') return true // SSR: allow, gate client-side
  return localStorage.getItem(FREE_GAME_KEY) !== 'true'
}

/**
 * Mark that the host has consumed their free game.
 * Call this once the game transitions to 'active' status.
 */
export function markFreeGameUsed(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(FREE_GAME_KEY, 'true')
}

/**
 * Returns a stable anonymous UUID for this browser session.
 * Stored in localStorage as `host_session_id`.
 * Used as the host identifier until auth is introduced in Phase 2. (SKILL.md §5)
 */
export function getOrCreateHostSessionId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem(HOST_SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(HOST_SESSION_KEY, id)
  }
  return id
}
