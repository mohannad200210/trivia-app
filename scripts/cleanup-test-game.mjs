// scripts/cleanup-test-game.mjs
// Run:  node --env-file=.env.local scripts/cleanup-test-game.mjs <gameId>

import { createClient } from '@supabase/supabase-js'

const gameId = process.argv[2]
if (!gameId) {
  console.error('usage: node --env-file=.env.local scripts/cleanup-test-game.mjs <gameId>')
  process.exit(1)
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(url, key)

const { error: cellErr } = await supabase.from('game_cells').delete().eq('game_id', gameId)
if (cellErr) { console.error('delete game_cells failed:', cellErr.message); process.exit(1) }
const { error: teamErr } = await supabase.from('teams').delete().eq('game_id', gameId)
if (teamErr) { console.error('delete teams failed:', teamErr.message); process.exit(1) }
const { error: gameErr } = await supabase.from('games').delete().eq('id', gameId)
if (gameErr) { console.error('delete games failed:', gameErr.message); process.exit(1) }
console.log('deleted', gameId, '(cells, teams, game)')
