---
name: trivia-app-builder
description: Use this skill for ALL work on the group-trivia-board-game web app. This SKILL.md REPLACES any earlier version — the game format changed from a single-question-at-a-time flow to a Jeopardy-style 6x6 point board. Trigger on any task involving this project's frontend, database schema, game logic, RTL/Arabic UI, question bank, scoring, or turn logic. Read this file in full before writing or editing any code in this repo.
---

# Trivia Board Game — Project Skill (v2 — supersedes any earlier SKILL.md)

This file is the single source of truth. If an earlier SKILL.md exists in
this repo with a different game format (single question at a time, helper
tools called "remove_two/double_points/skip"), IGNORE it — that was the
wrong format and this file replaces it entirely.

## 1. What this app is

A **Jeopardy-style trivia board game** for 2 teams playing together off one
screen (phone/laptop/projector) at a gathering. Arabic-first, fully RTL.

**Core loop:**
1. Host creates a game: picks exactly 6 categories (from a larger pool),
   names 2 teams.
2. Board screen shows a 6-column grid — one column per chosen category,
   6 cells per column: point values 200, 200, 400, 400, 600, 600 (2 easy/
   2 medium/2 hard per category, by value).
3. It's Team A's turn (shown via turn indicator). They pick any
   unanswered cell.
4. Question screen shows the question + a countdown timer + a
   "الإجابة" (reveal answer) button.
5. Host taps reveal → Answer screen shows the correct answer. Host taps
   which team answered correctly (or "لا أحد" if neither did).
