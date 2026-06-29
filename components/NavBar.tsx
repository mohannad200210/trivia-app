'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { isAdmin } from '@/lib/auth'

/**
 * NavBar — top-right auth controls.
 * Logged out: دخول + إنشاء حساب buttons
 * Logged in: email + خروج (and الإدارة if admin)
 */
export function NavBar() {
  const { user, loading, signOut } = useAuth()

  return (
    <nav className="w-full flex items-center justify-between px-4 sm:px-8 pt-4 pb-2">
      <span className="text-white font-extrabold text-lg">🎯 لعبة المعلومات</span>

      <div className="flex items-center gap-3">
        {loading ? null : user ? (
          <>
            {isAdmin(user) && (
              <Link
                href="/admin/questions"
                className="text-white/80 text-sm font-bold hover:text-white transition-colors"
              >
                الإدارة
              </Link>
            )}
            <span className="text-white/70 text-sm hidden sm:block" dir="ltr">{user.email}</span>
            <button
              onClick={signOut}
              className="rounded-full bg-white/20 px-4 py-1.5 text-white text-sm font-bold hover:bg-white/30 transition-colors"
            >
              خروج
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-full bg-white/20 px-4 py-1.5 text-white text-sm font-bold hover:bg-white/30 transition-colors"
            >
              دخول
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-white px-4 py-1.5 text-[#C61E45] text-sm font-bold shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:brightness-95 transition-all"
            >
              إنشاء حساب
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
