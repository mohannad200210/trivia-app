'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { fetchGroupedCategories } from '@/lib/categories'
import { createBoardGame, DEFAULT_TEAM_COLORS } from '@/lib/create-game'
import { SuperCategoryRow } from '@/components/game/SuperCategoryRow'
import { InfoModal } from '@/components/game/InfoModal'
import type { SuperCategoryWithSubs, CategoryExtended } from '@/lib/types'

/**
 * /create-game — Browse categorized quiz library, pick 6, name 2 teams, start.
 * SKILL.md §5 — marketing (light/warm gradient) theme.
 * Redesigned from flat grid to two-level super-category > sub-category browser.
 */

const REQUIRED_PICKS = 6

export default function CreateGamePage() {
  const router = useRouter()
  const [groups, setGroups] = useState<SuperCategoryWithSubs[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [infoCategory, setInfoCategory] = useState<CategoryExtended | null>(null)
  const [team1Name, setTeam1Name] = useState('')
  const [team2Name, setTeam2Name] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const counterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchGroupedCategories()
      .then(setGroups)
      .catch((e) => setLoadError(e instanceof Error ? e.message : 'Failed to load categories'))
  }, [])

  const full = selectedIds.size >= REQUIRED_PICKS
  const canStart =
    selectedIds.size === REQUIRED_PICKS &&
    team1Name.trim().length > 0 &&
    team2Name.trim().length > 0 &&
    !creating

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else if (next.size < REQUIRED_PICKS) {
        next.add(id)
      }
      return next
    })
  }

  const handleStart = async () => {
    if (!canStart) return
    setCreating(true)
    setCreateError(null)
    try {
      const { gameId } = await createBoardGame({
        selectedCategoryIds: Array.from(selectedIds),
        team1Name: team1Name.trim(),
        team2Name: team2Name.trim(),
      })
      router.push(`/board?gameId=${gameId}`)
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : 'Failed to create game')
      setCreating(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FB6B2C] to-[#C61E45] px-4 sm:px-8 py-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* ── Page title ──────────────────────────────────────────────────── */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">
          كوّن لعبتك
        </h1>

        {/* ── Sticky selection counter ─────────────────────────────────────── */}
        <div
          ref={counterRef}
          className="sticky top-4 z-40 flex justify-center pointer-events-none"
        >
          <div
            className={[
              'inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold shadow-lg transition-colors duration-300',
              full
                ? 'bg-green-500 text-white'
                : 'bg-white/90 text-[#C61E45] backdrop-blur-sm',
            ].join(' ')}
            aria-live="polite"
          >
            <span>{selectedIds.size}/{REQUIRED_PICKS}</span>
            <span>{full ? '✓ جاهز!' : 'اختر الفئات'}</span>
          </div>
        </div>

        {/* ── Category browser ─────────────────────────────────────────────── */}
        <section aria-label="اختيار الفئات">
          {loadError ? (
            <p className="text-white bg-black/20 rounded-2xl p-4">{loadError}</p>
          ) : groups.length === 0 ? (
            <p className="text-white/80 text-center">جاري التحميل…</p>
          ) : (
            <div className="space-y-6">
              {groups.map((group) => (
                <SuperCategoryRow
                  key={group.superCategory.id}
                  group={group}
                  selectedIds={selectedIds}
                  isFull={full}
                  onToggle={toggle}
                  onInfo={setInfoCategory}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Team names ───────────────────────────────────────────────────── */}
        <section aria-label="أسماء الفرق">
          <h2 className="text-xl font-bold text-white mb-4">أسماء الفرق</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="rounded-2xl bg-white p-4 sm:p-6 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="w-10 h-10 rounded-full flex-shrink-0"
                style={{ backgroundColor: DEFAULT_TEAM_COLORS.team1 }}
              />
              <input
                type="text"
                id="team1-name"
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                placeholder="اسم الفريق الأول"
                maxLength={40}
                className="flex-1 text-base font-medium text-gray-900 placeholder:text-gray-400 bg-transparent border-0 focus:outline-none focus:ring-0"
              />
            </label>
            <label className="rounded-2xl bg-white p-4 sm:p-6 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="w-10 h-10 rounded-full flex-shrink-0"
                style={{ backgroundColor: DEFAULT_TEAM_COLORS.team2 }}
              />
              <input
                type="text"
                id="team2-name"
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
                placeholder="اسم الفريق الثاني"
                maxLength={40}
                className="flex-1 text-base font-medium text-gray-900 placeholder:text-gray-400 bg-transparent border-0 focus:outline-none focus:ring-0"
              />
            </label>
          </div>
        </section>

        {/* ── Start button ─────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-3 pt-2 pb-8">
          <button
            type="button"
            id="start-game-btn"
            onClick={handleStart}
            disabled={!canStart}
            className={[
              'inline-flex items-center gap-3 rounded-full bg-white px-10 py-4',
              'text-[#C61E45] text-lg font-bold',
              'shadow-[0_6px_0_0_rgba(0,0,0,0.25)]',
              'transition-all duration-100 ease-out',
              'hover:brightness-95',
              'active:translate-y-[6px] active:shadow-[0_0px_0_0_rgba(0,0,0,0.25)]',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0',
            ].join(' ')}
          >
            {creating ? 'جاري الإنشاء…' : 'ابدأ اللعبة'}
            <span aria-hidden="true">🎮</span>
          </button>
          {createError && (
            <p className="text-white bg-black/30 rounded-2xl px-4 py-2 text-sm">
              {createError}
            </p>
          )}
        </div>
      </div>

      {/* ── Info modal ───────────────────────────────────────────────────── */}
      <InfoModal
        category={infoCategory}
        onClose={() => setInfoCategory(null)}
      />
    </main>
  )
}
