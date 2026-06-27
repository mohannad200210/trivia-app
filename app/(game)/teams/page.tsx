'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TeamRow, { TEAM_COLORS, type TeamState } from '@/components/game/TeamRow'
import { canStartNewGame, markFreeGameUsed, getOrCreateHostSessionId } from '@/lib/game-logic'
import { createGame, createTeams } from '@/lib/db'

const MIN_TEAMS = 2
const MAX_TEAMS = 6

function makeTeam(index: number): TeamState {
  return {
    localId: crypto.randomUUID(),
    name: '',
    color: TEAM_COLORS[index % TEAM_COLORS.length],
  }
}

const DEFAULT_NAMES = [
  'الفريق الأول',
  'الفريق الثاني',
  'الفريق الثالث',
  'الفريق الرابع',
  'الفريق الخامس',
  'الفريق السادس',
]

function TeamsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categories = searchParams.get('categories') ?? ''
  const difficulty = searchParams.get('difficulty') ?? 'medium'

  // ── Free-game gate (SKILL.md §5) ──────────────────────────────────────────
  useEffect(() => {
    if (!canStartNewGame()) {
      router.replace('/paywall')
    }
  }, [router])

  // ── Team state ────────────────────────────────────────────────────────────
  const [teams, setTeams] = useState<TeamState[]>(() => [
    { localId: crypto.randomUUID(), name: DEFAULT_NAMES[0], color: TEAM_COLORS[0] },
    { localId: crypto.randomUUID(), name: DEFAULT_NAMES[1], color: TEAM_COLORS[1] },
  ])

  // ── DB creation loading state ─────────────────────────────────────────────
  const [starting, setStarting] = useState(false)
  const [startError, setStartError] = useState<string | null>(null)

  const addTeam = () => {
    if (teams.length >= MAX_TEAMS) return
    const idx = teams.length
    setTeams((prev) => [
      ...prev,
      { ...makeTeam(idx), name: DEFAULT_NAMES[idx] },
    ])
  }

  const removeTeam = (localId: string) => {
    if (teams.length <= MIN_TEAMS) return
    setTeams((prev) => prev.filter((t) => t.localId !== localId))
  }

  const updateTeam = (
    localId: string,
    patch: Partial<Omit<TeamState, 'localId'>>
  ) => {
    setTeams((prev) =>
      prev.map((t) => (t.localId === localId ? { ...t, ...patch } : t))
    )
  }

  const allNamed = teams.every((t) => t.name.trim().length > 0)

  // ── Start game — create Supabase rows then navigate ───────────────────────
  const handleStart = async () => {
    if (!allNamed || starting) return
    setStarting(true)
    setStartError(null)

    try {
      const hostSessionId = getOrCreateHostSessionId()
      const categoryIds = categories.split(',').filter(Boolean)
      const diff = difficulty as 'easy' | 'medium' | 'hard'

      // 1. Create game row — returns game UUID
      const gameId = await createGame(hostSessionId, categoryIds, diff)

      // 2. Create team rows linked to game — returns [{id, name, color}]
      const dbTeams = await createTeams(
        gameId,
        teams.map((t) => ({ name: t.name.trim(), color: t.color }))
      )

      // 3. Mark free game as used (SKILL.md §5)
      markFreeGameUsed()

      // 4. Navigate — teams now include Supabase UUIDs for write operations in /play
      const params = new URLSearchParams({
        gameId,
        categories,
        difficulty,
        teams: JSON.stringify(dbTeams),
      })
      router.push(`/play?${params.toString()}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'خطأ غير معروف'
      setStartError(msg)
      setStarting(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-[#FB6B2C] to-[#C61E45] relative overflow-hidden">
      {/* Gradient overlay — subtle depth on top of page gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black/10"
      />

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="relative z-10 pt-10 pb-4 text-center px-4">
        {/* DESIGN.md h2: text-3xl sm:text-4xl font-bold text-white */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          إعداد الفرق
        </h1>
        <p className="text-white/70 text-base font-medium">
          أضف من{' '}
          <span className="text-white font-bold">{MIN_TEAMS}</span>
          {' '}إلى{' '}
          <span className="text-white font-bold">{MAX_TEAMS}</span>
          {' '}فرق ثم ابدأ اللعبة
        </p>
      </header>

      {/* ── Team list ──────────────────────────────────────────────────────── */}
      <section
        aria-label="قائمة الفرق"
        className="relative z-10 flex-1 flex flex-col gap-3 px-4 sm:px-8 py-4 max-w-2xl mx-auto w-full"
      >
        {teams.map((team, idx) => (
          <TeamRow
            key={team.localId}
            index={idx}
            team={team}
            canRemove={teams.length > MIN_TEAMS}
            onChange={updateTeam}
            onRemove={removeTeam}
          />
        ))}

        {teams.length < MAX_TEAMS && (
          <button
            id="add-team"
            type="button"
            onClick={addTeam}
            disabled={starting}
            className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/20 py-4 text-gray-400 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all duration-200 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="text-xl" aria-hidden="true">＋</span>
            إضافة فريق
            <span className="text-gray-600 text-sm">
              ({teams.length}/{MAX_TEAMS})
            </span>
          </button>
        )}

        {/* DB error */}
        {startError && (
          <p className="text-red-400 text-sm text-center" aria-live="assertive">
            ⚠️ {startError}
          </p>
        )}
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 sticky bottom-0 bg-black/30 backdrop-blur-md border-t border-white/20 px-4 sm:px-8 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <button
            id="back-to-difficulty"
            type="button"
            onClick={() => router.back()}
            disabled={starting}
            className="text-white/50 hover:text-white text-sm transition-colors disabled:opacity-40"
          >
            → العودة
          </button>

          {!allNamed && !starting && (
            <p className="text-amber-500 text-sm" aria-live="polite">
              سمّ جميع الفرق أولاً
            </p>
          )}

          <button
            id="start-game"
            type="button"
            onClick={handleStart}
            disabled={!allNamed || starting}
            // DESIGN.md chunky button: rounded-full bg-white shadow-[0_6px_0_0_rgba(0,0,0,0.25)]
            className={[
              'flex items-center gap-2 rounded-full px-8 py-3 text-lg font-bold transition-all duration-100',
              allNamed && !starting
                ? 'bg-white text-[#C61E45] shadow-[0_6px_0_0_rgba(0,0,0,0.25)] active:translate-y-[6px] active:shadow-none hover:brightness-95'
                : 'bg-white/30 text-white/50 cursor-not-allowed',
            ].join(' ')}
          >
            {starting ? (
              <>
                <span
                  className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                  aria-hidden="true"
                />
                جارٍ الإنشاء…
              </>
            ) : (
              <>
                ابدأ اللعبة
                <span aria-hidden="true">🚀</span>
              </>
            )}
          </button>
        </div>
      </footer>
    </main>
  )
}

export default function TeamsPage() {
  return (
    <Suspense>
      <TeamsContent />
    </Suspense>
  )
}
