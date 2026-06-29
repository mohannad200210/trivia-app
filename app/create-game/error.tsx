'use client'
import { useEffect } from 'react'
export default function CreateGameError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[CreateGameError]', error)
  }, [error])
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FB6B2C] to-[#C61E45] flex flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-3xl font-bold text-white">تعذّر تحميل الصفحة</h1>
      <p className="text-white/80 text-sm bg-black/20 rounded-2xl px-4 py-3 max-w-md font-mono">
        {error.message}
      </p>
      <button
        onClick={reset}
        className="rounded-full bg-white px-8 py-3 text-[#C61E45] font-bold shadow-[0_6px_0_0_rgba(0,0,0,0.25)] active:translate-y-[6px] active:shadow-none transition-all duration-100"
      >
        إعادة المحاولة
      </button>
    </main>
  )
}
