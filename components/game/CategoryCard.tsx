'use client'

import type { LocalCategory } from '@/lib/categories'

interface CategoryCardProps {
  category: LocalCategory
  selected: boolean
  disabled: boolean // true when max selected and this one isn't chosen
  onToggle: (id: string) => void
}

/**
 * CategoryCard — DESIGN.md tile spec.
 *
 * Shape:   rounded-2xl  (--radius-tile, 16px)
 * Surface: solid brand color per DESIGN.md category palette, white text
 * Interaction: hover:scale-[1.03] active:scale-[0.97] (tile press, not chunky offset)
 * Selected: white ring + checkmark badge
 * No `pl-/pr-/text-left/text-right` — RTL-safe logical properties only (SKILL.md §6)
 */
export default function CategoryCard({
  category,
  selected,
  disabled,
  onToggle,
}: CategoryCardProps) {
  const { id, name_ar, name_en, emoji, color } = category

  const handleClick = () => {
    if (!disabled || selected) onToggle(id)
  }

  return (
    <button
      id={`category-card-${id}`}
      type="button"
      onClick={handleClick}
      aria-pressed={selected}
      aria-label={`${name_ar} — ${name_en}`}
      className={[
        // Base tile shape — rounded-2xl per DESIGN.md --radius-tile
        'relative flex flex-col items-center justify-center gap-3',
        'p-6 rounded-2xl shadow-lg text-center w-full min-h-[9rem]',
        // Tile press interaction per DESIGN.md (not chunky offset — that's for round buttons)
        'transition-transform duration-150 ease-out',
        selected
          ? 'scale-[1.03] ring-4 ring-white ring-inset'
          : disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:scale-[1.03] active:scale-[0.97] cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-inset',
      ].join(' ')}
      // Solid DESIGN.md category color — opaque, sits on gradient background
      style={{ backgroundColor: color }}
    >
      {/* Selected checkmark — top-start corner (RTL-safe) */}
      {selected && (
        <span
          className="absolute top-2 start-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold"
          style={{ color }}
          aria-hidden="true"
        >
          ✓
        </span>
      )}

      {/* Category emoji — white on colored bg */}
      <span className="text-4xl leading-none" aria-hidden="true">
        {emoji}
      </span>

      {/* Category name */}
      <div className="flex flex-col gap-0.5">
        <span className="text-base font-bold leading-tight text-white">
          {name_ar}
        </span>
        <span className="text-xs text-white/70 font-medium">{name_en}</span>
      </div>
    </button>
  )
}
