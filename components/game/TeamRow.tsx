'use client'

/** 6 preset team colours — one default per slot, host can override. */
export const TEAM_COLORS = [
  '#ef4444', // red
  '#3b82f6', // blue
  '#22c55e', // green
  '#eab308', // yellow
  '#a855f7', // purple
  '#ec4899', // pink
] as const

export interface TeamState {
  /** Stable local key — not sent to Supabase, just for React reconciliation. */
  localId: string
  name: string
  color: string
}

interface TeamRowProps {
  index: number
  team: TeamState
  canRemove: boolean
  onChange: (localId: string, patch: Partial<Omit<TeamState, 'localId'>>) => void
  onRemove: (localId: string) => void
}

/** Arabic ordinals for team labels (Western numerals per SKILL.md §6). */
const ORDINALS: Record<number, string> = {
  0: 'الأول',
  1: 'الثاني',
  2: 'الثالث',
  3: 'الرابع',
  4: 'الخامس',
  5: 'السادس',
}

export default function TeamRow({
  index,
  team,
  canRemove,
  onChange,
  onRemove,
}: TeamRowProps) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-4 transition-all duration-200"
      style={{ borderColor: `${team.color}44` }}
    >
      {/* Team number label */}
      <div
        className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-extrabold"
        style={{ backgroundColor: `${team.color}22`, color: team.color }}
        aria-hidden="true"
      >
        {index + 1}
      </div>

      {/* Name input */}
      <div className="flex-1 min-w-0">
        <label
          htmlFor={`team-name-${team.localId}`}
          className="block text-xs text-gray-500 mb-1 text-start"
        >
          الفريق {ORDINALS[index]}
        </label>
        <input
          id={`team-name-${team.localId}`}
          type="text"
          value={team.name}
          onChange={(e) => onChange(team.localId, { name: e.target.value })}
          placeholder={`اسم الفريق ${ORDINALS[index]}`}
          maxLength={24}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-gray-600 text-start font-medium focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors"
          dir="auto"
        />
      </div>

      {/* Colour swatches */}
      <div
        className="flex-shrink-0 flex flex-col gap-1.5"
        role="group"
        aria-label={`لون الفريق ${ORDINALS[index]}`}
      >
        <div className="flex gap-1.5">
          {TEAM_COLORS.slice(0, 3).map((c) => (
            <ColourSwatch
              key={c}
              color={c}
              selected={team.color === c}
              teamLocalId={team.localId}
              onSelect={() => onChange(team.localId, { color: c })}
            />
          ))}
        </div>
        <div className="flex gap-1.5">
          {TEAM_COLORS.slice(3).map((c) => (
            <ColourSwatch
              key={c}
              color={c}
              selected={team.color === c}
              teamLocalId={team.localId}
              onSelect={() => onChange(team.localId, { color: c })}
            />
          ))}
        </div>
      </div>

      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(team.localId)}
        disabled={!canRemove}
        aria-label={`حذف الفريق ${ORDINALS[index]}`}
        className={[
          'flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-all duration-150',
          canRemove
            ? 'text-gray-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer'
            : 'opacity-0 pointer-events-none',
        ].join(' ')}
      >
        ✕
      </button>
    </div>
  )
}

// ── Internal swatch button ──────────────────────────────────────────────────

function ColourSwatch({
  color,
  selected,
  teamLocalId,
  onSelect,
}: {
  color: string
  selected: boolean
  teamLocalId: string
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={color}
      id={`swatch-${teamLocalId}-${color.replace('#', '')}`}
      className="h-5 w-5 rounded-full transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      style={{
        backgroundColor: color,
        outline: selected ? `2px solid ${color}` : 'none',
        outlineOffset: selected ? '2px' : '0',
        transform: selected ? 'scale(1.25)' : 'scale(1)',
      }}
    />
  )
}
