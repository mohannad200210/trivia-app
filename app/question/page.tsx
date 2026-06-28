'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { fetchQuestionData } from '@/lib/play'
import { finishGame } from '@/lib/finish-game'
import type { QuestionData } from '@/lib/types'
import { TopBar } from '@/components/game/TopBar'
import { QuestionPanel } from '@/components/game/QuestionPanel'
import { Timer } from '@/components/game/Timer'

/**
 * /question — picked cell's question text + timer + reveal button.
 * SKILL.md §5, DESIGN.md dark gameplay theme.
 *
 * Flow: /board picks a cell → /question shows it + countdown →
 * host taps "الإجابة" → /answer reveals the correct answer.
 * Timer is informational; does NOT auto-advance.
 */

export default function QuestionPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <QuestionInner />
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

function QuestionInner() {
  const router = useRouter()
  const params = useSearchParams()
  const gameId = params.get('gameId')
  const cellId = params.get('cellId')

  const [data, setData] = useState<QuestionData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!cellId) {
      setError('لم يتم تحديد معرّف الخلية. ارجع إلى اللوحة.')
      return
    }
    setData(null)
    setError(null)
    fetchQuestionData(cellId)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'فشل تحميل السؤال'))
  }, [cellId])

  if (error) {
    return <ErrorScreen message={error} onExit={() => router.push('/')} />
  }
  if (!data) return <PageFallback />

  const { game, teams, cell, question, category } = data

  // Defensive: if the cell is already answered (shouldn't happen via normal
  // flow, but a stale link could land here), bounce back to the board.
  if (cell.is_answered) {
    return (
      <ErrorScreen
        message="هذه الخلية تمّت الإجابة عنها بالفعل."
        onExit={() => router.push(`/board?gameId=${gameId}&_t=${Date.now()}`)}
      />
    )
  }

  const goToAnswer = () => {
    if (!gameId) return
    router.push(`/answer?gameId=${gameId}&cellId=${cellId}`)
  }

  const handleEndGame = () => {
    if (!gameId) return
    finishGame(gameId).catch(() => {})
    router.push(`/results?gameId=${gameId}`)
  }

  return (
    <main className="min-h-screen bg-[--game-bg] text-[--game-text] flex flex-col">
      <TopBar game={game} teams={teams} showBackToBoard onEndGame={handleEndGame} />

      <div className="flex-1 px-4 sm:px-8 py-6 sm:py-8">
        <div className="max-w-3xl mx-auto space-y-8 flex flex-col">
          <QuestionPanel category={category} cell={cell} question={question} />

          <div className="flex justify-center">
            <Timer initialSeconds={30} />
          </div>

          <div className="flex justify-center pt-2">
            {/* DESIGN.md: "الإجابة" reveal button = green-600 chunky pill */}
            <button
              type="button"
              onClick={goToAnswer}
              className="inline-flex items-center gap-2 rounded-full bg-green-600 px-10 py-4 text-white text-lg font-bold shadow-[0_6px_0_0_rgba(0,0,0,0.35)] transition-all duration-100 ease-out hover:brightness-110 active:translate-y-[6px] active:shadow-[0_0px_0_0_rgba(0,0,0,0.35)]"
            >
              الإجابة
              <span aria-hidden="true">→</span>
            </button>
          </div>
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
