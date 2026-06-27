'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

const DIFFICULTIES = [
  {
    id: 'easy',
    label_ar: 'سهل',
    label_en: 'Easy',
    description: 'أسئلة بسيطة للجميع',
    emoji: '😊',
    color: '#22c55e',
  },
  {
    id: 'medium',
    label_ar: 'متوسط',
    label_en: 'Medium',
    description: 'تحدٍّ متوازن',
    emoji: '🤔',
    color: '#f59e0b',
  },
  {
    id: 'hard',
    label_ar: 'صعب',
    label_en: 'Hard',
    description: 'للمتخصصين فقط',
    emoji: '🔥',
    color: '#ef4444',
  },
] as const

type Difficulty = (typeof DIFFICULTIES)[number]['id']

function DifficultyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categories = searchParams.get('categories') ?? ''

  const handleSelect = (difficulty: Difficulty) => {
    const params = new URLSearchParams({ categories, difficulty })
    router.push(`/teams?${params.toString()}`)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 px-4 py-12">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-40 -start-40 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: '#f59e0b' }}
      />

      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
          اختر مستوى الصعوبة
        </h1>
        <p className="text-gray-400 text-lg">كلما زادت الصعوبة زاد التحدي!</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-3xl">
        {DIFFICULTIES.map((diff) => (
          <button
            key={diff.id}
            id={`difficulty-${diff.id}`}
            type="button"
            onClick={() => handleSelect(diff.id)}
            className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/5 border-2 border-transparent hover:border-white/20 hover:scale-[1.03] hover:bg-white/10 active:scale-[0.98] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            style={
              {
                '--accent': diff.color,
              } as React.CSSProperties
            }
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.borderColor = diff.color
              ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${diff.color}44`
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.borderColor = 'transparent'
              ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
            }}
          >
            <span
              className="flex h-20 w-20 items-center justify-center rounded-2xl text-5xl"
              style={{ backgroundColor: `${diff.color}22` }}
              aria-hidden="true"
            >
              {diff.emoji}
            </span>
            <div className="text-center">
              <p className="text-2xl font-extrabold text-white mb-1">
                {diff.label_ar}
              </p>
              <p className="text-sm text-gray-400">{diff.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Back */}
      <button
        id="back-to-categories"
        type="button"
        onClick={() => router.back()}
        className="mt-10 text-gray-500 hover:text-gray-300 text-sm transition-colors"
      >
        → العودة لاختيار الفئات
      </button>
    </main>
  )
}

export default function DifficultyPage() {
  return (
    <Suspense>
      <DifficultyContent />
    </Suspense>
  )
}
