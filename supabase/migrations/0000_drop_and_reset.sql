-- Migration 0000: one-off destructive reset
-- Drop every table from any prior schema run so 0001_board_schema.sql can
-- create the new board-game schema on a clean slate. Idempotent — safe
-- to re-run (every DROP is IF EXISTS).
--
-- Apply order: run this file FIRST, then 0001_board_schema.sql, then seed.sql.
-- Drop order: deepest dependencies first. CASCADE handles the circular FK
-- between games <-> teams (current_turn_team_id).
-- game_questions is from the old single-question format — included so this
-- script also clears it if it ever made it into the database.

DROP TABLE IF EXISTS game_cells     CASCADE;
DROP TABLE IF EXISTS game_questions CASCADE;
DROP TABLE IF EXISTS teams          CASCADE;
DROP TABLE IF EXISTS games          CASCADE;
DROP TABLE IF EXISTS questions      CASCADE;
DROP TABLE IF EXISTS categories     CASCADE;
