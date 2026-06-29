'use client'
import { useEffect } from 'react'

/**
 * /admin/* error boundary. Dark theme matches the admin pages.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[AdminError]', error)
  }, [error])

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-3xl font-extrabold text-[#FB6B2C]">تعذّر تحميل لوحة الإدارة</h1>
      <p className="text-gray-300 text-sm bg-gray-900 border border-gray-800 rounded-2xl px-4 py-3 max-w-md font-mono">
        {error.message}
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-[#FB6B2C] px-8 py-3 text-white font-bold shadow-[0_6px_0_0_rgba(0,0,0,0.35)] active:translate-y-[6px] active:shadow-none transition-all duration-100"
        >
          إعادة المحاولة
        </button>
        <a
          href="/admin"
          className="rounded-full bg-gray-800 px-8 py-3 text-white font-bold border border-gray-700 hover:bg-gray-700 transition-colors"
        >
          لوحة الإدارة
        </a>
      </div>
    </main>
  )
}
