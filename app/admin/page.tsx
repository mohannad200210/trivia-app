import Link from 'next/link'

/**
 * /admin — landing page for the admin dashboard.
 * Dark theme, single CTA into /admin/questions.
 */
export default function AdminHomePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 sm:px-8 py-10">
      <div className="max-w-2xl mx-auto text-center space-y-8 pt-16">
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold">لوحة الإدارة</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            إدارة أسئلة اللعبة ووسائطها
          </p>
        </div>

        <Link
          href="/admin/questions"
          className="inline-flex items-center gap-3 rounded-2xl bg-[#FB6B2C] px-8 py-4 text-white font-bold text-lg shadow-[0_6px_0_0_rgba(0,0,0,0.35)] hover:brightness-110 active:translate-y-[6px] active:shadow-[0_0px_0_0_rgba(0,0,0,0.35)] transition-all duration-100"
        >
          <span aria-hidden="true">📝</span>
          إدارة الأسئلة
        </Link>

        <p className="text-xs text-gray-600 pt-8">
          لا توجد مصادقة بعد (المرحلة الثانية) — لا تشارك هذا الرابط.
        </p>
      </div>
    </main>
  )
}
