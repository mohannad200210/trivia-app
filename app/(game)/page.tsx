'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import CategoryCard from '@/components/game/CategoryCard'
import { supabase } from '@/lib/supabase'
import type { LocalCategory } from '@/lib/categories'

// ── Emoji + colour mapping keyed by name_en ────────────────────────────────────
// Stable identifiers — the seed data uses these exact English names (seed.sql).
const CATEGORY_META: Record<string, { emoji: string; color: string }> = {
  'General Knowledge': { emoji: '🧠', color: '#6366f1' },
  'Geography':         { emoji: '🌍', color: '#14b8a6' },
  'Sports':            { emoji: '⚽', color: '#f97316' },
  'Movies & TV':       { emoji: '🎬', color: '#ec4899' },
  'History':           { emoji: '📜', color: '#f59e0b' },
  'Science':           { emoji: '🔬', color: '#06b6d4' },
  'Gaming':            { emoji: '🎮', color: '#22c55e' },
  'Art & Music':       { emoji: '🎵', color: '#a855f7' },
}

const MAX_CATEGORIES = 6

export default function GamePage() {
  const router = useRouter()

  // ── Categories from Supabase ───────────────────────────────────────────────
  const [categories, setCategories] = useState<LocalCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('categories')
      .select('id, name_ar, name_en, sort_order')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setFetchError(error.message)
        } else if (data) {
          setCategories(
            data.map((cat) => ({
              id: cat.id as string,          // real Supabase UUID — used in question queries
              name_ar: cat.name_ar as string,
              name_en: cat.name_en as string,
              emoji: CATEGORY_META[cat.name_en as string]?.emoji ?? '❓',
              color: CATEGORY_META[cat.name_en as string]?.color ?? '#6366f1',
            }))
          )
        }
        setLoading(false)
      })
  }, [])

  // ── Selection state ────────────────────────────────────────────────────────
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id)
      if (prev.length >= MAX_CATEGORIES) return prev
      return [...prev, id]
    })
  }

  const handleNext = () => {
    if (selected.length === 0) return
    const params = new URLSearchParams({ categories: selected.join(',') })
    router.push(`/difficulty?${params.toString()}`)
  }

  const selectionLabel =
    selected.length === 0
      ? 'اختر فئة واحدة على الأقل'
      : selected.length === MAX_CATEGORIES
      ? `تم اختيار ${MAX_CATEGORIES} فئات (الحد الأقصى)`
      : `${selected.length} / ${MAX_CATEGORIES} فئات مختارة`

  return (
    <main className="min-h-screen flex flex-col bg-gray-950 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -start-40 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: '#6366f1' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -end-40 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: '#a855f7' }}
      />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="relative z-10 pt-12 pb-6 text-center px-4">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="text-4xl" aria-hidden="true">🎯</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">
          لعبة المعلومات
        </h1>
        <p className="text-gray-400 text-lg">
          اختر حتى{' '}
          <span className="text-white font-bold">{MAX_CATEGORIES}</span>
          {' '}فئات وابدأ اللعبة
        </p>
      </header>

      {/* ── Category grid ──────────────────────────────────────────────────── */}
      <section
        aria-label="فئات الأسئلة"
        className="relative z-10 flex-1 px-4 sm:px-8 lg:px-16 max-w-5xl mx-auto w-full"
      >
        {/* Error state */}
        {fetchError && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <span className="text-4xl" aria-hidden="true">⚠️</span>
            <p className="text-red-400 font-bold">تعذّر تحميل الفئات</p>
            <p className="text-gray-500 text-sm">{fetchError}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-white/10 px-5 py-2 text-white text-sm hover:bg-white/20 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !fetchError && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-2xl bg-white/5 animate-pulse"
                aria-hidden="true"
              />
            ))}
          </div>
        )}

        {/* Loaded grid */}
        {!loading && !fetchError && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                selected={selected.includes(cat.id)}
                disabled={
                  selected.length >= MAX_CATEGORIES &&
                  !selected.includes(cat.id)
                }
                onToggle={toggle}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 sticky bottom-0 bg-gray-950/80 backdrop-blur-md border-t border-white/10 px-4 sm:px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <p
            id="selection-status"
            aria-live="polite"
            className="text-sm text-gray-400 font-medium"
          >
            {loading ? 'جارٍ التحميل…' : selectionLabel}
          </p>

          <button
            id="next-to-difficulty"
            type="button"
            onClick={handleNext}
            disabled={selected.length === 0 || loading}
            className={[
              'flex items-center gap-2 rounded-xl px-7 py-3 font-bold text-base transition-all duration-200',
              selected.length > 0 && !loading
                ? 'bg-violet-600 hover:bg-violet-500 active:scale-95 text-white shadow-lg shadow-violet-900/50'
                : 'bg-white/10 text-gray-500 cursor-not-allowed',
            ].join(' ')}
          >
            التالي
            <span aria-hidden="true">←</span>
          </button>
        </div>
      </footer>
    </main>
  )
}
