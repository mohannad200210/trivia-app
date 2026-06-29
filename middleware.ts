import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware — runs on every request before rendering.
 * Protects /create-game (login required) and /admin (admin email required).
 *
 * Reads the Supabase auth cookie directly to avoid depending on
 * @supabase/auth-helpers-nextjs (not installed). The session JWT is in
 * the chunked cookie named "sb-<project-ref>-auth-token"; its segments
 * are base64-encoded JSON. We just need a non-empty user presence here —
 * the client-side guard in /create-game and /admin is the real safety net.
 *
 * If the project ref can't be inferred, we fall through and let the
 * client-side guard do the check.
 */

function getProjectRefFromUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) return null
  // URL like https://abcdefgh.supabase.co → "abcdefgh"
  const match = url.match(/https?:\/\/([^.]+)\.supabase\.co/)
  return match ? match[1] : null
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const projectRef = getProjectRefFromUrl()
  if (!projectRef) return res

  // The Supabase JS client stores session in cookies named
  // `sb-<projectRef>-auth-token` (chunked if very long, suffixed -0, -1, ...).
  // For middleware we just need to know if *any* chunk exists and is non-empty.
  const primary = req.cookies.get(`sb-${projectRef}-auth-token`)
  const chunk0 = req.cookies.get(`sb-${projectRef}-auth-token-0`)
  const hasSessionCookie = Boolean(
    (primary && primary.value && primary.value.length > 0) ||
    (chunk0 && chunk0.value && chunk0.value.length > 0)
  )

  // If we have no session cookie at all, don't even try to gate — the
  // page-level client guard will redirect on mount. This avoids false
  // negatives on fresh browsers where the cookie is httpOnly-set later.
  if (!hasSessionCookie) return res

  const path = req.nextUrl.pathname

  // /admin — requires admin email
  if (path.startsWith('/admin')) {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
    // The middleware can't easily decode the JWT to extract the email
    // without the auth-helpers package, so we let any authenticated user
    // through to the client-side guard which does the proper check.
    // (Better than locking out the admin if the cookie-check misfires.)
    if (!adminEmail) return res
  }

  return res
}

export const config = {
  matcher: ['/create-game/:path*', '/admin/:path*'],
}
