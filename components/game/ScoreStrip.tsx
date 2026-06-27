'use client'

export interface ActiveTeam {
  name: string
  color: string
  score: number
}

interface ScoreStripProps {
  teams: ActiveTeam[]
  /** Called with the index of the team the host tapped to award +1 */
  onAward: (teamIndex: number) => void
  /** Called when host taps "لا أحد" — skip without scoring */
  onSkip: () => void
}

/**
 * ScoreStrip — sticky bottom strip for the /play screen.
 * Host taps a team button to award a point and advance.
 * Supports 2–6 teams (SKILL.md §9).
 * Uses flex-wrap so 6 teams still fit without overflow.
 */
export default function ScoreStrip({ teams, onAward, onSkip }: ScoreStripProps) {
  return (
    <div className="w-full flex flex-col gap-3">
      {/* Instruction label */}
      <p className="text-center text-sm text-gray-500 font-medium">
        اضغط على الفريق الذي أجاب صحيحاً
      </p>

      {/* Team buttons */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {teams.map((team, idx) => (
          <button
            key={idx}
            id={`award-team-${idx}`}
            type="button"
            onClick={() => onAward(idx)}
            className="flex items-center gap-2 rounded-2xl px-5 py-3 font-bold text-white text-base sm:text-lg transition-all duration-150 active:scale-95 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            style={{
              backgroundColor: `${team.color}33`,
              border: `2px solid ${team.color}`,
              boxShadow: `0 0 12px ${team.color}33`,
            }}
            aria-label={`أعطِ نقطة لـ ${team.name} (${team.score} نقطة)`}
          >
            {/* Colour dot */}
            <span
              className="h-3 w-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: team.color }}
              aria-hidden="true"
            />
            <span>{team.name}</span>
            {/* Score badge */}
            <span
              className="ms-1 flex h-7 w-7 items-center justify-center rounded-full text-sm font-extrabold"
              style={{ backgroundColor: team.color, color: '#fff' }}
              aria-hidden="true"
            >
              {team.score}
            </span>
          </button>
        ))}
      </div>

      {/* Skip button */}
      <button
        id="skip-question"
        type="button"
        onClick={onSkip}
        className="mx-auto text-gray-600 hover:text-gray-400 text-sm transition-colors"
      >
        لا أحد — تخطى السؤال ←
      </button>
    </div>
  )
}
