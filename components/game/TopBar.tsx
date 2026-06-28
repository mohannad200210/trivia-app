'use client'

import { useRouter } from 'next/navigation'
import type { Game, Team } from '@/lib/types'

/**
 * TopBar — shared header for /board, /question, /answer.
 * Per DESIGN.md "Gameplay (dark) theme" / Top bar: dark bg, single row
 * with exit (start), back-to-board (optional, hidden on /board),
 * end-game, and the active-team turn pill (end).
 *
 * Uses useRouter directly for navigation. Callers that need different
 * behavior can pass a custom handler — but for the 3 gameplay screens
 * the actions are uniform, so direct router.push is fine.
 */

interface TopBarProps {
  game: Game
  teams: Team[]
  /** When true, renders the "back to board" button. Use on /question + /answer. */
  showBackToBoard?: boolean
  /** When true, disables end-game (e.g. while an RPC is in flight). */
  endGameDisabled?: boolean
  /**
   * Handler for the "انتهاء اللعبة" button. Should mark the game as
   * finished and then navigate to /results. If not provided, the
   * button falls back to a plain router.push('/results') — fine for
   * read-only screens, wrong for in-progress game screens.
   */
  onEndGame?: () => void
}

export function TopBar({
  game,
  teams,
  showBackToBoard = false,
  endGameDisabled = false,
  onEndGame,
}: TopBarProps) {
  const router = useRouter()

  const currentTeam = game.current_turn_team_id
    ? teams.find((t) => t.id === game.current_turn_team_id) ?? null
    : null

  const backToBoard = () => {
    router.push(`/board?gameId=${game.id}&_t=${Date.now()}`)
  }

  return (
    <header className="bg-[--game-bg] border-b border-white/10 px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="rounded-full bg-white/10 hover:bg-white/15 px-3 sm:px-4 py-2 text-sm font-bold text-white transition-colors"
          aria-label="خروج"
        >
          خروج
        </button>
        {showBackToBoard && (
          <button
            type="button"
            onClick={backToBoard}
            className="rounded-full bg-white/10 hover:bg-white/15 px-3 sm:px-4 py-2 text-sm font-bold text-white transition-colors"
            aria-label="العودة إلى اللوحة"
          >
            اللوحة
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onEndGame ?? (() => router.push('/results'))}
          disabled={endGameDisabled}
          className="rounded-full bg-white/10 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed px-3 sm:px-4 py-2 text-sm font-bold text-white transition-colors"
        >
          انتهاء اللعبة
        </button>
        {currentTeam && (
          <span
            aria-label={`الدور الحالي: ${currentTeam.name}`}
            className="bg-[--game-accent] rounded-full px-4 py-1 text-sm font-bold text-white whitespace-nowrap"
          >
            دور {currentTeam.name}
          </span>
        )}
      </div>
    </header>
  )
}
