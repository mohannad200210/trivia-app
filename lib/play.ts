import { supabase } from './supabase'
import type { AnswerData, Category, GameCell, Question, QuestionData, Team } from './types'

/**
 * play.ts — /question + /answer data fetcher per /SKILL.md §5.
 *
 * Fetches the picked cell, its question, the parent category, the game
 * (for current_turn_team_id), and the 2 teams. One cellId in, everything
 * the gameplay screens need out.
 *
 * Over-fetches slightly: /question doesn't use the teams list, /answer
 * doesn't use the category. The 2 rows of teams and 1 row of category
 * are negligible. Keeping one fetcher means one round-trip and one set
 * of cache invalidation rules for the resolve_answer -> /board cycle.
 */

type PlayData = QuestionData & { /* alias for the shared fetch */ }

interface CellJoin {
  id: string
  game_id: string
  category_id: string
  point_value: 200 | 400 | 600
  slot_index: 1 | 2
  question_id: string
  is_answered: boolean
  answered_by_team_id: string | null
  question: Question | null
  category: Category | null
}

export async function fetchQuestionData(cellId: string): Promise<QuestionData> {
  const data = await fetchPlayData(cellId)

  if (!data.category) {
    throw new Error('Cell has no parent category (data integrity issue)')
  }

  // QuestionData is a strict subset of PlayData.
  return {
    game: data.game,
    teams: data.teams,
    cell: data.cell,
    question: data.question,
    category: data.category,
  }
}

export async function fetchAnswerData(cellId: string): Promise<AnswerData> {
  const data = await fetchPlayData(cellId)
  return {
    game: data.game,
    teams: data.teams,
    cell: data.cell,
    question: data.question,
  }
}

async function fetchPlayData(cellId: string): Promise<PlayData> {
  // 1. Fetch the cell with its question + category inlined.
  const cellRes = await supabase
    .from('game_cells')
    .select(
      'id, game_id, category_id, point_value, slot_index, question_id, is_answered, answered_by_team_id, ' +
        'question:questions!game_cells_question_id_fkey(id, category_id, point_value, question_text_ar, answer_text_ar, media_url, is_active), ' +
        'category:categories!game_cells_category_id_fkey(id, name_ar, name_en, icon_url, sort_order)'
    )
    .eq('id', cellId)
    .single()

  if (cellRes.error) {
    throw new Error(`fetchPlayData: cell lookup failed: ${cellRes.error.message}`)
  }
  if (!cellRes.data) {
    throw new Error('fetchPlayData: cell not found')
  }
  const cellRow = cellRes.data as unknown as CellJoin

  if (!cellRow.question) {
    throw new Error('Cell has no parent question (data integrity issue)')
  }

  // 2. Fetch the game + 2 teams in parallel (depends on cellRow.game_id).
  const [gameRes, teamsRes] = await Promise.all([
    supabase
      .from('games')
      .select('id, created_at, host_session_id, status, selected_category_ids, current_turn_team_id')
      .eq('id', cellRow.game_id)
      .single(),
    supabase
      .from('teams')
      .select('id, game_id, name, color, score, display_order')
      .eq('game_id', cellRow.game_id)
      .order('display_order', { ascending: true, nullsFirst: false }),
  ])

  if (gameRes.error || !gameRes.data) {
    throw new Error(
      `fetchPlayData: game lookup failed: ${gameRes.error?.message ?? 'no row'}`
    )
  }
  if (teamsRes.error) {
    throw new Error(`fetchPlayData: teams lookup failed: ${teamsRes.error.message}`)
  }

  const teams: Team[] = (teamsRes.data ?? []) as Team[]

  const cell: GameCell = {
    id: cellRow.id,
    game_id: cellRow.game_id,
    category_id: cellRow.category_id,
    point_value: cellRow.point_value,
    slot_index: cellRow.slot_index,
    question_id: cellRow.question_id,
    is_answered: cellRow.is_answered,
    answered_by_team_id: cellRow.answered_by_team_id,
  }

  return {
    game: gameRes.data,
    teams,
    cell,
    question: cellRow.question,
    category: cellRow.category as Category,
  }
}