6. Points are added to that team's score, the cell is marked used
   (greyed out, can't be picked again), and **the turn always passes to
   the other team next, regardless of who answered correctly** (strict
   alternation — see Section 6).
7. Game ends when all 36 cells are used, or host ends early. Results
   screen shows the winner.

## 2. Tech stack (unchanged)

- Next.js 14, App Router, TypeScript (strict mode).
- Tailwind CSS only — no CSS modules/styled-components.
- Supabase (Postgres + Auth, Auth added Phase 2+).
- Vercel hosting.
- No state management library — React state + Context is enough.

## 3. Folder structure

```
/app
  /page.tsx                  -- landing
  /create-game/page.tsx       -- category + team setup
  /board/page.tsx              -- the 6x6 score board (page 3)
  /question/page.tsx            -- question + timer (page 4)
  /answer/page.tsx                -- reveal + award (page 5)
  /results/page.tsx
  /admin/...                       -- Phase 2+, not built yet
/components
  /game/   -- BoardGrid, BoardCell, QuestionPanel, TimerControl, TeamScoreBar, AnswerReveal
  /ui/     -- generic buttons, inputs, modals
/lib
  /supabase.ts
  /game-logic.ts   -- turn logic, scoring, cell-selection rules
  /types.ts
/public
  /sounds/
/supabase
  /migrations/
  /seed.sql
SKILL.md
DESIGN.md
```

## 4. Data model (authoritative — replaces any earlier schema)

```sql
categories (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null,
  icon_url text,
  sort_order int default 0
);

questions (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id),
  point_value int check (point_value in (200,400,600)) not null,
  question_text_ar text not null,
  answer_text_ar text not null,
  media_url text,            -- optional image, per screenshot reference
  is_active boolean default true
);
-- NOTE: no multiple-choice "choices" field — this format is open-answer,
-- judged by the host, not tap-to-select. Pool needs >=2 active questions
-- per (category, point_value) so the seed/board-build step can pick 2
-- distinct ones per cell.

games (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  host_session_id text not null,
  status text check (status in ('setup','active','finished')) default 'setup',
  selected_category_ids jsonb not null,  -- exactly 6 ids
  current_turn_team_id uuid              -- references teams(id), nullable until teams exist
);

teams (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references games(id),
  name text not null,
  color text not null,
  score int default 0
);

game_cells (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references games(id),
  category_id uuid references categories(id),
  point_value int not null,
  slot_index int check (slot_index in (1,2)) not null,  -- which of the 2 cells at this value
  question_id uuid references questions(id),
  is_answered boolean default false,
  answered_by_team_id uuid references teams(id)
);
-- exactly 36 rows per game: 6 categories x 3 values x 2 slots
```

At game creation, for each of the 6 chosen categories and each point value
(200/400/600), randomly select 2 distinct active questions from the pool
and insert 2 `game_cells` rows. This is how the board gets populated —
do this server-side/in one transaction when the game is created, not
lazily per click.

## 5. Screen-by-screen behavior

### `/` — Landing
Hero with gradient background (DESIGN.md light theme), login link, single
clear CTA → `/create-game`. Keep this simple — do not add extra game-mode
tiles or sub-products; that's marketing surface area we don't need yet.

### `/create-game`
- Category grid: user must select **exactly 6** of the available
  categories (disable further selection once 6 are picked, show a counter
  "3/6").
- Two text inputs for team names (+ optional color picker, reuse the
  team-color swatches pattern from before).
- "ابدأ اللعبة" button: creates the `games` row, the 2 `teams` rows, the
  36 `game_cells` rows (per Section 4), sets `current_turn_team_id` to a
  RANDOMLY chosen one of the 2 teams (see Section 6), then routes to
  `/board`.

### `/board` (page 3)
- 6-column grid, header row = category names, then 6 point-value cells
  per column (200/200/400/400/600/600). Used cells are visually disabled
  (greyed, not clickable).
- Turn indicator showing which team picks next (highlight that team in
  the score bar — matches reference screenshot).
- Score bar for both teams, always visible.
- Tapping any unanswered cell → store which `game_cells.id` was picked
  (e.g. in URL param or context) → route to `/question`.
- "انتهاء اللعبة" (end game early) button → `/results`.

### `/question` (page 4)
- Shows `questions.question_text_ar` (+ media_url image if present) for
  the selected cell.
- Countdown timer with pause/reset controls (default 30 seconds — this is
  a default, adjust if you want it shorter/longer).
- "الإجابة" button → `/answer`. Does NOT auto-advance when the timer hits
  zero in MVP — host controls pacing; timer is informational. (Flag this
  to me if you want auto-advance later.)

### `/answer` (page 5)
- Shows `questions.answer_text_ar`.
- Two large buttons: one per team, plus a "لا أحد" (neither) option.
- Tapping a team: updates that team's `score` (+point_value), marks the
  `game_cells` row `is_answered = true` and `answered_by_team_id`.
- Tapping "لا أحد": marks the cell answered with no team credited, no
  score change.
- **Either way**, once resolved, `games.current_turn_team_id` is set to
  the OTHER team (strict alternation — see Section 6), then routes back
  to `/board`.

### `/results`
Final scores, winner highlighted, "لعبة جديدة" → `/create-game`.

## 6. Turn logic (locked-in rule — confirmed with the user, do not deviate)

- **Game start**: `current_turn_team_id` is set RANDOMLY to one of the 2
  teams when the game is created (e.g. `Math.random() < 0.5`).
- **After every question is resolved** (regardless of who answered
  correctly, or if neither did — "لا أحد"), the turn ALWAYS passes to
  the OTHER team. This is strict alternation, not "winner picks next."
  - Team A picks a question → answer resolved (any outcome) → it is now
    Team B's turn to pick the next question, period.
- This is the only turn rule for MVP. Do not add "steal" mechanics,
  double-jeopardy, or any other variant without it being explicitly
  requested.

## 7. Helper tools (Phase 2 — cosmetic only for now, do not build in MVP)

Reference screenshots show 3 helper icons per team. Defer these until
core gameplay (Sections 4–6) is fully working and tested. When built,
these are COSMETIC/engagement features, not scoring-altering mechanics
(open question to refine later):
1. **مبادلة الدور** (swap turn) — pass your turn to the other team
   without picking a question.
2. **اتصال بصديق** (phone a friend) — cosmetic only; no real telephony
   integration. A short "جاري الاتصال..." overlay, then dismiss.
3. **تصويت الجماهير** (audience vote) — cosmetic only; no real polling
   infrastructure in MVP.
Each usable once per team per game. Do not build any of this until asked.

## 8. RTL & Arabic UI rules (unchanged from before)

- Root layout `<html lang="ar" dir="rtl">`.
- Tailwind logical properties only (`ps-`, `pe-`, `ms-`, `me-`,
  `text-start`, `text-end`) — never `pl-/pr-/ml-/mr-/text-left/text-right`.
- Arabic font via `next/font/google` (Tajawal or IBM Plex Sans Arabic).
- Western Arabic numerals (0-9) for scores/points/timer.

## 9. Visual theme — TWO distinct themes (see DESIGN.md for exact tokens)

This format uses **two different visual themes**, not one:
- **Marketing theme** (landing, create-game): light/warm gradient
  background — reuse the existing DESIGN.md gradient tokens.
- **Gameplay theme** (board, question, answer, results): **dark**
  background (charcoal/near-black) with orange/amber accent buttons and
  pill-shaped category headers — per reference screenshots. See
  DESIGN.md Section "Gameplay (dark) theme" for exact values.
Do not apply the gradient background to gameplay screens — they're dark.

## 10. General engineering rules (unchanged)

- TypeScript strict, no unjustified `any`.
- Don't over-fetch from Supabase — filter in the query.
- Test every screen with the actual 2-team format (this format is fixed
  at 2 teams now, not 2-6 — simpler than before, don't rebuild
  variable-team support unless asked).
- State what you tested after each phase of work.

## 11. What NOT to build yet

User accounts/auth, real payments, admin dashboard, live multiplayer,
native mobile, and the Phase 2 helper tools (Section 7) — all explicitly
deferred. Build the core board-game loop (Sections 4–6) first, fully
working and tested, before anything else.