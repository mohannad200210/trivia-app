'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import QuestionCard from '@/components/game/QuestionCard'
import ScoreStrip, { type ActiveTeam } from '@/components/game/ScoreStrip'
import { selectQuestions } from '@/lib/questions'           // ← real Supabase query
import { recordGameQuestion, updateTeamScore, finishGame } from '@/lib/db'
import type { Question } from '@/lib/types'

const QUESTIONS_PER_GAME = 10

// ── Types ─────────────────────────────────────────────────────────────────────

/** Team as passed from /teams — now includes Supabase UUID for DB writes */
interface TeamParam {
  id: string    // Supabase teams.id UUID
  name: string
  color: string
}

// ── Inner component ───────────────────────────────────────────────────────────

function PlayContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // ── Parse URL params ────────────────────────────────────────────────────────
  const gameId = searchParams.get('gameId') ?? ''

  const categoryIds = useMemo(
    () => (searchParams.get('categories') ?? '').split(',').filter(Boolean),
    [searchParams]
  )

  const difficulty = useMemo(() => {
    const d = searchParams.get('difficulty') ?? 'medium'
    return d as 'easy' | 'medium' | 'hard'
  }, [searchParams])

  const teamParams: TeamParam[] = useMemo(() => {
    try {
      return JSON.parse(searchParams.get('teams') ?? '[]') as TeamParam[]
    } catch {
      return []
    }
  }, [searchParams])

  // ── Async question loading ──────────────────────────────────────────────────
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionsLoading, setQuestionsLoading] = useState(true)
  const [questionsError, setQuestionsError] = useState<string | null>(null)

  useEffect(() => {
    selectQuestions(categoryIds, difficulty, QUESTIONS_PER_GAME)
      .then(setQuestions)
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'خطأ في تحميل الأسئلة'
        setQuestionsError(msg)
      })
      .finally(() => setQuestionsLoading(false))
    // Run once — question list is fixed for the whole game session
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Game state ──────────────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0)
  const [scores, setScores] = useState<number[]>(() => teamParams.map(() => 0))

  const teams: ActiveTeam[] = teamParams.map((t, i) => ({
    name: t.name,
    color: t.color,
    score: scores[i],
  }))

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex >= questions.length - 1

  // ── Navigation to results ───────────────────────────────────────────────────
  const goToResults = useCallback(
    (finalScores: number[]) => {
      // finishGame is fire-and-forget — doesn't block navigation
      if (gameId) finishGame(gameId)

      const finalTeams = teamParams.map((t, i) => ({
        name: t.name,
        color: t.color,
        score: finalScores[i],
      }))
      const params = new URLSearchParams({ teams: JSON.stringify(finalTeams) })
      router.push(`/results?${params.toString()}`)
    },
    [router, teamParams, gameId]
  )

  // ── Advance to next question or end ────────────────────────────────────────
  const advance = useCallback(
    (nextScores: number[]) => {
      if (isLastQuestion) {
        goToResults(nextScores)
      } else {
        setCurrentIndex((i) => i + 1)
      }
    },
    [isLastQuestion, goToResults]
  )

  // ── Award point to a team ───────────────────────────────────────────────────
  const handleAward = useCallback(
    (teamIndex: number) => {
      const next = scores.map((s, i) => (i === teamIndex ? s + 1 : s))
      setScores(next)

      // Fire-and-forget DB writes — never block the game flow
      if (gameId && currentQuestion) {
        recordGameQuestion(
          gameId,
          currentQuestion.id,
          currentIndex,
          teamParams[teamIndex].id
        )
        updateTeamScore(teamParams[teamIndex].id, next[teamIndex])
      }

      advance(next)
    },
    [scores, advance, gameId, currentQuestion, currentIndex, teamParams]
  )

  // ── Skip (no team answered) ─────────────────────────────────────────────────
  const handleSkip = useCallback(() => {
    // Record the unanswered question (answered_by_team_id = null)
    if (gameId && currentQuestion) {
      recordGameQuestion(gameId, currentQuestion.id, currentIndex, null)
    }
    advance(scores)
  }, [scores, advance, gameId, currentQuestion, currentIndex])

  // ── End game early ──────────────────────────────────────────────────────────
  const handleEndGame = () => {
    goToResults(scores)
  }

  // ── Loading state ───────────────────────────────────────────────────────────
  if (questionsLoading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#FB6B2C] to-[#C61E45] gap-6">
        <span
          className="h-12 w-12 rounded-full border-4 border-white/30 border-t-white animate-spin"
          aria-hidden="true"
        />
        <p className="text-white/80 font-medium">جارٍ تحميل الأسئلة…</p>
      </main>
    )
  }

  // ── Error / empty state ─────────────────────────────────────────────────────
  if (questionsError || !currentQuestion) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#FB6B2C] to-[#C61E45] text-center p-8 gap-4">
        <span className="text-5xl" aria-hidden="true">😕</span>
        <p className="text-2xl font-bold text-white">
          {questionsError ? 'تعذّر تحميل الأسئلة' : 'لا توجد أسئلة لهذا الاختيار'}
        </p>
        {questionsError && (
          <p className="text-white/60 text-sm">{questionsError}</p>
        )}
        {/* DESIGN.md chunky button */}
        <button
          type="button"
          onClick={() => router.push('/')}
          className="rounded-full bg-white text-[#C61E45] font-bold px-8 py-4 text-lg
                     shadow-[0_6px_0_0_rgba(0,0,0,0.25)] transition-all duration-100
                     active:translate-y-[6px] active:shadow-none hover:brightness-95"
        >
          العودة للرئيسية
        </button>
      </main>
    )
  }

  // ── Main game screen ────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-[#FB6B2C] to-[#C61E45] relative overflow-hidden">

      <header className="relative z-10 flex items-center justify-between px-4 sm:px-8 pt-6 pb-2">
        {/* Difficulty badge on gradient */}
        <span className="rounded-full bg-black/30 px-3 py-1 text-xs font-bold text-white/80 uppercase tracking-wide">
          {{ easy: 'سهل', medium: 'متوسط', hard: 'صعب' }[difficulty]}
        </span>

        {/* End game button */}
        <button
          id="end-game"
          type="button"
          onClick={handleEndGame}
          className="rounded-full bg-black/30 px-4 py-2 text-sm font-bold text-white/70 hover:text-white hover:bg-black/50 transition-all"
        >
          إنهاء اللعبة ✕
        </button>
      </header>

      {/* Question area */}
      <section
        className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-4 max-w-4xl mx-auto w-full"
        aria-live="polite"
        aria-atomic="true"
      >
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
        />
      </section>

      {/* Score strip */}
      <footer className="relative z-10 sticky bottom-0 bg-black/30 backdrop-blur-md border-t border-white/20 px-4 sm:px-8 py-5">
        <div className="max-w-4xl mx-auto">
          <ScoreStrip
            teams={teams}
            onAward={handleAward}
            onSkip={handleSkip}
          />
        </div>
      </footer>
    </main>
  )
}

export default function PlayPage() {
  return (
    <Suspense>
      <PlayContent />
    </Suspense>
  )
}
