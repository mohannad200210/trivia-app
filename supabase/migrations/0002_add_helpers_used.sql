-- Migration 0002: add helper tools (lifelines) to teams
-- SKILL.md §11 — each team gets 3 helpers, usable once each per game.
-- Apply via: supabase db push  OR  paste into the Supabase SQL editor.

alter table teams
  add column helpers_used jsonb not null default '{"remove_two": false, "double_points": false, "skip": false}';
