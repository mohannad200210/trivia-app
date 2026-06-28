// scripts/test-results.mjs
// End-to-end DB test for /results: three scenarios.
//   1. Alpha sweeps all 36 cells → Alpha wins, expected score 14400.
//   2. Every cell resolved with null ("لا أحد") → tie at 0–0.
//   3. End game partway through (10 cells) → Alpha has partial score.
// Also verifies the auto-finish condition (all 36 answered) is reachable.
//
// Run:  node --env-file=.env.local scripts/test-results.mjs

import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(url, key)

function short(id) { return id ? id.slice(0, 8) : 'null' }

async function createGame() {
  const { data: cats, error: catErr } = await supabase
    .from('categories')
    .select('id')
    .order('sort_order', { ascending: true })
    .limit(6)
  if (catErr) throw catErr
  const categoryIds = cats.map(c => c.id)

  const { data: gameId, error: rpcErr } = await supabase.rpc('create_board_game', {
    p_host_session_id: '00000000-0000-0000-0000-000000000002',
    p_selected_category_ids: categoryIds,
    p_team1_name: 'Alpha',
    p_team1_color: '#3A86FF',
    p_team2_name: 'Bravo',
    p_team2_color: '#E85D04',
  })
  if (rpcErr) throw rpcErr
  return gameId
}

async function getTeams(gameId) {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('game_id', gameId)
    .order('display_order', { ascending: true })
  if (error) throw error
  return data
}

async function getCells(gameId) {
  const { data, error } = await supabase
    .from('game_cells')
    .select('*')
    .eq('game_id', gameId)
  if (error) throw error
  return data
}

async function resolveAll(cells, awardedTeamId) {
  for (const cell of cells) {
    const { error } = await supabase.rpc('resolve_answer', {
      p_cell_id: cell.id,
      p_awarded_team_id: awardedTeamId,
    })
    if (error) throw error
  }
}

async function finishGame(gameId) {
  const { error } = await supabase
    .from('games')
    .update({ status: 'finished' })
    .eq('id', gameId)
  if (error) throw error
}

async function fetchResults(gameId) {
  // Mirrors lib/results.ts: game + teams
  const [gameRes, teamsRes] = await Promise.all([
    supabase.from('games').select('*').eq('id', gameId).single(),
    supabase.from('teams').select('*').eq('game_id', gameId).order('display_order'),
  ])
  if (gameRes.error) throw gameRes.error
  if (teamsRes.error) throw teamsRes.error
  return { game: gameRes.data, teams: teamsRes.data }
}

function classifyResults({ teams }) {
  const [t1, t2] = teams
  const isTie = t1.score === t2.score
  const winnerId = isTie ? null : (t1.score > t2.score ? t1.id : t2.id)
  return { isTie, winnerId, team1: t1, team2: t2 }
}

async function cleanupGame(gameId) {
  await supabase.from('game_cells').delete().eq('game_id', gameId)
  await supabase.from('teams').delete().eq('game_id', gameId)
  await supabase.from('games').delete().eq('id', gameId)
}

let pass = 0, fail = 0
function check(label, ok, detail = '') {
  if (ok) { console.log(`  ✓ ${label}${detail ? ' — ' + detail : ''}`); pass++ }
  else { console.log(`  ✗ ${label}${detail ? ' — ' + detail : ''}`); fail++ }
}

async function scenarioSweep() {
  console.log('=== SCENARIO 1: Alpha sweeps all 36 cells ===')
  const gameId = await createGame()
  console.log('  game:', short(gameId))
  const cells = await getCells(gameId)
  const [t1] = await getTeams(gameId)
  console.log('  resolving all 36 cells to Alpha…')
  await resolveAll(cells, t1.id)
  await finishGame(gameId)
  const results = await fetchResults(gameId)
  const { isTie, winnerId, team1, team2 } = classifyResults(results)

  // Per category: 200×2 + 400×2 + 600×2 = 2400. 6 categories × 2400 = 14400.
  const expectedScore = 200*2*6 + 400*2*6 + 600*2*6
  console.log(`  Alpha=${team1.score}  Bravo=${team2.score}  (expected Alpha=${expectedScore}, Bravo=0)`)
  check('status is finished', results.game.status === 'finished')
  check('not a tie', isTie === false)
  check('Alpha is winner', winnerId === team1.id)
  check('Alpha score = 14400', team1.score === expectedScore, `got ${team1.score}`)
  check('Bravo score = 0', team2.score === 0)
  await cleanupGame(gameId)
  console.log('  ✓ cleaned up\n')
}

