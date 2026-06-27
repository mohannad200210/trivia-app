---
name: trivia-app-builder
description: Use this skill for ALL work on the group-trivia-game web app (the Seen-Jeem/Mkhmkh-style project). Trigger on any task involving this project's frontend, database schema, game logic, RTL/Arabic UI, question bank, scoring, or paywall logic. Read this file in full before writing or editing any code in this repo.
---

# Trivia App — Project Skill

This file is the single source of truth for how this project is built. Read it
fully before starting work, and re-read it if you're resuming after a break.
Do not reinvent conventions already defined here — follow them exactly so the
codebase stays consistent across sessions.

## 1. What this app is

A web app for hosting **group trivia games at gatherings** (family/friends,
dewaniya-style). One screen (phone, laptop, or projector) displays the game.
A host controls the flow. Players answer out loud — there is no per-player
login during play. Arabic is the primary language, fully RTL; English is a
secondary toggle.

Game loop: pick categories (max 6) → pick difficulty → set up teams → answer
questions one at a time, host taps the team that got it right → running
scoreboard → final results screen.

## 2. Tech stack (do not deviate without asking)

- **Next.js 14, App Router, TypeScript** — strict mode on.
- **Tailwind CSS** for all styling. No CSS modules, no styled-components.
- **Supabase** for Postgres DB + Auth (Auth only added in Phase 2+, not MVP).
- **Vercel** for hosting.
- No state management library (Redux/Zustand) for MVP — React state +
  Context is enough for a single-screen-at-a-time game flow. Only introduce
  one if a specific screen's prop-drilling becomes unmanageable, and ask
  first.

## 3. Folder structure

```
/app
  /(game)
    /page.tsx              -- landing / category picker
    /difficulty/page.tsx
    /teams/page.tsx
    /play/page.tsx          -- main question screen
    /results/page.tsx
  /admin/...                 -- Phase 2+, not built yet
  /api/...                   -- route handlers if needed
/components
  /game/                     -- CategoryCard, QuestionCard, ScoreBoard, etc.
  /ui/                        -- generic buttons, inputs, modals
/lib
  /supabase.ts                -- client init
  /game-logic.ts               -- scoring, free-game-limit check, question selection
  /types.ts
/public
  /sounds/
  /icons/
/supabase
  /migrations/
  /seed.sql
SKILL.md
```

Keep game logic (scoring rules, free-game limit, question selection) in
`/lib`, not scattered inside components. Components should be mostly
presentational.

## 4. Data model (authoritative — match exactly)

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
  difficulty text check (difficulty in ('easy','medium','hard')),
  question_text_ar text not null,
  question_text_en text,
  choices jsonb not null,       -- [{id, text_ar, text_en}, ...] exactly 4
  correct_choice_id text not null,
  media_url text,
  is_active boolean default true
);

games (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  host_session_id text not null,   -- anon id from localStorage until auth exists
  status text check (status in ('setup','active','finished')) default 'setup',
  selected_category_ids jsonb not null,
  difficulty text,
  is_free_game boolean default true
);

teams (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references games(id),
  name text not null,
  color text not null,
  score int default 0
);

