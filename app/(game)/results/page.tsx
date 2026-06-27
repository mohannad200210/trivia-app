'use client'

import { Suspense, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

interface FinalTeam {
  name: string
  color: string
  score: number
}

const MEDALS = ['🥇', '🥈', '🥉']

function ResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const teams: FinalTeam[] = useMemo(() => {
    try {
      const raw = JSON.parse(searchParams.get('teams') ?? '[]') as FinalTeam[]
      return [...raw].sort((a, b) => b.score - a.score)
    } catch {
      return []
    }
  }, [searchParams])

  const topScore = teams[0]?.score ?? 0
  const winners = teams.filter((t) => t.score === topScore && topScore > 0)

  return (
    // DESIGN.md: Primary gradient on every screen
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-[#FB6B2C] to-[#C61E45]">
      <div className="flex flex-col items-center min-h-screen px-4 sm:px-8 py-12">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="text-center mb-10">
          <div className="text-7xl mb-4" aria-hidden="true">🏆</div>
          {/* DESIGN.md h1 typography */}
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-3">
            النتائج النهائية
          </h1>
          {winners.length === 1 && (
            <p className="text-xl text-white font-bold">
              🎉 مبروك {winners[0].name}!
            </p>
          )}
          {winners.length > 1 && (
            <p className="text-xl text-white font-bold">
              🤝 تعادل رائع! مبروك للجميع
            </p>
          )}
          {topScore === 0 && (
            <p className="text-white/70">لم يُسجَّل أي نقطة — حاولوا مجدداً!</p>
          )}
        </header>

        {/* ── Scoreboard ─────────────────────────────────────────────────── */}
        {/* DESIGN.md card: bg-white rounded-3xl p-6 sm:p-8 */}
        <section
          aria-label="الترتيب النهائي"
          className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg mb-10 shadow-lg"
        >
          <div className="flex flex-col gap-3">
            {teams.map((team, idx) => {
              const isWinner = team.score === topScore && topScore > 0
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 rounded-2xl px-5 py-4"
                  style={{
                    backgroundColor: isWinner ? `${team.color}18` : '#FFF4ED',
                    border: `2px solid ${isWinner ? team.color : team.color + '44'}`,
                    boxShadow: isWinner ? `0 0 20px ${team.color}44` : 'none',
                  }}
                >
                  {/* Rank medal */}
                  <span
                    className="text-3xl flex-shrink-0 w-10 text-center"
                    aria-hidden="true"
                  >
                    {MEDALS[idx] ?? `${idx + 1}`}
                  </span>

                  {/* Team colour dot */}
                  <span
                    className="h-4 w-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: team.color }}
                    aria-hidden="true"
                  />

                  {/* Name — DESIGN.md h3 */}
                  <span className="flex-1 text-xl font-bold text-gray-900 text-start">
                    {team.name}
                  </span>

                  {/* Score — DESIGN.md score-number: text-2xl font-extrabold */}
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
          </div>
        </section>

        {/* ── Actions ────────────────────────────────────────────────────── */}
        {/* DESIGN.md chunky button */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            id="new-game"
            type="button"
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4
                       text-[#C61E45] text-lg font-bold
                       shadow-[0_6px_0_0_rgba(0,0,0,0.25)]
                       transition-all duration-100
                       hover:brightness-95
                       active:translate-y-[6px] active:shadow-[0_0px_0_0_rgba(0,0,0,0.25)]"
          >
            <span aria-hidden="true">🔄</span>
            لعبة جديدة
          </button>

          <button
            id="back-home"
            type="button"
            onClick={() => router.push('/')}
            className="rounded-full bg-white/20 hover:bg-white/30 px-6 py-4
                       font-bold text-white text-base transition-all duration-150"
          >
            العودة للرئيسية
          </button>
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
