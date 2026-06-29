'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { CategoryExtended, SuperCategoryWithSubs } from '@/lib/types'
import { QuizCard } from './QuizCard'

interface SuperCategoryRowProps {
  group: SuperCategoryWithSubs
  selectedIds: Set<string>
  isFull: boolean                        // 6 categories already selected
  onToggle: (id: string) => void
  onInfo: (category: CategoryExtended) => void
}

/**
 * A collapsible horizontal band for one super-category.
 * Header: orange pill with icon + name + collapse toggle.
 * Body: horizontal scroll row of QuizCard components.
 *
 * DESIGN.md marketing theme — warm gradient background, white rounded surface.
 * RTL: logical padding, flex-row-reverse not needed (RTL handles order via dir=rtl).
 */
export function SuperCategoryRow({ group, selectedIds, isFull, onToggle, onInfo }: SuperCategoryRowProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const { superCategory, subcategories } = group

  if (subcategories.length === 0) return null

  return (
    <div className="space-y-3">
      {/* ── Header pill ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-3">
        {/* Collapse toggle (on the start side — right in RTL) */}
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? `طي ${superCategory.name_ar}` : `توسيع ${superCategory.name_ar}`}
          className="w-8 h-8 rounded-full bg-white/20 text-white font-bold text-lg flex items-center justify-center hover:bg-white/30 transition-colors flex-shrink-0"
        >
          {isExpanded ? '−' : '+'}
        </button>

        {/* Category name pill */}
        <div className="flex items-center gap-2 bg-[#FB6B2C] rounded-full px-5 py-2 shadow-[0_4px_0_0_rgba(0,0,0,0.2)]">
          {/* Super-category icon */}
          {superCategory.icon_url ? (
            <div className="relative w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={superCategory.icon_url}
                alt=""
                fill
                className="object-cover"
                sizes="28px"
                unoptimized
                aria-hidden="true"
              />
            </div>
          ) : (
            <span className="text-xl" aria-hidden="true">{superCategory.icon_emoji ?? '📋'}</span>
          )}
          <span className="text-white font-bold text-base">{superCategory.name_ar}</span>
        </div>
      </div>

      {/* ── Horizontal scroll row of QuizCards ───────────────────────────── */}
      {isExpanded && (
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-4">
          <div
            className="quiz-card-row flex flex-row-reverse gap-3 overflow-x-auto pb-2 snap-x snap-mandatory"
          >
            {subcategories.map((cat) => (
              <div key={cat.id} className="snap-start flex-shrink-0">
                <QuizCard
                  category={cat}
                  isSelected={selectedIds.has(cat.id)}
                  isDisabled={isFull && !selectedIds.has(cat.id)}
                  onSelect={onToggle}
                  onInfo={onInfo}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
