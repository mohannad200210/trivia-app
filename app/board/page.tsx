'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { fetchBoardData } from '@/lib/board'
import type { BoardData, GameCell, PointValue, SlotIndex } from '@/lib/types'
import { TopBar } from '@/components/game/TopBar'

/**
 * /board — Jeopardy-style 6×6 score board.
 * SKILL.md §5, DESIGN.md gameplay (dark) theme.
 *
 * The `?gameId=...&_t=<ts>` query string includes an `_t` timestamp
 * that /answer sets on its return navigation. We depend on it in the
 * useEffect so the board always re-fetches fresh data after a cell is
 * resolved (the supabase client doesn't cache, but we want to be sure
 * the React state resets too).
 */

// Board cell layout: 6 rows, each row has one cell per category column.
// Each point value has 2 slots (slot 1 then slot 2) per column.
const VALUE_ROWS: Array<{ value: PointValue; slot: SlotIndex }> = [
  { value: 200, slot: 1 },
  { value: 200, slot: 2 },
  { value: 400, slot: 1 },
  { value: 400, slot: 2 },
  { value: 600, slot: 1 },
  { value: 600, slot: 2 },
]

export default function BoardPage() {
  return (
    <Suspense fallback={<BoardFallback />}>
      <BoardInner />
    </Suspense>
  )
}

function BoardFallback() {
  return (
    <main className="min-h-screen bg-[--game-bg] text-white flex items-center justify-center">
      <p className="text-[--game-text-muted]">جاري التحميل…</p>
    </main>
  )
}

function BoardInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const gameId = searchParams.get('gameId')
  // _t is set by /answer's return navigation to force a re-fetch. Also
  // captures full searchParams string so future refresh params work too.
  const refreshKey = searchParams.toString()

  const [data, setData] = useState<BoardData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!gameId) {
      setError('لم يتم تحديد معرّف اللعبة. ارجع إلى صفحة الإنشاء.')
      return
    }
    setData(null)
    setError(null)
    fetchBoardData(gameId)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'فشل تحميل اللوحة'))
  }, [gameId, refreshKey])

  // Pre-compute cell lookups once data is loaded.
  const { categoryNames, cellLookup, currentTeam } = useMemo(() => {
    if (!data) {
      return {
        categoryNames: new Map<string, string>(),
        cellLookup: new Map<string, GameCell>(),
        currentTeam: null as BoardData['teams'][number] | null,
      }
    }

    const categoryNames = new Map<string, string>()
    for (const cat of data.categories) {
      categoryNames.set(cat.id, cat.name_ar)
    }

    const cellLookup = new Map<string, GameCell>()
    for (const cell of data.cells) {
      cellLookup.set(
        `${cell.category_id}:${cell.point_value}:${cell.slot_index}`,
        cell
      )
    }

    const teamsById = new Map(data.teams.map((t) => [t.id, t]))
    const currentTeam = data.game.current_turn_team_id
      ? teamsById.get(data.game.current_turn_team_id) ?? null
      : null

    return { categoryNames, cellLookup, currentTeam }
  }, [data])

  if (error) {
    return (
      <main className="min-h-screen bg-[--game-bg] text-white flex flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-[--game-accent] text-lg font-bold">{error}</p>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="rounded-full bg-[--game-accent] px-6 py-2 text-white font-bold shadow-[0_6px_0_0_rgba(0,0,0,0.25)] active:translate-y-[6px] active:shadow-[0_0px_0_0_rgba(0,0,0,0.25)] transition-all duration-100 ease-out"
        >
          العودة إلى البداية
        </button>
      </main>
    )
  }

  if (!data) return <BoardFallback />

  const { game, teams, cells } = data
  const unansweredCount = cells.filter((c) => !c.is_answered).length

  const handleCellTap = (cell: GameCell) => {
    if (cell.is_answered || !gameId) return
    router.push(`/question?gameId=${gameId}&cellId=${cell.id}`)
  }

  return (
    // Gameplay (dark) theme per DESIGN.md ADDENDUM
    <main className="min-h-screen bg-[--game-bg] text-[--game-text]">
      <TopBar game={game} teams={teams} />

      {/* ── Score bar — always visible, current team highlighted */}
      <div className="px-4 py-3 flex gap-3">
        {teams.map((team) => {
          const isCurrent = team.id === game.current_turn_team_id
          return (
            <div
              key={team.id}
              className={[
                'flex-1 rounded-2xl p-3 sm:p-4 flex items-center gap-3',
                'bg-[--game-surface]',
                isCurrent ? 'ring-2 ring-[--game-accent]' : '',
              ].join(' ')}
            >
              <span
                aria-hidden="true"
                className="w-8 h-8 rounded-full flex-shrink-0"
                style={{ backgroundColor: team.color }}
              />
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-white truncate">{team.name}</span>
                {isCurrent && (
                  <span className="text-xs text-[--game-accent] font-medium">
                    يلعب الآن
                  </span>
                )}
              </div>
              <span className="ms-auto text-2xl font-extrabold text-white tabular-nums">
                {team.score}
              </span>
            </div>
          )
        })}
      </div>

      {/* ── Progress hint ──────────────────────────────────────────── */}
      <p className="px-4 text-xs text-[--game-text-muted] text-center">
        {unansweredCount} خلية متبقية من 36
      </p>

      {/* ── Board grid — 6 columns × 6 value rows + 1 header row */}
      <div className="px-3 sm:px-4 py-3">
        <div className="grid grid-cols-6 gap-2 sm:gap-3">
          {/* Category header row */}
          {game.selected_category_ids.map((catId) => (
            <div
              key={`hdr-${catId}`}
              className="bg-[--game-accent] rounded-full px-1 sm:px-2 py-1 text-center min-h-[2.25rem] flex items-center justify-center"
            >
              <span className="text-[10px] sm:text-sm font-bold text-white leading-tight line-clamp-2">
                {categoryNames.get(catId) ?? '—'}
              </span>
            </div>
          ))}

          {/* 6 value rows */}
          {VALUE_ROWS.map(({ value, slot }, rowIdx) => (
            <FragmentCells key={`row-${rowIdx}`}>
              {game.selected_category_ids.map((catId) => {
                const cell = cellLookup.get(`${catId}:${value}:${slot}`)
                if (!cell) {
                  // Defensive: should never happen if the RPC ran correctly.
                  return (
                    <div
                      key={`missing-${catId}-${rowIdx}`}
                      className="aspect-square rounded-2xl bg-[--game-accent-muted] opacity-30"
                    />
                  )
                }
                return (
                  <button
                    key={cell.id}
                    type="button"
                    disabled={cell.is_answered}
                    onClick={() => handleCellTap(cell)}
                    aria-label={
                      cell.is_answered
                        ? `${value} نقطة — تم الإجابة`
                        : `${value} نقطة`
                    }
                    className={[
                      'aspect-square rounded-2xl flex items-center justify-center',
                      'text-2xl sm:text-3xl font-extrabold text-white tabular-nums',
                      'transition-transform duration-150 ease-out',
                      cell.is_answered
                        ? 'bg-[--game-accent-muted] opacity-40 cursor-not-allowed'
                        : 'bg-[--game-surface] hover:scale-[1.03] active:scale-[0.97] cursor-pointer',
                    ].join(' ')}
                  >
                    {cell.point_value}
                  </button>
                )
              })}
            </FragmentCells>
          ))}
        </div>
      </div>
    </main>
  )
}

/** Tiny wrapper so we can use a keyed fragment without importing React. */
function FragmentCells({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
