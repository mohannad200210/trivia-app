'use client'

import type { LocalCategory } from '@/lib/categories'

interface CategoryCardProps {
  category: LocalCategory
  selected: boolean
  disabled: boolean // true when 6 are already selected and this one isn't
  onToggle: (id: string) => void
}

export default function CategoryCard({
  category,
  selected,
  disabled,
  onToggle,
}: CategoryCardProps) {
  const { id, name_ar, name_en, emoji, color } = category

  // Dynamic styles — we use inline style for the per-category accent colour
  // because Tailwind can't resolve arbitrary runtime hex values at build time.
  const cardStyle = selected
    ? {
        borderColor: color,
        boxShadow: `0 0 24px ${color}55, 0 0 48px ${color}22`,
      }
    : {
        borderColor: 'transparent',
      }

  const emojiBadgeStyle = {
    backgroundColor: `${color}22`, // 13% opacity tint
    color,
  }

  const handleClick = () => {
    if (!disabled || selected) {
      onToggle(id)
    }
  }

  return (
    <button
      id={`category-card-${id}`}
      type="button"
      onClick={handleClick}
      aria-pressed={selected}
      aria-label={`${name_ar} — ${name_en}`}
      // Disabled look when max selected and this card isn't one of them
      className={[
        'relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl',
        'border-2 transition-all duration-200 ease-out text-center w-full',
        'bg-white/5 backdrop-blur-sm',
        // Active interaction
        selected
          ? 'scale-[1.03] bg-white/10'
          : disabled
          ? 'opacity-40 cursor-not-allowed'
          : 'hover:scale-[1.02] hover:bg-white/8 hover:border-white/20 cursor-pointer active:scale-[0.98]',
        // Focus ring — RTL-safe (outline doesn't care about direction)
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
      ].join(' ')}
      style={cardStyle}
    >
      {/* Selected checkmark badge */}
      {selected && (
        <span
          className="absolute top-3 start-3 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
          style={{ backgroundColor: color, color: '#fff' }}
          aria-hidden="true"
        >
          ✓
        </span>
      )}

      {/* Emoji icon */}
      <span
        className="flex h-16 w-16 items-center justify-center rounded-2xl text-4xl"
        style={emojiBadgeStyle}
        aria-hidden="true"
      >
        {emoji}
      </span>

      {/* Category names */}
      <div className="flex flex-col gap-0.5">
        <span className="text-lg font-bold leading-tight text-white">
          {name_ar}
        </span>
        <span className="text-xs text-gray-400 font-medium">{name_en}</span>
      </div>
    </button>
  )
}
