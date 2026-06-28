import type { Question } from '@/lib/types'

/**
 * AnswerPanel — large reveal card on /answer showing the correct answer.
 * Per /SKILL.md §5 + DESIGN.md: same typographic weight as the question
 * text (text-3xl sm:text-4xl font-bold) so the host can read it across
 * the room.
 */

interface AnswerPanelProps {
  question: Question
}

export function AnswerPanel({ question }: AnswerPanelProps) {
  return (
    <div className="rounded-3xl bg-[--game-surface] p-6 sm:p-8 space-y-3 shadow-lg">
      <p className="text-sm text-[--game-text-muted] font-medium text-center">
        الإجابة الصحيحة
      </p>
      <p className="text-3xl sm:text-4xl font-bold text-white text-center leading-relaxed">
        {question.answer_text_ar}
      </p>
    </div>
  )
}
