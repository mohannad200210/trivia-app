'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

// DESIGN.md: difficulty colors are semantic (not category palette), kept as-is
const DIFFICULTIES = [
  {
    id: 'easy',
    label_ar: 'سهل',
    label_en: 'Easy',
    description: 'أسئلة بسيطة للجميع',
    emoji: '😊',
    color: '#2D6A4F', // DESIGN.md color 1 (forest green) repurposed for easy
  },
  {
    id: 'medium',
    label_ar: 'متوسط',
    label_en: 'Medium',
    description: 'تحدٍّ متوازن',
    emoji: '🤔',
    color: '#E85D04', // DESIGN.md color 5 (amber-orange) for medium
  },
  {
    id: 'hard',
    label_ar: 'صعب',
    label_en: 'Hard',
    description: 'للمتخصصين فقط',
    emoji: '🔥',
    color: '#9D0208', // DESIGN.md color 8 (brick red) for hard
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
    // DESIGN.md: Primary gradient as page background on every screen
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#FB6B2C] to-[#C61E45] px-4 sm:px-8 py-12">

      {/* DESIGN.md h2: text-3xl sm:text-4xl font-bold text-white */}
      <header className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          اختر مستوى الصعوبة
        </h1>
        <p className="text-white/70 text-base font-medium">
          كلما زادت الصعوبة زاد التحدي!
        </p>
      </header>

      {/* DESIGN.md tile style: rounded-2xl shadow-lg hover:scale-[1.03] active:scale-[0.97] */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-3xl">
        {DIFFICULTIES.map((diff) => (
          <button
            key={diff.id}
            id={`difficulty-${diff.id}`}
            type="button"
            onClick={() => handleSelect(diff.id)}
            className="flex flex-col items-center gap-4 p-8 rounded-2xl shadow-lg
                       hover:scale-[1.03] active:scale-[0.97]
                       transition-transform duration-150 ease-out cursor-pointer
                       focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-inset"
            style={{ backgroundColor: diff.color }}
          >
            {/* Emoji badge */}
            <span className="text-5xl leading-none" aria-hidden="true">
              {diff.emoji}
            </span>
            <div className="text-center">
              {/* DESIGN.md h3: text-xl font-bold */}
              <p className="text-2xl font-extrabold text-white mb-1">
                {diff.label_ar}
              </p>
              <p className="text-sm text-white/70">{diff.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Back — DESIGN.md body text on gradient */}
      <button
        id="back-to-categories"
        type="button"
        onClick={() => router.back()}
        className="mt-10 text-white/60 hover:text-white text-sm transition-colors"
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
