import type { Metadata } from 'next'
import { Tajawal } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

/**
 * Arabic primary font — Tajawal.
 * Loaded via next/font/google so it's self-hosted and zero layout-shift.
 * CSS variable --font-tajawal is injected into <html> and consumed by tailwind.config.ts.
 * Weight 400 (regular) + 700 (bold) + 800 (extra-bold) for big game-board headings.
 * See SKILL.md §6 — never fall back to default system sans for Arabic text.
 */
const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-tajawal',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'لعبة المعلومات العامة',
  description: 'لعبة معلومات عامة للمجموعات — العائلة والأصدقاء والديوانية',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // lang="ar" dir="rtl" set at root per SKILL.md §6.
    // Never hardcode ltr anywhere in component styles.
    // If an English toggle is added later, swap lang/dir via context — not here.
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="font-sans antialiased bg-gray-950 text-white min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
