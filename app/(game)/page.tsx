'use client'

import Link from 'next/link'

// ── DESIGN.md: category tile colors (exact, sort_order 1-8) ─────────────────
// Used for the non-selectable teaser grid only (marketing preview).
const TEASER_CATEGORIES = [
  { name_ar: 'معلومات عامة', name_en: 'General Knowledge', emoji: '🧠', color: '#2D6A4F' },
  { name_ar: 'جغرافيا',      name_en: 'Geography',         emoji: '🌍', color: '#1B4965' },
  { name_ar: 'رياضة',        name_en: 'Sports',            emoji: '⚽', color: '#7B2D8E' },
  { name_ar: 'أفلام ومسلسلات', name_en: 'Movies & TV',    emoji: '🎬', color: '#B5179E' },
  { name_ar: 'تاريخ',        name_en: 'History',           emoji: '📜', color: '#E85D04' },
  { name_ar: 'علوم',         name_en: 'Science',           emoji: '🔬', color: '#3A86FF' },
  { name_ar: 'ألعاب',        name_en: 'Gaming',            emoji: '🎮', color: '#6A994E' },
  { name_ar: 'فن وموسيقى',  name_en: 'Art & Music',       emoji: '🎵', color: '#9D0208' },
]

// ── How it works steps ────────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  { step: '١', emoji: '🗂️', label: 'اختار الفئات',  desc: 'اختر من بين 8 فئات متنوعة تناسب جميع الأذواق' },
  { step: '٢', emoji: '👥', label: 'كوّن فريقك',   desc: 'سجّل فرقك — من فريقين حتى ستة فرق' },
  { step: '٣', emoji: '⚡', label: 'ابدأ التحدي',  desc: 'أجب بصوت عالٍ والمضيف يمنح النقاط للفائز' },
]

