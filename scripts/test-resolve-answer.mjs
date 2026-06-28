// scripts/test-resolve-answer.mjs
// End-to-end DB test: create a game, resolve 4 cells with alternating
// outcomes, print state at each step. Cleans up the test game at the end.
//
// Run with:  node --env-file=.env.local scripts/test-resolve-answer.mjs
//   (Node 20.6+ supports --env-file)

import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(url, key)

function short(id) { return id ? id.slice(0, 8) : 'null' }
function teamName(teams, id) {
  return teams.find(t => t.id === id)?.name ?? '?'
}
function scoreStr(teams) {
  return teams.map(t => `${t.name}=${t.score}`).join(' ')
}

async function main() {
  console.log('--- 1. Fetch 6 categories ---')
  const { data: cats, error: catErr } = await supabase
    .from('categories')
    .select('id, name_en, sort_order')
    .order('sort_order', { ascending: true })
    .limit(6)
  if (catErr) throw catErr
  const categoryIds = cats.map(c => c.id)
  console.log('  picked:', cats.map(c => c.name_en).join(', '))

  console.log('\n--- 2. Create a game (RPC) ---')
  const { data: gameId, error: rpcErr } = await supabase.rpc('create_board_game', {
    p_host_session_id: '00000000-0000-0000-0000-000000000001',
    p_selected_category_ids: categoryIds,
    p_team1_name: 'Alpha',
    p_team1_color: '#3A86FF',
    p_team2_name: 'Bravo',
    p_team2_color: '#E85D04',
  })
  if (rpcErr) throw rpcErr
  console.log('  gameId:', gameId)

  console.log('\n--- 3. Read initial state ---')
  let { data: game } = await supabase.from('games').select('*').eq('id', gameId).single()
  let { data: teams } = await supabase
    .from('teams')
    .select('*')
    .eq('game_id', gameId)
    .order('display_order', { ascending: true })
  let { data: cells } = await supabase
    .from('game_cells')
    .select('*')
    .eq('game_id', gameId)
    .order('point_value', { ascending: true })
    .order('slot_index', { ascending: true })
    .limit(4)
  console.log('  teams:', teams.map(t => `${t.name} color=${t.color} order=${t.display_order}`).join(' | '))
  console.log('  current_turn_team_id:', short(game.current_turn_team_id), '→', teamName(teams, game.current_turn_team_id))
  console.log('  initial scores:', scoreStr(teams))
  console.log('  4 cells to resolve:')
  cells.forEach(c => console.log(`    cell=${short(c.id)} value=${c.point_value} slot=${c.slot_index}`))

  const initialTurn = game.current_turn_team_id
  const alpha = teams.find(t => t.display_order === 1)
  const bravo = teams.find(t => t.display_order === 2)

  const scenarios = [
    { label: 'cycle 1: team Alpha (display_order=1) correct',  awarded: alpha.id,  expectDelta: { Alpha: cells[0].point_value, Bravo: 0 } },
    { label: 'cycle 2: team Bravo (display_order=2) correct',  awarded: bravo.id,  expectDelta: { Alpha: 0, Bravo: cells[1].point_value } },
    { label: 'cycle 3: لا أحد (no team awarded)',               awarded: null,      expectDelta: { Alpha: 0, Bravo: 0 } },
    { label: 'cycle 4: team Alpha (display_order=1) correct',   awarded: alpha.id,  expectDelta: { Alpha: cells[3].point_value, Bravo: 0 } },
  ]

  let pass = 0
  let fail = 0

  for (let i = 0; i < 4; i++) {
    const cell = cells[i]
    const sc = scenarios[i]
    const turnBefore = game.current_turn_team_id
    const teamsBefore = teams.map(t => ({ ...t }))

    console.log(`\n--- ${sc.label} ---`)
    console.log(`  cell=${short(cell.id)} point_value=${cell.point_value}`)
    console.log(`  BEFORE: turn=${teamName(teams, turnBefore)} | scores=${scoreStr(teams)}`)

    const { error: rErr } = await supabase.rpc('resolve_answer', {
      p_cell_id: cell.id,
      p_awarded_team_id: sc.awarded,
    })
    if (rErr) {
      console.log(`  ✗ RPC FAILED: ${rErr.message}`)
      fail++
      continue
    }

    // Re-read state
    const { data: g2 } = await supabase.from('games').select('*').eq('id', gameId).single()
    const { data: t2 } = await supabase.from('teams').select('*').eq('game_id', gameId).order('display_order', { ascending: true })
    const { data: c2 } = await supabase.from('game_cells').select('*').eq('id', cell.id).single()
    game = g2
    teams = t2
    cells[i] = c2

    console.log(`  AFTER:  turn=${teamName(teams, game.current_turn_team_id)} | scores=${scoreStr(teams)}`)
    console.log(`  cell:   is_answered=${c2.is_answered} answered_by_team_id=${short(c2.answered_by_team_id)}`)

    // Verify
    let ok = true
    if (game.current_turn_team_id === turnBefore) {
      console.log(`  ✗ TURN DID NOT FLIP (was ${teamName(teamsBefore, turnBefore)}, still ${teamName(teams, game.current_turn_team_id)})`)
      ok = false
    } else {
      console.log(`  ✓ turn flipped: ${teamName(teamsBefore, turnBefore)} → ${teamName(teams, game.current_turn_team_id)}`)
    }
    if (!c2.is_answered) {
      console.log(`  ✗ CELL NOT MARKED ANSWERED`)
      ok = false
    } else {
      console.log(`  ✓ cell marked is_answered=true`)
    }
    const expectedAwardedId = sc.awarded
    if (c2.answered_by_team_id !== expectedAwardedId) {
      console.log(`  ✗ answered_by_team_id mismatch (expected ${short(expectedAwardedId)}, got ${short(c2.answered_by_team_id)})`)
      ok = false
    } else {
      console.log(`  ✓ answered_by_team_id = ${short(c2.answered_by_team_id)}`)
    }
    for (const t of teams) {
      const before = teamsBefore.find(x => x.id === t.id).score
      const expected = before + sc.expectDelta[t.name]
      if (t.score !== expected) {
        console.log(`  ✗ ${t.name} score: expected ${expected}, got ${t.score}`)
        ok = false
      }
    }
    if (ok) {
      console.log(`  ✓ scores correct`)
      pass++
    } else {
      fail++
    }
  }

  // Verify turn is back to initial after 4 flips
  if (game.current_turn_team_id === initialTurn) {
    console.log(`\n✓ After 4 flips, turn is back to initial (${teamName(teams, game.current_turn_team_id)})`)
    pass++
  } else {
    console.log(`\n✗ After 4 flips, turn is ${teamName(teams, game.current_turn_team_id)}, expected ${teamName(teams, initialTurn)}`)
    fail++
  }

  // Try to re-resolve a cell — should fail
  console.log('\n--- 5. Re-resolve attempt (should fail with "already answered") ---')
  const { error: dupErr } = await supabase.rpc('resolve_answer', {
    p_cell_id: cells[0].id,
    p_awarded_team_id: alpha.id,
  })
  if (dupErr && /already answered/i.test(dupErr.message)) {
    console.log(`  ✓ rejected as expected: "${dupErr.message}"`)
    pass++
  } else {
    console.log(`  ✗ expected rejection, got: ${dupErr?.message ?? 'no error'}`)
    fail++
  }

  // Cleanup — schema has no ON DELETE CASCADE on the FKs, so delete in
  // dependency order: game_cells → teams → games.
  console.log('\n--- 6. Cleanup (delete test game) ---')
  const { error: cellDelErr } = await supabase.from('game_cells').delete().eq('game_id', gameId)
  if (cellDelErr) { console.log(`  ✗ delete game_cells failed: ${cellDelErr.message}`); }
  const { error: teamDelErr } = await supabase.from('teams').delete().eq('game_id', gameId)
  if (teamDelErr) { console.log(`  ✗ delete teams failed: ${teamDelErr.message}`); }
  const { error: gameDelErr } = await supabase.from('games').delete().eq('id', gameId)
  if (gameDelErr) {
    console.log(`  ✗ delete game failed: ${gameDelErr.message}`)
    console.log(`  Manual cleanup: node --env-file=.env.local scripts/cleanup-test-game.mjs ${gameId}`)
  } else {
    console.log(`  ✓ deleted test game ${gameId} (cells, teams, game)`)
  }

  console.log(`\n=== RESULT: ${pass} pass, ${fail} fail ===`)
  process.exit(fail > 0 ? 1 : 0)
}

main().catch((e) => {
  console.error('TEST CRASHED:', e)
  process.exit(2)
})
