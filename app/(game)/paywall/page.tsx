import Link from 'next/link'

/**
 * Paywall stub — /paywall.
 * Visual placeholder only; no real payment logic (SKILL.md §8).
 * Payment integration starts only when explicitly requested.
 * Phase 2 will replace this with MyFatoorah or Tap Payments (KNET support).
 */
export default function PaywallPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 px-6 text-center relative overflow-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="h-[500px] w-[500px] rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: '#f59e0b' }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-md">
        {/* Lock icon */}
        <div
          className="flex h-24 w-24 items-center justify-center rounded-3xl text-5xl"
          style={{ backgroundColor: '#f59e0b22' }}
          aria-hidden="true"
        >
          🔒
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-extrabold text-white">
            لعبت مجانك!
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            استمتعت بلعبتك المجانية.
            <br />
            الاشتراك لاستكمال اللعب — قريباً.
          </p>
        </div>

        {/* Coming soon badge */}
        <span
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold"
          style={{ backgroundColor: '#f59e0b22', color: '#f59e0b' }}
        >
          <span aria-hidden="true">⏳</span>
          قريباً — Coming Soon
        </span>

        <p className="text-gray-600 text-sm">
          سيتم دعم KNET والبطاقات الائتمانية
        </p>

        {/* Back to home */}
        <Link
          id="paywall-back-home"
          href="/"
          className="mt-4 rounded-xl px-7 py-3 font-bold text-base bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          → العودة للرئيسية
        </Link>
      </div>
    </main>
  )
}
