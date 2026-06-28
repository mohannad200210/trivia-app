'use client'

import type { HelpersUsed, HelperType } from '@/lib/types'
import { isHelperAvailable } from '@/lib/game-logic'

export interface ActiveTeam {
  name: string
  color: string
  score: number
  helpers: HelpersUsed
}

interface ScoreStripProps {
  teams: ActiveTeam[]
  /** Index of the team currently selected to answer, or null if none selected. */
  selectedTeamIndex: number | null
  /** Called when the host taps a team button — selects or awards. */
  onSelectTeam: (teamIndex: number) => void
  /** Called when host taps "لا أحد" — skip without scoring. */
  onSkip: () => void
  /** Called when a helper is activated for the selected team. */
  onUseHelper: (helperType: HelperType) => void
}

/** Helper tool definitions — SKILL.md §11 */
const HELPERS: { type: HelperType; label: string; icon: string }[] = [
  { type: 'remove_two', label: 'حذف خيارين', icon: '✂️' },
  { type: 'double_points', label: 'مضاعفة النقاط', icon: '×2' },
  { type: 'skip', label: 'تخطي السؤال', icon: '⏭' },
]

/**
 * ScoreStrip — sticky bottom strip for the /play screen.
 * Host taps a team button to award a point and advance.
 * Supports 2–6 teams (SKILL.md §9).
 * Uses flex-wrap so 6 teams still fit without overflow.
 *
 * SKILL.md §11: helper tool buttons appear contextually when a team is selected.
 */
export default function ScoreStrip({
  teams,
  selectedTeamIndex,
  onSelectTeam,
  onSkip,
  onUseHelper,
}: ScoreStripProps) {
  const selectedTeam =
    selectedTeamIndex !== null ? teams[selectedTeamIndex] : null

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Instruction label */}
      <p className="text-center text-sm text-white/70 font-medium">
        {selectedTeam
          ? `اختر إجابة ${selectedTeam.name} أو استخدم مساعدة`
          : 'اضغط على الفريق الذي أجاب صحيحاً'}
      </p>

      {/* ── Helper tools row (SKILL.md §11) ──────────────────────────────── */}
      {selectedTeam && (
        <div
          className="flex justify-center gap-2"
          role="group"
          aria-label={`مساعدات ${selectedTeam.name}`}
        >
          {HELPERS.map(({ type, label, icon }) => {
            const available = isHelperAvailable(selectedTeam.helpers, type)
            return (
              <button
                key={type}
                type="button"
                onClick={() => onUseHelper(type)}
                disabled={!available}
                aria-label={`${label} — ${available ? 'متاح' : 'مستخدم'}`}
                aria-disabled={!available}
                className={[
                  'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold',
                  'transition-all duration-100',
                  available
                    ? 'bg-white/20 text-white hover:bg-white/30 active:translate-y-[2px] cursor-pointer'
                    : 'bg-white/5 text-white/25 cursor-not-allowed line-through',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
                ].join(' ')}
              >
                <span aria-hidden="true">{icon}</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Team buttons — DESIGN.md chunky button style */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {teams.map((team, idx) => {
          const isSelected = idx === selectedTeamIndex
          return (
            <button
              key={idx}
              id={`award-team-${idx}`}
              type="button"
              onClick={() => onSelectTeam(idx)}
              className={[
                'flex items-center gap-2 rounded-full px-5 py-3 font-bold text-white text-base sm:text-lg',
                'shadow-[0_6px_0_0_rgba(0,0,0,0.25)] translate-y-0 transition-all duration-100',
                'active:translate-y-[6px] active:shadow-none hover:brightness-110',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
                isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent' : '',
              ].join(' ')}
              style={{ backgroundColor: team.color }}
              aria-label={
                isSelected
                  ? `${team.name} — محدد. اضغط مرة أخرى لإعطاء نقطة`
                  : `أعطِ نقطة لـ ${team.name} (${team.score} نقطة)`
              }
              aria-pressed={isSelected}
            >
              <span>{team.name}</span>
              {/* Score badge */}
              <span
                className="ms-1 flex h-7 w-7 items-center justify-center rounded-full text-sm font-extrabold bg-white/25 text-white"
                aria-hidden="true"
              >
                {team.score}
              </span>
            </button>
          )
        })}
      </div>

      {/* Skip button */}
      <button
        id="skip-question"
        type="button"
        onClick={onSkip}
        className="mx-auto text-white/40 hover:text-white/70 text-sm transition-colors"
      >
        لا أحد — تخطى السؤال ←
      </button>
    </div>
  )
}