export default function LandingPage() {
  return (
    // DESIGN.md: Primary gradient as page background — 135deg warm orange → deep crimson
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-[#FB6B2C] to-[#C61E45]">

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
          Full-bleed gradient, centred title + tagline + chunky CTA.
          DESIGN.md §Typography: h1 = text-5xl sm:text-6xl font-extrabold text-white
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="flex flex-col items-center justify-center min-h-[85vh] px-4 sm:px-8 py-12 text-center space-y-8">

        {/* App icon / logo placeholder */}
        <div
          className="flex h-28 w-28 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm shadow-lg text-6xl"
          aria-hidden="true"
        >
          🎯
        </div>

        {/* App title — DESIGN.md h1 typography */}
        <div className="space-y-3">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight">
            لعبة المعلومات
          </h1>
          <p className="text-white/80 text-xl sm:text-2xl font-medium max-w-sm mx-auto leading-relaxed">
            العب مع عيلتك وأصدقائك في أمسية لا تُنسى!
          </p>
        </div>

        {/* ── Chunky CTA button — DESIGN.md §Shape & elevation ── */}
        {/*
          Default:  rounded-full bg-white shadow-[0_6px_0_0_rgba(0,0,0,0.25)] translate-y-0
          Active:   translate-y-[6px] shadow-[0_0px_0_0_rgba(0,0,0,0.25)]
        */}
        <Link
          id="hero-cta"
          href="/categories"
          className="inline-flex items-center gap-3 rounded-full bg-white px-10 py-4
                     text-[#C61E45] text-lg font-bold
                     shadow-[0_6px_0_0_rgba(0,0,0,0.25)]
                     transition-all duration-100 ease-out
                     hover:brightness-95
                     active:translate-y-[6px] active:shadow-[0_0px_0_0_rgba(0,0,0,0.25)]"
        >
          ابدأ اللعبة
          <span aria-hidden="true">🎮</span>
        </Link>

        {/* Scroll hint */}
        <p className="text-white/50 text-sm animate-bounce mt-4 select-none" aria-hidden="true">
          ↓
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2 — HOW IT WORKS
          3-step horizontal strip per SKILL.md §12.
          Cards use DESIGN.md --surface-card-muted (#FFF4ED), rounded-3xl, p-6 sm:p-8.
          DESIGN.md section spacing: space-y-8, screen padding: px-4 sm:px-8 py-6
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="how-it-works-title"
        className="px-4 sm:px-8 py-12"
      >
        <div className="max-w-4xl mx-auto space-y-8">
          {/* DESIGN.md h2 typography */}
          <h2
            id="how-it-works-title"
            className="text-3xl sm:text-4xl font-bold text-white text-center"
          >
            كيف تلعب؟
          </h2>

          {/* 3-step grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {HOW_IT_WORKS.map((item, idx) => (
              <div
                key={idx}
                // DESIGN.md: surface-card-muted = #FFF4ED, rounded-3xl (--radius-card), p-6 sm:p-8
                className="rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center gap-4"
                style={{ backgroundColor: '#FFF4ED' }}
              >
                {/* Step number pill */}
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C61E45] text-white text-base font-extrabold"
                  aria-hidden="true"
                >
                  {item.step}
                </span>

                {/* Emoji */}
                <span className="text-4xl" aria-hidden="true">{item.emoji}</span>

                {/* DESIGN.md h3 */}
                <h3 className="text-xl font-bold text-gray-900">{item.label}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 3 — CATEGORY TEASER GRID
          Marketing/preview only — NOT selectable per SKILL.md §12.
          Real selection happens on /categories.
          Tiles use DESIGN.md category palette, rounded-2xl, shadow-lg.
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="categories-preview-title"
        className="px-4 sm:px-8 py-12"
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            {/* DESIGN.md h2 typography */}
            <h2
              id="categories-preview-title"
              className="text-3xl sm:text-4xl font-bold text-white"
            >
              الفئات المتاحة
            </h2>
            <p className="text-white/70 text-base font-medium">
              8 فئات متنوعة — شيء يناسب الجميع
            </p>
          </div>

          {/* DESIGN.md grid gap: gap-4 sm:gap-6 */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
            aria-label="معاينة فئات الأسئلة"
          >
            {TEASER_CATEGORIES.map((cat) => (
              // DESIGN.md tile: rounded-2xl, shadow-lg, solid bg, white text
              // No onClick / pointer-events — marketing display only
              <div
                key={cat.name_en}
                className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl shadow-lg text-center min-h-[9rem]"
                style={{ backgroundColor: cat.color }}
                aria-label={cat.name_ar}
              >
                <span className="text-4xl leading-none" aria-hidden="true">
                  {cat.emoji}
                </span>
                <div className="flex flex-col gap-0.5">
                  {/* DESIGN.md body → text-base font-medium */}
                  <span className="text-base font-bold text-white leading-tight">
                    {cat.name_ar}
                  </span>
                  <span className="text-xs text-white/70 font-medium">
                    {cat.name_en}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Inline CTA under the grid */}
          <div className="flex justify-center pt-4">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3
                         text-[#C61E45] text-base font-bold
                         shadow-[0_6px_0_0_rgba(0,0,0,0.25)]
                         transition-all duration-100 ease-out
                         hover:brightness-95
                         active:translate-y-[6px] active:shadow-[0_0px_0_0_rgba(0,0,0,0.25)]"
            >
              اختر فئاتك الآن
              <span aria-hidden="true">←</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 4 — FOOTER
          Simple, per SKILL.md §12 ("no need to replicate competitor footer").
      ═══════════════════════════════════════════════════════════════════════ */}
      <footer className="px-4 sm:px-8 py-8 mt-auto border-t border-white/20 text-center">
        <p className="text-white/50 text-sm">
          لعبة المعلومات — أمسية لا تُنسى مع عيلتك وأصدقائك 🎉
        </p>
      </footer>
    </main>
  )
}
