/**
 * types.ts — Shared TypeScript types for the trivia app.
 *
 * These mirror the Supabase data model in /SKILL.md §4 exactly.
 * Do NOT drift from the SQL schema without updating both.
 *
 * No `any` types — strict mode is on (SKILL.md §10).
 */

// ─── Enums (mirror DB CHECK constraints) ───────────────────────────────────

export type PointValue = 200 | 400 | 600

export type GameStatus = 'setup' | 'active' | 'finished'

export type SlotIndex = 1 | 2

// ─── Database row types ────────────────────────────────────────────────────

export interface Category {
  id: string
  name_ar: string
  name_en: string
  icon_url: string | null
  sort_order: number
}

export interface Question {
  id: string
  category_id: string
  point_value: PointValue
  question_text_ar: string
  answer_text_ar: string
  media_url: string | null
  is_active: boolean
}

export interface Game {
  id: string
  created_at: string
  host_session_id: string
  status: GameStatus
  selected_category_ids: string[] // jsonb, exactly 6 ids
  current_turn_team_id: string | null
}

export interface Team {
  id: string
  game_id: string
  name: string
  color: string
  score: number
  /** 1 = first team (entered first), 2 = second team. Nullable for old rows. */
  display_order: number | null
}

export interface GameCell {
  id: string
  game_id: string
  category_id: string
  point_value: PointValue
  slot_index: SlotIndex
  question_id: string
  is_answered: boolean
  answered_by_team_id: string | null
}

// ─── Joined shapes used by the /board page ─────────────────────────────────

/** Full payload the /board page needs to render. */
export interface BoardData {
  game: Game
  teams: Team[]
  cells: GameCell[]
  categories: Category[]
}

// ─── /create-game RPC payload ──────────────────────────────────────────────

/** Parameters for the create_board_game RPC. */
export interface CreateBoardGameParams {
  hostSessionId: string
  selectedCategoryIds: string[]
  team1Name: string
  team1Color: string
  team2Name: string
  team2Color: string
}

// ─── /question + /answer payloads ──────────────────────────────────────────

/** Full payload the /question page needs. */
export interface QuestionData {
  game: Game
  teams: Team[]
  cell: GameCell
  question: Question
  category: Category
}

/** Full payload the /answer page needs. */
export interface AnswerData {
  game: Game
  teams: Team[]
  cell: GameCell
  question: Question
}

/** Parameters for the resolve_answer RPC. */
export interface ResolveAnswerParams {
  cellId: string
  /** Pass null for "لا أحد" (no team awarded). */
  awardedTeamId: string | null
}

// ─── /results payload ──────────────────────────────────────────────────────

/** Full payload the /results page needs. */
export interface ResultsData {
  game: Game
  teams: Team[]
}
