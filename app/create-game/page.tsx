'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fetchCategories, type CategoryWithMeta } from '@/lib/categories'
import { createBoardGame, DEFAULT_TEAM_COLORS } from '@/lib/create-game'

/**
 * /create-game — pick 6 categories + name 2 teams.
 * SKILL.md §5, DESIGN.md marketing (light/warm gradient) theme.
 */

const REQUIRED_PICKS = 6

export default function CreateGamePage() {
  const router = useRouter()
  const [categories, setCategories] = useState<CategoryWithMeta[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [team1Name, setTeam1Name] = useState('')
  const [team2Name, setTeam2Name] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
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
    // Marketing theme: light/warm gradient per DESIGN.md §Color palette
    <main className="min-h-screen bg-gradient-to-br from-[#FB6B2C] to-[#C61E45] px-4 sm:px-8 py-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* h2 per DESIGN.md §Typography */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">
          كوّن لعبتك
        </h1>

        {/* ── Category picker ─────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">اختر {REQUIRED_PICKS} فئات</h2>
            <span
              aria-live="polite"
              className="text-white text-base font-bold tabular-nums"
            >
              {selectedIds.size}/{REQUIRED_PICKS}
            </span>
          </div>

          {loadError ? (
            <p className="text-white bg-black/20 rounded-2xl p-4">{loadError}</p>
          ) : categories.length === 0 ? (
            <p className="text-white/80">جاري التحميل…</p>
          ) : (
            // DESIGN.md grid gap: gap-4 sm:gap-6
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {categories.map((cat) => {
                const isSelected = selectedIds.has(cat.id)
                const isDisabled = full && !isSelected
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggle(cat.id)}
                    disabled={isDisabled}
                    aria-pressed={isSelected}
                    aria-label={`${cat.name_ar} — ${isSelected ? 'محدد' : 'غير محدد'}`}
                    className={[
                      'relative flex flex-col items-center justify-center gap-3',
                      'p-6 rounded-2xl shadow-lg text-center min-h-[9rem]',
                      'transition-transform duration-150 ease-out',
                      isDisabled
                        ? 'opacity-40 cursor-not-allowed'
                        : 'hover:scale-[1.03] active:scale-[0.97] cursor-pointer',
                    ].join(' ')}
                    style={{ backgroundColor: cat.color }}
                  >
                    <span className="text-4xl leading-none" aria-hidden="true">
                      {cat.emoji}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-base font-bold text-white leading-tight">
                        {cat.name_ar}
                      </span>
                      <span className="text-xs text-white/70 font-medium">
                        {cat.name_en}
                      </span>
                    </div>
                    {isSelected && (
                      <span
                        className="absolute top-2 end-2 w-7 h-7 rounded-full bg-white text-[#C61E45] font-extrabold flex items-center justify-center"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </section>

        {/* ── Team names ─────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">أسماء الفرق</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* DESIGN.md surface-card: #FFFFFF, rounded-2xl, p-6 */}
            <label className="rounded-2xl bg-white p-4 sm:p-6 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="w-10 h-10 rounded-full flex-shrink-0"
                style={{ backgroundColor: DEFAULT_TEAM_COLORS.team1 }}
              />
              <input
                type="text"
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
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
                placeholder="اسم الفريق الثاني"
                maxLength={40}
                className="flex-1 text-base font-medium text-gray-900 placeholder:text-gray-400 bg-transparent border-0 focus:outline-none focus:ring-0"
              />
            </label>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <button
            type="button"
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
    </main>
  )
}
