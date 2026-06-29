import type { Metadata } from 'next'

/**
 * /admin — private admin dashboard. No auth in MVP (Phase 2 — SKILL.md §11).
 *
 * This layout just sets metadata. Auth gating and role checks come later.
 */
export const metadata: Metadata = {
  title: 'لوحة الإدارة',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
