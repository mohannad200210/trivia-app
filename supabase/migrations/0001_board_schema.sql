-- Migration 0001: Jeopardy-style 6x6 board-game schema
-- Replaces the old single-question-at-a-time format (see deleted
-- 0001_initial_schema.sql / 0002_add_helpers_used.sql).
-- Matches the data model in /SKILL.md §4 exactly.
--
-- Apply via:  supabase db push   OR   paste into the Supabase SQL editor.

create extension if not exists "pgcrypto";

-- ── categories ──────────────────────────────────────────────────────────────
create table if not exists categories (
  id         uuid primary key default gen_random_uuid(),
  name_ar    text not null,
  name_en    text not null,
  icon_url   text,
  sort_order int default 0
);

-- ── questions ───────────────────────────────────────────────────────────────
-- Open-answer (no multiple-choice "choices"): the host judges whether the
-- team's spoken answer matches answer_text_ar. point_value drives the cell's
-- point cost on the board (200/400/600) — no separate difficulty column.
create table if not exists questions (
  id                uuid primary key default gen_random_uuid(),
  category_id       uuid references categories(id),
  point_value       int check (point_value in (200,400,600)) not null,
  question_text_ar  text not null,
  answer_text_ar    text not null,
  media_url         text,
  is_active         boolean default true
);

-- ── games ────────────────────────────────────────────────────────────────────
-- current_turn_team_id is declared as a plain uuid here; the FK to teams(id)
-- is added by ALTER TABLE below because games <-> teams have a circular
-- reference (teams.game_id also points back to games.id) and Postgres checks
-- FK targets at CREATE TABLE time. The column stays null until both team
-- rows exist; ON DELETE SET NULL handles a team deletion mid-game.
create table if not exists games (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz default now(),
  host_session_id       text not null,
  status                text check (status in ('setup','active','finished')) default 'setup',
  selected_category_ids jsonb not null,                 -- exactly 6 ids
  current_turn_team_id  uuid
);

-- ── teams ────────────────────────────────────────────────────────────────────
-- 2 teams per game (board format is fixed at 2 teams, not 2-6 like before).
create table if not exists teams (
  id      uuid primary key default gen_random_uuid(),
  game_id uuid references games(id),
  name    text not null,
  color   text not null,
  score   int default 0
);

-- games <-> teams circular FK: now that both tables exist, wire up the
-- games -> teams reference that was deferred above.
alter table games
  add constraint games_current_turn_team_id_fkey
  foreign key (current_turn_team_id) references teams(id) on delete set null;

-- ── game_cells ───────────────────────────────────────────────────────────────
-- Exactly 36 rows per game: 6 categories × 3 point values × 2 slots.
-- Populated server-side in one transaction at game creation.
create table if not exists game_cells (
  id                   uuid primary key default gen_random_uuid(),
  game_id              uuid references games(id),
  category_id          uuid references categories(id),
  point_value          int not null,
  slot_index           int check (slot_index in (1,2)) not null,
  question_id          uuid references questions(id),
  is_answered          boolean default false,
  answered_by_team_id  uuid references teams(id),
  unique (game_id, category_id, point_value, slot_index)
);
