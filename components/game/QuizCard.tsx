'use client'

import Image from 'next/image'
import type { CategoryExtended } from '@/lib/types'

interface QuizCardProps {
  category: CategoryExtended
  isSelected: boolean
  isDisabled: boolean
  onSelect: (id: string) => void
  onInfo: (category: CategoryExtended) => void
}

/**
 * A horizontal-scroll quiz card for the /create-game category browser.
 * Matches the reference screenshot: cover photo top, orange name bar bottom,
 * optional "باقي N لعبة" sparkle badge, star rating, info button.
 *
 * DESIGN.md: hover:scale-[1.03] active:scale-[0.97], shadow-lg.
 * RTL: uses logical padding (ps-/pe-), no left/right.
 */
export function QuizCard({ category, isSelected, isDisabled, onSelect, onInfo }: QuizCardProps) {
  const stars = category.star_rating ?? 0
  const isComingSoon = !category.has_questions
  const effectivelyDisabled = isDisabled || isComingSoon

  return (
    <div
      className="relative flex-shrink-0 w-[120px] select-none"
      style={{ height: '160px' }}
    >
      {/* Main card button — outer button. The info button used to be nested
          inside it, which produced a `<button>` inside `<button>` and a
          React hydration warning. The info control now lives as a sibling
          absolutely-positioned over the card, with `pointer-events-auto`
          so its click still works. */}
      <button
        type="button"
        onClick={() => !effectivelyDisabled && onSelect(category.id)}
        disabled={effectivelyDisabled}
        aria-pressed={isSelected}
        aria-label={`${category.name_ar}${isSelected ? ' — محدد' : ''}`}
        className={[
          'w-full h-full rounded-2xl overflow-hidden shadow-lg flex flex-col',
          'transition-transform duration-150 ease-out',
          effectivelyDisabled && !isSelected
            ? 'opacity-40 cursor-not-allowed'
            : 'hover:scale-[1.03] active:scale-[0.97] cursor-pointer',
          isSelected
            ? 'ring-4 ring-white ring-offset-2 ring-offset-transparent brightness-110'
            : '',
        ].join(' ')}
      >
        {/* Cover image */}
        <div className="relative w-full h-[110px] bg-gray-300">
          {category.cover_image_url ? (
            <Image
              src={category.cover_image_url}
              alt={category.name_ar}
              fill
              className="object-cover"
              sizes="120px"
              unoptimized  // external URLs — skip Next.js image optimization domain check
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-400">
              <span className="text-3xl">{category.icon_url ? '' : '❓'}</span>
            </div>
          )}

          {/* "باقي N لعبة" badge — top-start corner — only when remaining_games is set */}
          {category.remaining_games != null && !isComingSoon && (
            <span
              className="absolute top-1 start-1 bg-[#FB6B2C] text-white text-[9px] font-bold rounded-full px-1.5 py-0.5 leading-tight shadow"
              aria-label={`باقي ${category.remaining_games} لعبة`}
            >
              باقي {category.remaining_games}
            </span>
          )}

          {/* "قريباً" overlay — only when category has no playable questions */}
          {isComingSoon && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-2xl z-10">
              <span className="text-white text-[10px] font-bold bg-gray-700/80 rounded-full px-2 py-0.5">
                قريباً
              </span>
            </div>
          )}
        </div>

        {/* Name bar — orange bottom */}
        <div className="bg-[#FB6B2C] px-2 py-1.5 text-center">
          <span className="text-white text-[11px] font-bold leading-tight line-clamp-2">
            {category.name_ar}
          </span>
          {/* Star rating */}
          {stars > 0 && (
            <div className="flex justify-center gap-0.5 mt-0.5" aria-label={`${stars} نجوم`}>
              {Array.from({ length: 3 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-2.5 h-2.5 ${i < stars ? 'text-yellow-300' : 'text-white/30'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          )}
        </div>
      </button>

      {/* Info button — sibling of the main card button (no longer nested),
          absolutely positioned over the card's top-end corner. Hidden when
          the card is already selected so the ✓ checkmark below takes its
          place. */}
      {!isSelected && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onInfo(category) }}
          className="absolute top-1 end-1 w-6 h-6 rounded-full bg-white/80 text-[#1B4965] text-[11px] font-extrabold flex items-center justify-center shadow hover:bg-white transition-colors z-20 backdrop-blur-sm"
          aria-label={`معلومات عن ${category.name_ar}`}
        >
          ℹ
        </button>
      )}

      {/* Selected checkmark overlay */}
      {isSelected && (
        <span
          className="absolute top-1.5 end-1.5 w-6 h-6 rounded-full bg-white text-[#C61E45] font-extrabold text-sm flex items-center justify-center shadow-md z-10 pointer-events-none"
          aria-hidden="true"
        >
          ✓
        </span>
      )}
    </div>
  )
}
