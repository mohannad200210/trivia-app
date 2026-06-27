-- Migration 0001: initial schema
-- Matches the data model in SKILL.md §4 exactly.
-- Apply via: supabase db push  OR  paste into the Supabase SQL editor.

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
create table if not exists questions (
  id                uuid primary key default gen_random_uuid(),
  category_id       uuid references categories(id),
  difficulty        text check (difficulty in ('easy','medium','hard')),
  question_text_ar  text not null,
  question_text_en  text,
  choices           jsonb not null,        -- [{id, text_ar, text_en}, ...] exactly 4
  correct_choice_id text not null,
  media_url         text,
  is_active         boolean default true
);

-- ── games ────────────────────────────────────────────────────────────────────
create table if not exists games (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz default now(),
  host_session_id       text not null,    -- anon id from localStorage until auth exists
  status                text check (status in ('setup','active','finished')) default 'setup',
  selected_category_ids jsonb not null,
  difficulty            text,
  is_free_game          boolean default true
);

-- ── teams ────────────────────────────────────────────────────────────────────
create table if not exists teams (
  id      uuid primary key default gen_random_uuid(),
  game_id uuid references games(id),
  name    text not null,
  color   text not null,
  score   int default 0
);

-- ── game_questions ───────────────────────────────────────────────────────────
create table if not exists game_questions (
  id                   uuid primary key default gen_random_uuid(),
  game_id              uuid references games(id),
  question_id          uuid references questions(id),
  order_index          int not null,
  answered_by_team_id  uuid references teams(id)
);
