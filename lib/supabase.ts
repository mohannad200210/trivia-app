import { createClient } from '@supabase/supabase-js'

/**
 * Supabase browser client — singleton.
 *
 * Reads credentials from env vars at runtime.
 * Both vars are prefixed NEXT_PUBLIC_ so they are safely exposed to the browser
 * (they are anon/public-read keys, never secret keys).
 *
 * Copy .env.example → .env.local and fill in your project values before running.
 * See SKILL.md §2 for stack decisions.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Copy .env.example → .env.local and fill in your values.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
