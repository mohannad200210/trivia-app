'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { fetchResultsData } from '@/lib/results'
import type { ResultsData, Team } from '@/lib/types'

/**
 * /results — final scoreboard, winner highlighted (or "تعادل" on tie).
 * SKILL.md §5, DESIGN.md dark gameplay theme.
 *
 * Renders:
 *   - A simple top bar with just "خروج" (back to landing).
 *   - A big heading: 🏆 "الفائز" or 🤝 "تعادل!".
 *   - Two team cards stacked vertically. The winning team's card gets
 *     an orange ring + a "الفائز" label + a 🎉. On a tie, both cards
 *     get a thin neutral ring and a "تعادل" label.
 *   - A chunky "لعبة جديدة" CTA that routes to /create-game.
 *
 * Does NOT depend on games.status being 'finished' — it just reads
 * the team scores. The finish-game UPDATE from /board or the end-game
 * button is best-effort; the screen shows the truth either way.
 */

export default function ResultsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <ResultsInner />
    </Suspense>
  )
}

function PageFallback() {
  return (
    <main className="min-h-screen bg-[--game-bg] text-white flex items-center justify-center">
      <p className="text-[--game-text-muted]">جاري التحميل…</p>
    </main>
  )
}

function ResultsInner() {
  const router = useRouter()
  const params = useSearchParams()
  const gameId = params.get('gameId')

  const [data, setData] = useState<ResultsData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!gameId) {
      setError('لم يتم تحديد معرّف اللعبة. ارجع إلى صفحة الإنشاء.')
      return
    }
    setData(null)
    setError(null)
    fetchResultsData(gameId)
      .then(setData)
      .catch((e) =>
        setError(e instanceof Error ? e.message : 'فشل تحميل النتائج')
      )
  }, [gameId])

  if (error) {
    return <ErrorScreen message={error} onExit={() => router.push('/')} />
  }
  if (!data) return <PageFallback />

  const { teams } = data

  if (teams.length !== 2) {
    return (
      <ErrorScreen
        message={`عدد الفرق غير متوقّع (${teams.length}).`}
        onExit={() => router.push('/create-game')}
      />
    )
  }

  // Teams come from fetchResultsData ordered by display_order ASC, so
  // teams[0] = first team entered on /create-game, teams[1] = second.
  const [team1, team2] = teams
  const isTie = team1.score === team2.score
  const winnerId = isTie ? null : team1.score > team2.score ? team1.id : team2.id

  return (
    <main className="min-h-screen bg-[--game-bg] text-[--game-text] flex flex-col">
      {/* Simple top bar — just an exit button. No back-to-board or turn
          pill on the results screen; the game is over. */}
      <header className="bg-[--game-bg] border-b border-white/10 px-4 py-3 flex items-center">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="rounded-full bg-white/10 hover:bg-white/15 px-3 sm:px-4 py-2 text-sm font-bold text-white transition-colors"
          aria-label="خروج"
        >
          خروج
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-8 sm:py-12 space-y-8">
        {/* Heading */}
        <div className="text-center space-y-2">
          {isTie ? (
            <>
              <p className="text-6xl sm:text-7xl" aria-hidden="true">🤝</p>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
                تعادل!
              </h1>
            </>
          ) : (
            <>
              <p className="text-6xl sm:text-7xl" aria-hidden="true">🏆</p>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
                الفائز
              </h1>
            </>
          )}
        </div>

        {/* Team cards — stacked, winner ringed */}
        <div className="w-full max-w-md space-y-4">
          <TeamResultCard
            team={team1}
            isWinner={winnerId === team1.id}
            isTie={isTie}
          />
          <TeamResultCard
            team={team2}
            isWinner={winnerId === team2.id}
            isTie={isTie}
          />
        </div>

        {/* New game CTA */}
        <button
          type="button"
          onClick={() => router.push('/create-game')}
          className="rounded-full bg-[--game-accent] px-10 py-4 text-white text-lg font-bold shadow-[0_6px_0_0_rgba(0,0,0,0.35)] transition-all duration-100 ease-out hover:brightness-110 active:translate-y-[6px] active:shadow-[0_0px_0_0_rgba(0,0,0,0.35)]"
        >
          لعبة جديدة
          <span aria-hidden="true"> 🎮</span>
        </button>
      </div>
    </main>
  )
}

function TeamResultCard({
  team,
  isWinner,
  isTie,
}: {
  team: Team
  isWinner: boolean
  isTie: boolean
}) {
  return (
    <div
      className={[
        'rounded-2xl p-5 sm:p-6 flex items-center gap-4',
        'bg-[--game-surface]',
        isWinner ? 'ring-2 ring-[--game-accent] shadow-lg' : '',
        isTie ? 'ring-1 ring-white/20' : '',
      ].join(' ')}
    >
      <span
        aria-hidden="true"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0"
        style={{ backgroundColor: team.color }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-lg sm:text-xl font-bold text-white truncate">
          {team.name}
        </p>
        {isWinner && (
          <p className="text-sm text-[--game-accent] font-medium">
            الفائز <span aria-hidden="true">🎉</span>
          </p>
        )}
        {isTie && (
          <p className="text-sm text-[--game-text-muted] font-medium">تعادل</p>
        )}
      </div>
      <span className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
        {team.score}
      </span>
    </div>
  )
}

function ErrorScreen({ message, onExit }: { message: string; onExit: () => void }) {
  return (
    <main className="min-h-screen bg-[--game-bg] text-white flex flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-[--game-accent] text-lg font-bold">{message}</p>
      <button
        type="button"
        onClick={onExit}
        className="rounded-full bg-[--game-accent] px-6 py-2 text-white font-bold shadow-[0_6px_0_0_rgba(0,0,0,0.25)] active:translate-y-[6px] active:shadow-[0_0px_0_0_rgba(0,0,0,0.25)] transition-all duration-100 ease-out"
      >
        العودة
      </button>
    </main>
  )
}
