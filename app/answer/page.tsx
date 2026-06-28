'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { fetchAnswerData } from '@/lib/play'
import { resolveAnswer } from '@/lib/resolve-answer'
import { finishGame } from '@/lib/finish-game'
import type { AnswerData } from '@/lib/types'
import { TopBar } from '@/components/game/TopBar'
import { AnswerPanel } from '@/components/game/AnswerPanel'
import { TeamAwardButton } from '@/components/game/TeamAwardButton'

/**
 * /answer — reveal the correct answer + let the host pick which team
 * got it (or "لا أحد" if neither did).
 * SKILL.md §5 + §6, DESIGN.md dark gameplay theme.
 *
 * The resolve_answer RPC does the work atomically per the user's spec:
 * award points, mark cell answered, flip turn. After it succeeds, we
 * push to /board?gameId=...&_t=<ts> so the board re-fetches and shows
 * the new state (greyed cell, updated score, turn pill on the other team).
 */

export default function AnswerPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <AnswerInner />
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

function AnswerInner() {
  const router = useRouter()
  const params = useSearchParams()
  const gameId = params.get('gameId')
  const cellId = params.get('cellId')

  const [data, setData] = useState<AnswerData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!cellId) {
      setError('لم يتم تحديد معرّف الخلية. ارجع إلى اللوحة.')
      return
    }
    setData(null)
    setError(null)
    fetchAnswerData(cellId)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'فشل تحميل الإجابة'))
  }, [cellId])

  if (error) {
    return <ErrorScreen message={error} onExit={() => router.push('/')} />
  }
  if (!data) return <PageFallback />

  const { game, teams, cell, question } = data

  if (cell.is_answered) {
    return (
      <ErrorScreen
        message="هذه الخلية تمّت الإجابة عنها بالفعل."
        onExit={() => router.push(`/board?gameId=${gameId}&_t=${Date.now()}`)}
      />
    )
  }

  if (teams.length !== 2) {
    return (
      <ErrorScreen
        message={`عدد الفرق غير متوقّع (${teams.length}).`}
        onExit={() => router.push(`/board?gameId=${gameId}&_t=${Date.now()}`)}
      />
    )
  }

  // Teams come from fetchAnswerData ordered by display_order ASC, so
  // teams[0] = display_order=1, teams[1] = display_order=2. In RTL the
  // first row visually lands on the right, matching the create-game
  // inputs (team1 first, team2 second).
  const [team1, team2] = teams

  const submit = async (awardedTeamId: string | null) => {
    if (submitting) return
    setSubmitting(true)
    setError(null)
    try {
      await resolveAnswer({ cellId: cell.id, awardedTeamId })
      router.push(`/board?gameId=${gameId}&_t=${Date.now()}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'فشل تسجيل الإجابة')
      setSubmitting(false)
    }
  }

  const handleEndGame = () => {
    if (!gameId) return
    finishGame(gameId).catch(() => {})
    router.push(`/results?gameId=${gameId}`)
  }

  return (
    <main className="min-h-screen bg-[--game-bg] text-[--game-text] flex flex-col">
      <TopBar game={game} teams={teams} showBackToBoard endGameDisabled={submitting} onEndGame={handleEndGame} />

      <div className="flex-1 px-4 sm:px-8 py-6 sm:py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <AnswerPanel question={question} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <TeamAwardButton
              team={team1}
              pointValue={cell.point_value}
              onClick={() => submit(team1.id)}
              disabled={submitting}
            />
            <TeamAwardButton
              team={team2}
              pointValue={cell.point_value}
              onClick={() => submit(team2.id)}
              disabled={submitting}
            />

            {/* "لا أحد" — full-width below the two team buttons */}
            <button
              type="button"
              onClick={() => submit(null)}
              disabled={submitting}
              aria-label="لا أحد — لم يجب أي فريق"
              className="sm:col-span-2 rounded-2xl border-2 border-white/30 bg-transparent hover:bg-white/5 disabled:opacity-60 disabled:cursor-not-allowed px-5 py-4 text-white text-lg font-bold transition-colors"
            >
              لا أحد
            </button>
          </div>

          {error && (
            <p className="text-center text-[--game-accent] font-bold bg-black/30 rounded-2xl px-4 py-2 text-sm">
              {error}
            </p>
          )}
        </div>
      </div>
    </main>
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
