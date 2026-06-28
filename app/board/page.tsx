'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { fetchBoardData } from '@/lib/board'
import { finishGame } from '@/lib/finish-game'
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
      .then((d) => {
        setData(d)
        // Auto-finish: if all 36 cells are answered, end the game and
        // route to /results. Runs after every return from /answer (the
        // _t refreshKey triggers a re-fetch). The UPDATE is best-effort:
        // if it fails we still navigate, since /results works regardless
        // of status.
        if (d.cells.length === 36 && d.cells.every((c) => c.is_answered)) {
          finishGame(gameId).catch(() => {})
          router.push(`/results?gameId=${gameId}`)
        }
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'فشل تحميل اللوحة'))
  }, [gameId, refreshKey, router])

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

  // "انتهاء اللعبة" — mark finished, then navigate. UPDATE is
  // best-effort; /results reads the game regardless of status.
  const handleEndGame = () => {
    if (!gameId) return
    finishGame(gameId).catch(() => {})
    router.push(`/results?gameId=${gameId}`)
  }

  return (
    // Gameplay (dark) theme per DESIGN.md ADDENDUM. h-screen + flex-col +
    // flex-1 on the grid container is what lets the 6×6 grid fit the
    // viewport without vertical scroll: the chrome (top bar + score bar +
    // progress hint) takes its natural height, and the grid stretches
    // to fill the remainder. min-h-0 on the flex child is required so
    // the grid can shrink below its intrinsic content height.
    <main className="h-screen bg-[--game-bg] text-[--game-text] flex flex-col overflow-hidden">
      <TopBar game={game} teams={teams} onEndGame={handleEndGame} />

      {/* ── Compact score bar — flex-shrink-0 so it stays at its natural height */}
      <div className="px-3 sm:px-4 py-2 flex gap-2 flex-shrink-0">
        {teams.map((team) => {
          const isCurrent = team.id === game.current_turn_team_id
          return (
            <div
              key={team.id}
              className={[
                'flex-1 rounded-xl px-3 py-2 flex items-center gap-2',
                'bg-[--game-surface]',
                isCurrent ? 'ring-2 ring-[--game-accent]' : '',
              ].join(' ')}
            >
              <span
                aria-hidden="true"
                className="w-7 h-7 rounded-full flex-shrink-0"
                style={{ backgroundColor: team.color }}
              />
              <span className="text-sm sm:text-base font-bold text-white truncate flex-1 min-w-0">
                {team.name}
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-white tabular-nums">
                {team.score}
              </span>
            </div>
          )
        })}
      </div>

      {/* ── Progress hint — single tight line */}
      <p className="px-3 sm:px-4 pb-1 text-[10px] text-[--game-text-muted] flex-shrink-0">
        {unansweredCount} / 36 خلية متبقية
      </p>

      {/* ── Board grid — fills remaining height, scrolls horizontally if narrow */}
      <div className="flex-1 min-h-0 px-3 sm:px-4 pb-3 sm:pb-4 overflow-x-auto">
        <div
          className="grid h-full min-w-[36rem] grid-cols-6
                     grid-rows-[auto_repeat(6,minmax(0,1fr))] gap-2"
        >
          {/* Category header row — auto-height so the pill sits tight above
              its column (only the gap-2 below it separates from row 1) */}
          {game.selected_category_ids.map((catId) => (
            <div
              key={`hdr-${catId}`}
              className="bg-[--game-accent] rounded-full px-1 sm:px-2 flex items-center justify-center"
            >
              <span className="text-[10px] sm:text-xs font-bold text-white leading-tight truncate">
                {categoryNames.get(catId) ?? '—'}
              </span>
            </div>
          ))}

          {/* 6 value rows. Each cell is a flat compact tile sized by the
              1fr row, not aspect-square, so the row's height drives the cell. */}
          {VALUE_ROWS.map(({ value, slot }, rowIdx) => (
            <FragmentCells key={`row-${rowIdx}`}>
              {game.selected_category_ids.map((catId) => {
                const cell = cellLookup.get(`${catId}:${value}:${slot}`)
                if (!cell) {
                  // Defensive: should never happen if the RPC ran correctly.
                  return (
                    <div
                      key={`missing-${catId}-${rowIdx}`}
                      className="rounded-md bg-[--game-accent-muted] opacity-30"
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
                      'rounded-md flex items-center justify-center',
                      'text-lg sm:text-xl font-extrabold text-white tabular-nums',
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
