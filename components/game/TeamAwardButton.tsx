import type { Team } from '@/lib/types'

/**
 * TeamAwardButton — large team button on /answer. Tapping awards the
 * cell's point_value to this team.
 * Per DESIGN.md "Answer screen team-award buttons: large, one per team,
 * in that team's assigned color, rounded-2xl, full-width on mobile."
 *
 * The button shows: color swatch, team name, "+N نقطة" hint, and the
 * team's current score. The score updates locally via the disabled
 * prop while the RPC is in flight; the page handles the actual refresh
 * of scores by re-fetching on /board mount.
 */

interface TeamAwardButtonProps {
  team: Team
  pointValue: number
  onClick: () => void
  disabled?: boolean
}

export function TeamAwardButton({
  team,
  pointValue,
  onClick,
  disabled,
}: TeamAwardButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{ backgroundColor: team.color }}
      aria-label={`منح ${pointValue} نقطة إلى ${team.name}`}
      className="rounded-2xl p-5 sm:p-6 flex items-center gap-3 sm:gap-4 text-start transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100 shadow-lg w-full"
    >
      <span
        aria-hidden="true"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/25 flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-lg sm:text-xl font-bold text-white truncate">
          {team.name}
        </p>
        <p className="text-sm text-white/85 font-medium tabular-nums">
          +{pointValue} نقطة
        </p>
      </div>
      <span className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
        {team.score}
      </span>
    </button>
  )
}
