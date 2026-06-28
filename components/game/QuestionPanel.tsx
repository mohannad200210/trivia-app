import type { Category, GameCell, Question } from '@/lib/types'

/**
 * QuestionPanel — question text + category pill + point-value badge +
 * optional image. Per DESIGN.md "Question / Answer screens":
 * "text-3xl sm:text-4xl font-bold text-white on the dark background".
 *
 * Image is rendered above the text when present. Container is a rounded
 * surface card so the text sits on a slightly raised panel, matching
 * the design language of the choice/board tiles.
 */

interface QuestionPanelProps {
  category: Category
  cell: GameCell
  question: Question
}

export function QuestionPanel({ category, cell, question }: QuestionPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="bg-[--game-accent] rounded-full px-4 py-1 text-sm font-bold text-white">
          {category.name_ar}
        </span>
        <span className="bg-[--game-surface] rounded-full px-4 py-1 text-sm font-bold text-white tabular-nums">
          {cell.point_value} نقطة
        </span>
      </div>

      <div className="rounded-3xl bg-[--game-surface] p-6 sm:p-8 space-y-5 shadow-lg">
        {question.media_url && (
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={question.media_url}
              alt=""
              className="max-w-full max-h-72 rounded-2xl object-contain"
            />
          </div>
        )}
        <p className="text-3xl sm:text-4xl font-bold text-white text-center leading-relaxed">
          {question.question_text_ar}
        </p>
      </div>
    </div>
  )
}
