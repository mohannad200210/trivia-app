'use client'

import type { CategoryExtended } from '@/lib/types'

interface InfoModalProps {
  category: CategoryExtended | null
  onClose: () => void
}

/**
 * Bottom-sheet style info modal shown when the ℹ button is tapped on a QuizCard.
 * Shows category name, remaining games, star rating, and a description placeholder.
 * DESIGN.md: rounded-3xl surface-card (#FFFFFF), shadow-lg.
 */
export function InfoModal({ category, onClose }: InfoModalProps) {
  if (!category) return null

  const stars = category.star_rating ?? 0

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`معلومات: ${category.name_ar}`}
      onClick={onClose}
    >
      {/* Sheet */}
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl p-6 pb-8 space-y-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="w-12 h-1 rounded-full bg-gray-300 mx-auto" aria-hidden="true" />

        {/* Category name */}
        <h2 className="text-xl font-bold text-gray-900 text-center">{category.name_ar}</h2>

        {/* Stars */}
        {stars > 0 && (
          <div className="flex justify-center gap-1" aria-label={`${stars} نجوم`}>
            {Array.from({ length: 3 }).map((_, i) => (
              <svg
                key={i}
                className={`w-6 h-6 ${i < stars ? 'text-yellow-400' : 'text-gray-200'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        )}

        {/* Remaining games */}
        {category.remaining_games != null && (
          <p className="text-center text-sm font-medium text-gray-600">
            باقي{' '}
            <span className="text-[#FB6B2C] font-bold text-base">
              {category.remaining_games}
            </span>{' '}
            لعبة
          </p>
        )}

        {/* Description placeholder */}
        <p className="text-center text-sm text-gray-500">
          مزيد من المعلومات حول هذا الاختبار
        </p>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-full bg-[#FB6B2C] py-3 text-white font-bold text-base shadow-[0_6px_0_0_rgba(0,0,0,0.25)] transition-all duration-100 active:translate-y-[6px] active:shadow-[0_0px_0_0_rgba(0,0,0,0.25)]"
        >
          إغلاق
        </button>
      </div>
    </div>
  )
}
