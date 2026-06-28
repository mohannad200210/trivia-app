/**
 * game-logic.ts — All game business logic lives here, not in components.
 * Components call these functions; they stay presentational. (SKILL.md §3 + §5)
 *
 * Phase 1 contains:
 *  - canStartNewGame()  — free-game limit gate (swap this for wallet check in Phase 2)
 *  - getOrCreateHostSessionId() — anon host identity via localStorage
 *  - Helper tool (lifeline) state transitions (SKILL.md §11)
 *
 * Add question-selection and scoring helpers here in Phase 1 as screens are built.
 */

import type { HelpersUsed, HelperType } from '@/lib/types'

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

// ── Helper tools / Lifelines (SKILL.md §11) ──────────────────────────────────

/** Default state: no helpers used yet. */
export const DEFAULT_HELPERS: HelpersUsed = {
  remove_two: false,
  double_points: false,
  skip: false,
}

/**
 * Check if a specific helper is still available for a team.
 * Pure predicate — no side effects.
 */
export function isHelperAvailable(
  helpers: HelpersUsed,
  helperType: HelperType
): boolean {
  return helpers[helperType] === false
}

/**
 * Mark a helper as used. Returns a new HelpersUsed object (immutable update).
 * Caller is responsible for persisting to Supabase via db.updateTeamHelpers().
 */
export function useHelper(
  helpers: HelpersUsed,
  helperType: HelperType
): HelpersUsed {
  return { ...helpers, [helperType]: true }
}

/**
 * Compute which choice IDs to hide when "remove_two" is active.
 * Picks 2 incorrect choices at random to hide, leaving the correct one + 1 incorrect.
 * If there are fewer than 3 incorrect choices (shouldn't happen per SKILL.md §4),
 * hides as many as possible.
 */
export function getHiddenChoiceIds(
  choices: { id: string }[],
  correctChoiceId: string,
  removeTwoActive: boolean
): string[] {
  if (!removeTwoActive) return []

  const incorrectChoices = choices.filter((c) => c.id !== correctChoiceId)
  const shuffled = [...incorrectChoices].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 2).map((c) => c.id)
}
