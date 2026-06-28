-- Migration 0003: teams.display_order + resolve_answer RPC
--
-- Two changes from the previous turn:
--   1. Add `display_order int` to teams so /board and /answer can render
--      Team 1 / Team 2 in a stable order (not alphabetical fallback).
--      The create_board_game RPC is updated (CREATE OR REPLACE) to set
--      display_order = 1 / 2 for new teams.
--   2. New `resolve_answer(uuid, uuid)` RPC per SKILL.md §5/§6. One
--      round-trip, atomic: optionally add point_value to the awarded
--      team's score, mark the cell is_answered, and ALWAYS flip
--      games.current_turn_team_id to the OTHER team (strict alternation).
--      SECURITY DEFINER so anon can call it.
--
-- Apply via:  supabase db push   OR   paste into the Supabase SQL editor.

-- ── 1. teams.display_order ─────────────────────────────────────────────────
-- Nullable so existing rows (from before this migration) are unaffected.
-- New games via the updated RPC set 1 / 2 explicitly.
alter table public.teams
  add column display_order int;

-- ── 2. Update create_board_game to set display_order ───────────────────────
create or replace function public.create_board_game(
  p_host_session_id       text,
  p_selected_category_ids jsonb,
  p_team1_name            text,
  p_team1_color           text,
  p_team2_name            text,
  p_team2_color           text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_game_id      uuid;
  v_team1_id     uuid;
  v_team2_id     uuid;
  v_current_turn uuid;
  v_cat_id       uuid;
  v_pv           int;
  v_q1           uuid;
  v_q2           uuid;
  v_i            int;
begin
  -- 1. Validate: exactly 6 category ids
  if jsonb_typeof(p_selected_category_ids) <> 'array' then
    raise exception 'selected_category_ids must be a jsonb array';
  end if;
  if jsonb_array_length(p_selected_category_ids) <> 6 then
    raise exception 'selected_category_ids must contain exactly 6 ids (got %)',
      jsonb_array_length(p_selected_category_ids);
  end if;

  -- 2. Create the game (status=active, current_turn_team_id null for now)
  insert into public.games (host_session_id, status, selected_category_ids)
  values (p_host_session_id, 'active', p_selected_category_ids)
  returning id into v_game_id;

  -- 3. Create the two teams with display_order = 1 / 2
  insert into public.teams (game_id, name, color, display_order)
  values (v_game_id, p_team1_name, p_team1_color, 1)
  returning id into v_team1_id;

  insert into public.teams (game_id, name, color, display_order)
  values (v_game_id, p_team2_name, p_team2_color, 2)
  returning id into v_team2_id;

  -- 4. Pick first turn randomly between the two teams, then set on game
  v_current_turn := case when random() < 0.5 then v_team1_id else v_team2_id end;
  update public.games
  set current_turn_team_id = v_current_turn
  where id = v_game_id;

  -- 5. For each of the 6 categories × 3 point values, pick 2 distinct
  --    random active questions and insert 2 game_cells (slot 1, slot 2).
  for v_i in 0..5 loop
    v_cat_id := (p_selected_category_ids ->> v_i)::uuid;

    foreach v_pv in array '{200,400,600}'::int[] loop
      -- 1st random question
      select id into v_q1
      from public.questions
      where category_id = v_cat_id
        and point_value = v_pv
        and is_active = true
      order by random()
      limit 1;

      -- 2nd random question, excluding the 1st
      select id into v_q2
      from public.questions
      where category_id = v_cat_id
        and point_value = v_pv
        and is_active = true
        and id <> v_q1
      order by random()
      limit 1;

      if v_q1 is null or v_q2 is null then
        raise exception 'Not enough active questions for category % point_value % (need 2)',
          v_cat_id, v_pv;
      end if;

      insert into public.game_cells
        (game_id, category_id, point_value, slot_index, question_id)
      values
        (v_game_id, v_cat_id, v_pv, 1, v_q1),
        (v_game_id, v_cat_id, v_pv, 2, v_q2);
    end loop;
  end loop;

  return v_game_id;
end;
$$;

grant execute on function public.create_board_game(
  text, jsonb, text, text, text, text
) to anon, authenticated;

-- ── 3. resolve_answer RPC ──────────────────────────────────────────────────
-- Atomic per SKILL.md §5 + §6:
--   - if p_awarded_team_id is not null, add point_value to that team's score
--   - mark the cell is_answered = true with answered_by_team_id
--   - ALWAYS set games.current_turn_team_id to the OTHER team (regardless
--     of which option was picked, including لا أحد)
--
-- Validation:
--   - cell must exist
--   - cell must not already be answered
--   - if p_awarded_team_id is given, it must be one of the 2 teams in the
--     cell's game
create or replace function public.resolve_answer(
  p_cell_id          uuid,
  p_awarded_team_id  uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_game_id        uuid;
  v_point_value    int;
  v_already        boolean;
  v_current_turn   uuid;
  v_other_team_id  uuid;
begin
  -- 1. Fetch the cell
  select game_id, point_value, is_answered
  into v_game_id, v_point_value, v_already
  from public.game_cells
  where id = p_cell_id;

  if v_game_id is null then
    raise exception 'cell % not found', p_cell_id;
  end if;
  if v_already then
    raise exception 'cell % is already answered', p_cell_id;
  end if;

  -- 2. If a team was awarded the points, add them (and verify the team
  --    belongs to this game)
  if p_awarded_team_id is not null then
    if not exists (
      select 1 from public.teams
      where id = p_awarded_team_id and game_id = v_game_id
    ) then
      raise exception 'team % is not in game %', p_awarded_team_id, v_game_id;
    end if;

    update public.teams
    set score = score + v_point_value
    where id = p_awarded_team_id;
  end if;

  -- 3. Mark the cell as answered (answered_by_team_id is null for لا أحد)
  update public.game_cells
  set is_answered = true,
      answered_by_team_id = p_awarded_team_id
  where id = p_cell_id;

  -- 4. Flip the turn to the OTHER team — strict alternation per SKILL.md §6
  select current_turn_team_id
  into v_current_turn
  from public.games
  where id = v_game_id;

  select id
  into v_other_team_id
  from public.teams
  where game_id = v_game_id
    and id <> v_current_turn
  limit 1;

  if v_other_team_id is null then
    raise exception 'cannot find the other team for game %', v_game_id;
  end if;

  update public.games
  set current_turn_team_id = v_other_team_id
  where id = v_game_id;
end;
$$;

grant execute on function public.resolve_answer(uuid, uuid) to anon, authenticated;