async function scenarioTie() {
  console.log('=== SCENARIO 2: tie at 0-0 (all "لا أحد") ===')
  const gameId = await createGame()
  console.log('  game:', short(gameId))
  const cells = await getCells(gameId)
  console.log('  resolving all 36 cells to null (لا أحد)…')
  await resolveAll(cells, null)
  await finishGame(gameId)
  const results = await fetchResults(gameId)
  const { isTie, team1, team2 } = classifyResults(results)

  console.log(`  Alpha=${team1.score}  Bravo=${team2.score}`)
  check('status is finished', results.game.status === 'finished')
  check('is a tie', isTie === true)
  check('Alpha score = 0', team1.score === 0)
  check('Bravo score = 0', team2.score === 0)
  await cleanupGame(gameId)
  console.log('  ✓ cleaned up\n')
}

async function scenarioPartial() {
  console.log('=== SCENARIO 3: end game partway through (10 cells to Alpha) ===')
  const gameId = await createGame()
  console.log('  game:', short(gameId))
  // Order cells deterministically so the test is reproducible.
  const cells = (await getCells(gameId))
    .sort((a, b) => a.point_value - b.point_value || a.slot_index - b.slot_index)
  const [t1] = await getTeams(gameId)
  // Resolve the first 10 200-pt cells explicitly.
  const toResolve = cells.filter(c => c.point_value === 200).slice(0, 10)
  const expectedScore = toResolve.reduce((sum, c) => sum + c.point_value, 0) // = 10 * 200
  console.log(`  resolving ${toResolve.length} cells to Alpha (expected Alpha = ${expectedScore})…`)
  await resolveAll(toResolve, t1.id)
  // 26 cells still unanswered — host hits "انتهاء اللعبة"
  await finishGame(gameId)
  const results = await fetchResults(gameId)
  const { isTie, winnerId, team1, team2 } = classifyResults(results)

  console.log(`  Alpha=${team1.score}  Bravo=${team2.score}  (expected Alpha=${expectedScore})`)
  check('status is finished', results.game.status === 'finished')
  check('not a tie', isTie === false)
  check('Alpha is winner', winnerId === team1.id)
  check(`Alpha score = ${expectedScore}`, team1.score === expectedScore, `got ${team1.score}`)
  check('Bravo score = 0', team2.score === 0)
  await cleanupGame(gameId)
  console.log('  ✓ cleaned up\n')
}

async function autoFinishCondition() {
  console.log('=== SCENARIO 4: auto-finish condition (all 36 cells answered) ===')
  const gameId = await createGame()
  const cells = await getCells(gameId)
  const [t1] = await getTeams(gameId)
  await resolveAll(cells, t1.id)
  // Re-fetch the board data shape (same as fetchBoardData) and verify
  // the auto-finish condition is met.
  const cellsAfter = await getCells(gameId)
  const allAnswered = cellsAfter.length === 36 && cellsAfter.every(c => c.is_answered)
  check('36 cells exist', cellsAfter.length === 36, `got ${cellsAfter.length}`)
  check('all 36 are is_answered=true', allAnswered)
  // Also: status is still 'active' here — the /board page would call
  // finishGame when it sees allAnswered on its next re-fetch.
  const { data: g } = await supabase.from('games').select('status').eq('id', gameId).single()
  check('status still active (auto-finish hasn\'t run yet — page would do it)', g.status === 'active')
  await cleanupGame(gameId)
  console.log('  ✓ cleaned up\n')
}

async function main() {
  try {
    await scenarioSweep()
    await scenarioTie()
    await scenarioPartial()
    await autoFinishCondition()
  } catch (e) {
    console.error('TEST CRASHED:', e)
    process.exit(2)
  }
  console.log(`=== RESULT: ${pass} pass, ${fail} fail ===`)
  process.exit(fail > 0 ? 1 : 0)
}

main()
