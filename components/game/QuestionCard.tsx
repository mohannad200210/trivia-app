'use client'

import type { Question } from '@/lib/types'

// Arabic choice labels: أ ب ج د (aleph, ba, jeem, dal)
const CHOICE_LABELS: Record<string, string> = {
  a: 'أ',
  b: 'ب',
  c: 'ج',
  d: 'د',
}

// DESIGN.md: choice tile colors — always in this fixed أ/ب/ج/د order
const CHOICE_COLORS: Record<string, string> = {
  a: '#3A86FF', // blue
  b: '#E85D04', // amber
  c: '#2D6A4F', // green
  d: '#B5179E', // magenta
}

interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  /** Choice IDs to hide (SKILL.md §11 — remove_two helper). */
  hiddenChoiceIds?: string[]
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  hiddenChoiceIds = [],
}: QuestionCardProps) {
  const progress = (questionNumber / totalQuestions) * 100

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Progress bar */}
      <div
        role="progressbar"
        aria-valuenow={questionNumber}
        aria-valuemin={1}
        aria-valuemax={totalQuestions}
        aria-label={`السؤال ${questionNumber} من ${totalQuestions}`}
        className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden"
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: '#6366f1',
          }}
        />
      </div>

      {/* Question number */}
      <p className="text-center text-sm font-medium text-gray-400">
        السؤال{' '}
        <span className="text-white font-bold">{questionNumber}</span>
        {' '}من{' '}
        <span className="text-white font-bold">{totalQuestions}</span>
      </p>

      {/* Question text — ≥32px per SKILL.md §6 projector rule */}
      <div className="rounded-3xl bg-white/5 border border-white/10 px-6 py-8 sm:px-10 sm:py-10 text-center">
        <p
          id="question-text"
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-relaxed"
          style={{ lineHeight: '1.5' }}
        >
          {question.question_text_ar}
        </p>
      </div>

      {/* 4 choice tiles — 2×2 grid, large tap targets */}
      <div
        className="grid grid-cols-2 gap-3 sm:gap-4"
        role="list"
        aria-label="الخيارات"
      >
        {question.choices
          .filter((choice) => !hiddenChoiceIds.includes(choice.id))
          .map((choice) => {
          const bgColor = CHOICE_COLORS[choice.id] ?? '#3A86FF'
          return (
            <div
              key={choice.id}
              role="listitem"
              className="flex items-center gap-3 rounded-2xl px-4 py-5 sm:px-6 sm:py-6"
              style={{ backgroundColor: bgColor }}
            >
              {/* Letter badge */}
              <span
                className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl text-lg font-extrabold bg-white/20 text-white"
                aria-hidden="true"
              >
                {CHOICE_LABELS[choice.id] ?? choice.id}
              </span>
              {/* Choice text */}
              <span className="text-start text-lg sm:text-xl font-bold text-white leading-snug">
                {choice.text_ar}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
