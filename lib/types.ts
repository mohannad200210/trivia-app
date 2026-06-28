/**
 * types.ts — Shared TypeScript types for the trivia app.
 *
 * These mirror the Supabase data model defined in SKILL.md §4 exactly.
 * Do NOT drift from the SQL schema without updating both.
 *
 * No `any` types — strict mode is on (SKILL.md §9).
 */

// ─── Database row types ────────────────────────────────────────────────────

export interface Category {
  id: string
  name_ar: string
  name_en: string
  icon_url: string | null
  sort_order: number
}

export interface Choice {
  id: string
  text_ar: string
  text_en: string
}

export interface Question {
  id: string
  category_id: string
  difficulty: 'easy' | 'medium' | 'hard'
  question_text_ar: string
  question_text_en: string | null
  choices: Choice[] // jsonb — exactly 4 items
  correct_choice_id: string
  media_url: string | null
  is_active: boolean
}

export interface Game {
  id: string
  created_at: string
  host_session_id: string
  status: 'setup' | 'active' | 'finished'
  selected_category_ids: string[] // jsonb
  difficulty: 'easy' | 'medium' | 'hard' | null
  is_free_game: boolean
}

export interface Team {
  id: string
  game_id: string
  name: string
  color: string
  score: number
  helpers_used: HelpersUsed
}

export interface GameQuestion {
  id: string
  game_id: string
  question_id: string
  order_index: number
  answered_by_team_id: string | null
}

// ─── Helper tools (SKILL.md §11) ────────────────────────────────────────────

export interface HelpersUsed {
  remove_two: boolean
  double_points: boolean
  skip: boolean
}

export type HelperType = keyof HelpersUsed

// ─── UI / client-side types ────────────────────────────────────────────────

/** Active game state held in React context during a session. */
export interface GameSession {
  game: Game
  teams: Team[]
  questions: Question[]
  currentQuestionIndex: number
}
