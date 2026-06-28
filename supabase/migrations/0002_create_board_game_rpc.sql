-- Migration 0002: atomic create_board_game RPC
-- Server-side creation of a board game per /SKILL.md §4 + §5.
-- One round-trip creates the game, 2 teams, 36 game_cells, and sets
-- current_turn_team_id randomly. SECURITY DEFINER so anon (browser
-- client) can call it even when RLS is enabled.
--
-- Also disables RLS on the gameplay tables for MVP — host_session_id
-- is a random UUID in localStorage (no real auth until Phase 2). When
-- Phase 2 adds Supabase auth, re-enable RLS with proper policies.
--
-- Apply via:  supabase db push   OR   paste into the Supabase SQL editor.

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

  -- 3. Create the two teams
  insert into public.teams (game_id, name, color)
  values (v_game_id, p_team1_name, p_team1_color)
  returning id into v_team1_id;

  insert into public.teams (game_id, name, color)
  values (v_game_id, p_team2_name, p_team2_color)
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

-- Allow anon (browser client) and authenticated users to call the function.
grant execute on function public.create_board_game(
  text, jsonb, text, text, text, text
) to anon, authenticated;

-- MVP: no real auth — disable RLS on the gameplay tables. See file header
-- for the Phase 2 plan to re-enable with proper policies.
alter table public.games      disable row level security;
alter table public.teams      disable row level security;
alter table public.game_cells disable row level security;
alter table public.categories disable row level security;
alter table public.questions  disable row level security;
