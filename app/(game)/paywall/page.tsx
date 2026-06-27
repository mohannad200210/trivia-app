import Link from 'next/link'

/**
 * Paywall stub — /paywall.
 * Visual placeholder only; no real payment logic (SKILL.md §8).
 * Payment integration starts only when explicitly requested.
 * Phase 2 will replace this with MyFatoorah or Tap Payments (KNET support).
 */
export default function PaywallPage() {
  return (
    // DESIGN.md: Primary gradient on every screen
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#FB6B2C] to-[#C61E45] px-6 text-center">

      {/* DESIGN.md card: bg-white rounded-3xl p-6 sm:p-8 */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 flex flex-col items-center gap-6 max-w-md w-full shadow-lg">

        {/* Lock icon */}
        <div
          className="flex h-24 w-24 items-center justify-center rounded-3xl text-5xl"
          style={{ backgroundColor: '#FB6B2C22' }}
          aria-hidden="true"
        >
          🔒
        </div>

        <div className="flex flex-col gap-3">
          {/* DESIGN.md h1 typography — dark text on white card */}
          <h1 className="text-4xl font-extrabold text-gray-900">
            لعبت مجانك!
          </h1>
          <p className="text-gray-500 text-base leading-relaxed">
            استمتعت بلعبتك المجانية.
            <br />
            الاشتراك لاستكمال اللعب — قريباً.
          </p>
        </div>

        {/* Coming soon badge */}
        <span
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold"
          style={{ backgroundColor: '#FB6B2C22', color: '#C61E45' }}
        >
          <span aria-hidden="true">⏳</span>
          قريباً — Coming Soon
        </span>

        <p className="text-gray-400 text-sm">
          سيتم دعم KNET والبطاقات الائتمانية
        </p>

        {/* DESIGN.md chunky button */}
        <Link
          id="paywall-back-home"
          href="/"
          className="w-full rounded-full bg-[#C61E45] text-white text-lg font-bold px-7 py-4 text-center
                     shadow-[0_6px_0_0_rgba(0,0,0,0.25)] transition-all duration-100
                     hover:brightness-110
                     active:translate-y-[6px] active:shadow-[0_0px_0_0_rgba(0,0,0,0.25)]"
        >
          العودة للرئيسية
        </Link>
      </div>
    </main>
  )
}
