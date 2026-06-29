'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUpWithEmail, signInWithGoogle } from '@/lib/auth'
import { useAuth } from '@/contexts/AuthContext'

export default function SignupPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!loading && user) router.replace('/')
  }, [loading, user, router])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError('كلمتا المرور غير متطابقتين')
      return
    }
    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }
    setSubmitting(true)
    try {
      await signUpWithEmail(email, password)
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل إنشاء الحساب')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#FB6B2C] to-[#C61E45] flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl text-center space-y-4">
          <div className="text-5xl">📧</div>
          <h2 className="text-xl font-extrabold text-gray-900">تحقق من بريدك</h2>
          <p className="text-gray-600 text-sm">
            أرسلنا رسالة تأكيد إلى <strong>{email}</strong>. افتحها وانقر رابط التأكيد للدخول.
          </p>
          <Link
            href="/login"
            className="inline-block rounded-2xl bg-[#C61E45] px-8 py-3 text-white font-bold shadow-[0_6px_0_0_rgba(0,0,0,0.2)] active:translate-y-[6px] transition-all duration-100"
          >
            العودة لتسجيل الدخول
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FB6B2C] to-[#C61E45] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="text-5xl">🎯</div>
          <h1 className="text-2xl font-extrabold text-gray-900">إنشاء حساب جديد</h1>
        </div>

        {/* Google button — same as login */}
        <button
          type="button"
          onClick={() => signInWithGoogle().catch((e) => setError(e.message))}
          className="w-full flex items-center justify-center gap-3 rounded-2xl border-2 border-gray-200 py-3 px-4 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          التسجيل بحساب Google
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm">أو</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="signup-email" className="block text-sm font-bold text-gray-700 mb-1">البريد الإلكتروني</label>
            <input id="signup-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" dir="ltr"
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 text-sm focus:border-[#FB6B2C] focus:outline-none transition-colors" />
          </div>
          <div>
            <label htmlFor="signup-password" className="block text-sm font-bold text-gray-700 mb-1">كلمة المرور</label>
            <input id="signup-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="6 أحرف على الأقل" dir="ltr"
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 text-sm focus:border-[#FB6B2C] focus:outline-none transition-colors" />
          </div>
          <div>
            <label htmlFor="signup-confirm" className="block text-sm font-bold text-gray-700 mb-1">تأكيد كلمة المرور</label>
            <input id="signup-confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
              placeholder="أعد كتابة كلمة المرور" dir="ltr"
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 text-sm focus:border-[#FB6B2C] focus:outline-none transition-colors" />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 rounded-xl px-4 py-2 text-center">{error}</p>
          )}

          <button type="submit" disabled={submitting}
            className="w-full rounded-2xl bg-[#C61E45] py-3 text-white font-bold text-base shadow-[0_6px_0_0_rgba(0,0,0,0.2)] active:translate-y-[6px] active:shadow-none transition-all duration-100 disabled:opacity-60">
            {submitting ? 'جاري الإنشاء…' : 'إنشاء الحساب'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          لديك حساب بالفعل؟{' '}
          <Link href="/login" className="text-[#C61E45] font-bold hover:underline">تسجيل الدخول</Link>
        </p>
      </div>
    </main>
  )
}
