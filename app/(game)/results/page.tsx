'use client'

import { Suspense, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface FinalTeam {
  name: string
  color: string
  score: number
}

const MEDALS = ['🥇', '🥈', '🥉']

function ResultsContent() {
  const searchParams = useSearchParams()

  const teams: FinalTeam[] = useMemo(() => {
    try {
      const raw = JSON.parse(searchParams.get('teams') ?? '[]') as FinalTeam[]
      // Sort highest score first
      return [...raw].sort((a, b) => b.score - a.score)
    } catch {
      return []
    }
  }, [searchParams])

  const topScore = teams[0]?.score ?? 0

  // Find all teams tied for first
  const winners = teams.filter((t) => t.score === topScore && topScore > 0)

  return (
    <main className="min-h-screen flex flex-col bg-gray-950 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="h-[600px] w-[600px] rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: '#f59e0b' }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center min-h-screen px-4 sm:px-8 py-12">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="text-6xl mb-4" aria-hidden="true">🏆</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
            النتائج النهائية
          </h1>
          {winners.length === 1 && (
            <p className="text-xl text-amber-400 font-bold">
              🎉 مبروك {winners[0].name}!
            </p>
          )}
          {winners.length > 1 && (
            <p className="text-xl text-amber-400 font-bold">
              🤝 تعادل رائع! مبروك للجميع
            </p>
          )}
          {topScore === 0 && (
            <p className="text-gray-400">لم يُسجَّل أي نقطة — حاولوا مجدداً!</p>
          )}
        </header>

        {/* Scoreboard */}
        <section
          aria-label="الترتيب النهائي"
          className="flex flex-col gap-3 w-full max-w-lg mb-10"
        >
          {teams.map((team, idx) => {
            const isWinner = team.score === topScore && topScore > 0
            return (
              <div
                key={idx}
                className="flex items-center gap-4 rounded-2xl px-5 py-4 transition-all"
                style={{
                  backgroundColor: `${team.color}18`,
                  border: `2px solid ${isWinner ? team.color : team.color + '44'}`,
                  boxShadow: isWinner ? `0 0 20px ${team.color}44` : 'none',
                }}
              >
                {/* Rank */}
                <span
                  className="text-3xl flex-shrink-0 w-10 text-center"
                  aria-hidden="true"
                >
                  {MEDALS[idx] ?? `${idx + 1}`}
                </span>

                {/* Team colour chip */}
                <span
                  className="h-4 w-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: team.color }}
                  aria-hidden="true"
                />

                {/* Name */}
                <span className="flex-1 text-xl font-bold text-white text-start">
                  {team.name}
                </span>

                {/* Score */}
                <span
                  className="text-2xl font-extrabold flex-shrink-0"
                  style={{ color: team.color }}
                >
                  {team.score}
                </span>
                <span className="text-gray-500 text-sm flex-shrink-0">نقطة</span>
              </div>
            )
          })}
        </section>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            id="new-game"
            href="/"
            className="flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 px-8 py-3 font-bold text-white text-base transition-all shadow-lg shadow-violet-900/50"
          >
            <span aria-hidden="true">🔄</span>
            لعبة جديدة
          </Link>
          <Link
            id="back-to-categories"
            href="/"
            className="rounded-xl bg-white/10 hover:bg-white/20 px-6 py-3 font-bold text-gray-300 text-base transition-all"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function ResultsPage() {
  return (
    <Suspense>
      <ResultsContent />
    </Suspense>
  )
}