game_questions (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references games(id),
  question_id uuid references questions(id),
  order_index int not null,
  answered_by_team_id uuid references teams(id)
);
```

Starter categories (use these names for seed data unless told otherwise):
معلومات عامة (General Knowledge), جغرافيا (Geography), رياضة (Sports),
أفلام ومسلسلات (Movies & TV), تاريخ (History), علوم (Science),
ألعاب (Gaming), فن وموسيقى (Art & Music).

## 5. Game logic rules

- A game session is anonymous until Phase 2 (auth). Identify a host by a
  random UUID stored in `localStorage` as `host_session_id`.
- **Free-game limit**: check `localStorage.getItem('hasPlayedFreeGame')`.
  If true and no wallet/payment system exists yet, redirect to a paywall
  stub screen instead of `/teams`. Isolate this check in
  `lib/game-logic.ts` as `canStartNewGame()` so it's a one-line swap later
  for a real wallet-balance check — never inline this check in components.
- Question selection: random, no repeats within a single game, filtered by
  selected category_ids and difficulty. Pull from Supabase, don't
  client-side filter a full table dump.
- Scoring: host taps a team's name/avatar on the question screen to award
  a point and advance to the next question. No automatic correctness
  detection (players speak answers out loud, like Seen Jeem/Mkhmkh).
- A game is "finished" after all selected questions are used or the host
  taps "End Game" early — either way go to `/results`.

## 6. RTL & Arabic UI rules

- Root layout: `<html lang="ar" dir="rtl">` by default. If an English
  toggle is added, swap `lang`/`dir` accordingly — never hardcode `ltr`
  anywhere in component styles.
- Use Tailwind **logical properties** (`ps-4`, `pe-4`, `ms-2`, `me-2`,
  `text-start`, `text-end`) instead of `pl-`/`pr-`/`ml-`/`mr-`/`text-left`/
  `text-right`, so RTL/LTR both work without duplicate styles.
- Use a proper Arabic web font (e.g. `Tajawal` or `IBM Plex Sans Arabic`
  via `next/font/google`) — never fall back to default system sans for
  Arabic text, it renders poorly.
- Numbers in the UI (scores, counters) should still display in
  Western Arabic numerals (0-9) unless explicitly told otherwise — Gulf
  trivia apps consistently do this.
- **Projector/large-text mode**: question screen text must remain legible
  from across a room. Minimum question text size ~32px on the
  `/play` screen; choice buttons should be large touch/click targets.

### RTL QA Checklist (run after any UI change)
- [ ] Text aligns right by default, flows correctly with mixed Arabic/English
- [ ] Icons that imply direction (arrows, back buttons) are mirrored correctly
- [ ] Modals/toasts slide in from the correct (right) side
- [ ] No leftover `pl-`/`pr-`/`text-left`/`text-right` classes introduced
- [ ] Scrollbars and the team-color indicators don't visually break in RTL

## 7. Visual/brand rules

- Build an original visual identity — do not copy Seen Jeem's or Mkhmkh's
  color schemes, logos, or layouts. Bold colors, big rounded cards, and
  playful category icons are fine as a *genre* convention; specific
  copied assets are not.
- Keep category cards as a grid of large tappable tiles with icon + name,
  visually distinct per category (use a consistent but varied color per
  category, not all one brand color).

## 8. Payments (Phase 2 — do not build until asked)

- Use **MyFatoorah** or **Tap Payments**, not Stripe — Stripe does not
  support KNET (the standard Kuwait debit rail). Payment integration work
  starts only when explicitly requested; for MVP, the paywall screen is a
  visual stub only ("Coming soon").

## 9. General engineering rules

- TypeScript strict; no `any` unless justified with a comment.
- Don't fetch more from Supabase than a screen needs (e.g. don't pull
  every question in the DB to filter client-side — filter in the query).
- Every new screen/component should work correctly with 2 teams and with
  6 teams (the supported range) — test both when changing the team/score UI.
- Don't add a backend framework, ORM, or state library beyond what's
  listed in Section 2 without asking first — this project intentionally
  stays minimal so an agent can hold the whole architecture in mind.
- After finishing a phase of work, briefly state what was built and what
  manual testing you did (e.g. "ran `npm run dev`, clicked through
  category → difficulty → teams → play → results, RTL looked correct").

## 10. What NOT to build yet

Do not build, even if it seems natural to add: user accounts/auth, real
payment processing, an admin dashboard, live multiplayer/network play,
or native mobile wrappers — these are explicitly Phase 2+ and only start
when the user asks for them by name.
## 11. Helper Tools (Lifelines)

Each team gets exactly 3 helper tools, usable once each per game (matches
the genre convention from Gulf trivia games — this is a generic game
mechanic, not copied code/assets from any specific app):

1. **حذف خيارين (Remove two)** — removes 2 of the 4 incorrect choices from
   the current question display, before the team answers out loud.
2. **مضاعفة النقاط (Double points)** — if the team answers this question
   correctly, they get 2 points instead of 1. Must be activated BEFORE the
   host reveals/awards the answer.
3. **تخطي السؤال (Skip)** — skips the current question with no point
   awarded to anyone, advances to the next question, does not count as a
   "miss."

### Data model addition

```sql
-- add to teams table
alter table teams add column helpers_used jsonb default '{"remove_two": false, "double_points": false, "skip": false}';
```

### UI placement

On `/play`, add a small row of 3 icon buttons above each team's entry in
the `ScoreStrip` (or, if space is tight with 6 teams, a "هل تريد استخدام
مساعدة؟" expandable row that appears when a team is selected to answer).
Use the chunky button style from DESIGN.md for these. Once used, a helper
icon greys out and becomes disabled for the rest of the game.

### Logic placement

Put helper-tool state transitions in `lib/game-logic.ts` alongside the
existing scoring functions — e.g. `useHelper(teamId, helperType)`,
`isHelperAvailable(team, helperType)`. Don't inline this logic in
components.

## 12. Main page structure (landing, `/`)

Match this structure (original visuals per DESIGN.md, this is layout/
function only):

1. **Hero section** — full-bleed gradient background, large centered
   app title placeholder + tagline, one big chunky CTA button
   "ابدأ اللعبة 🎮" → leads to category picker.
2. **How it works** — 3-step horizontal strip (icon + short label each):
   "اختار الفئات" (pick categories) → "كوّن فريقك" (form your team) →
   "ابدأ التحدي" (start the challenge).
3. **Category teaser grid** — preview of all 8 categories as tiles (not
   yet selectable here — this is marketing/preview only, real selection
   happens on the next screen). Purely visual, builds anticipation.
4. Simple footer, no need to replicate competitor footer content/links.

## 13. Game dashboard structure (`/play`)

This is the in-game "control panel" the host uses:

1. **Top bar**: question counter ("السؤال ٣ / ١٠"), progress bar, "إنهاء
   اللعبة" button (top-left in RTL).
2. **Center**: question card (white, rounded-3xl per DESIGN.md) with the
   4 colored choice tiles below it.
3. **Helper tools row**: per Section 11 above, shown contextually.
4. **Bottom team strip**: each team as a chunky button (per DESIGN.md)
   showing color + name + score; tapping awards the point and advances.
   "لا أحد" ghost button to skip without scoring.

