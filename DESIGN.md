# DESIGN.md — Visual Design Tokens

Concrete, locked-in design decisions. Use these exact values everywhere —
do not introduce ad-hoc colors, radii, or spacing not listed here.
This is an ORIGINAL palette/look — not copied from any competitor's assets,
logo, or code, in the same warm "game show" genre.

## Color palette

Primary gradient (used as page background on every screen):
```
--gradient-from: #FB6B2C   /* warm orange */
--gradient-to:   #C61E45   /* deep crimson */
direction: 135deg (top-left to bottom-right)
Tailwind: bg-gradient-to-br from-[#FB6B2C] to-[#C61E45]
```

Surface colors (cards/tiles sit ON TOP of the gradient, so they need to be
opaque, not transparent):
```
--surface-card: #FFFFFF       /* question cards, team setup cards */
--surface-card-muted: #FFF4ED /* subtle cream for secondary panels */
```

Category tile colors (assign one per category, rotate if more categories added):
```
1. #2D6A4F  (forest green)   — on white text: use this as bg, text #FFFFFF
2. #1B4965  (deep teal-blue)
3. #7B2D8E  (violet)
4. #B5179E  (magenta)
5. #E85D04  (amber-orange)
6. #3A86FF  (sky blue)
7. #6A994E  (olive green)
8. #9D0208  (brick red)
```
Each tile: solid color background, white text, white icon (flat, no gradient
on the tile itself — gradient is reserved for the page background only).

Choice tiles on /play (أ/ب/ج/د), rotate these 4 always in this order:
```
أ: #3A86FF (blue)
ب: #E85D04 (amber)
ج: #2D6A4F (green)
د: #B5179E (magenta)
```

Text on colored backgrounds: always white (#FFFFFF) — every color above is
dark enough at full saturation for white text to pass contrast.

## Typography

Font: keep existing Tajawal/IBM Plex Sans Arabic via next/font/google.

```
h1 (landing hero title):     text-5xl sm:text-6xl font-extrabold text-white
h2 (screen titles):          text-3xl sm:text-4xl font-bold text-white
h3 (card/section titles):    text-xl font-bold
body:                        text-base font-medium
question text (/play):       text-4xl sm:text-5xl font-extrabold (dark text
                              on white card, per existing SKILL.md projector rule)
button label:                text-lg font-bold
score number:                text-2xl font-extrabold
```

## Shape & elevation

```
--radius-card: rounded-3xl     /* 24px — hero cards, question card */
--radius-tile: rounded-2xl     /* 16px — category tiles, choice tiles */
--radius-pill: rounded-full    /* buttons */
```

"Game show" chunky button style (the signature interactive feel):
```
Default:  rounded-full bg-{color} shadow-[0_6px_0_0_rgba(0,0,0,0.25)]
          translate-y-0 transition-all duration-100
Active (on press): translate-y-[6px] shadow-[0_0px_0_0_rgba(0,0,0,0.25)]
```
This makes every primary button look like a chunky 3D arcade button that
"presses flat" on tap — apply to: main CTA, category tile tap state,
team-score-award buttons, helper tool buttons.

Category/choice tiles (not buttons, but tappable): use a lighter version —
`hover:scale-[1.03] active:scale-[0.97] transition-transform duration-150`
plus `shadow-lg` (regular Tailwind shadow, not the chunky offset — offset
shadow is reserved for round buttons only, to keep one visual language per
shape).

## Layout spacing

```
Screen padding:        px-4 sm:px-8 py-6
Card internal padding: p-6 sm:p-8
Grid gaps:             gap-4 sm:gap-6
Section spacing:       space-y-8
```

## Animation

```
Tile/button transitions: duration-150, ease-out
Score award pulse:       scale up 1.1 then back to 1, duration-300
Page transitions:        none needed for MVP (keep simple)
```

# DESIGN.md ADDENDUM — Gameplay (Dark) Theme

(Append this as a new section to your existing DESIGN.md. Keep the
existing gradient/color tokens — those still apply to the LIGHT marketing
theme: `/` and `/create-game`. This section defines the separate DARK
theme used on `/board`, `/question`, `/answer`, `/results`.)

## Gameplay (dark) theme

Per the reference screenshots, gameplay screens use a dark UI, not the
warm gradient — distinct visual mode for "we're playing now" vs.
"we're setting up / browsing."

```
--game-bg:           #1A1A1E   /* near-black background */
--game-surface:      #2A2A30   /* cell backgrounds, panels */
--game-accent:       #FF7A1A   /* orange — primary buttons, turn pill */
--game-accent-muted: #4A4A52   /* disabled/used cell background */
--game-text:         #FFFFFF
--game-text-muted:   #9A9AA2   /* secondary labels */
```

### Board cells (`/board`)

- Unanswered cell: `bg-[--game-surface]` with point value in large bold
  white text, `rounded-2xl`.
- Used/answered cell: `bg-[--game-accent-muted]`, lowered opacity
  (`opacity-40`), not clickable, point value still visible but dimmed.
- Category header pill (top of each column): `bg-[--game-accent]
  rounded-full px-4 py-1 text-sm font-bold text-white` — matches the
  amber pill style in the reference screenshots.

### Turn indicator

Active team's name shown in a solid `bg-[--game-accent] rounded-full`
pill in the top bar. Inactive team shown muted/outlined, not filled.

### Question / Answer screens

- Question text: `text-3xl sm:text-4xl font-bold text-white` on the dark
  background — still legible from across a room (projector rule still
  applies, just inverted to light-text-on-dark instead of dark-text-on-
  white-card).
- Timer: large monospace-style numerals, `text-2xl font-bold`, with
  simple pause/reset icon buttons — no need for fancy animation.
- "الإجابة" reveal button: `bg-green-600 rounded-full` chunky button
  (reuse the chunky offset-shadow style from the light theme's button
  spec, just in green for this one b/c it's a positive/confirm action).
- Answer screen team-award buttons: large, one per team, in that team's
  assigned color, `rounded-2xl`, full-width on mobile.

### Top bar (all gameplay screens)

Dark `bg-[--game-bg]` bar with: exit button (start), back-to-board
button, end-game button, turn indicator (end), all in a single row —
matches reference layout. Keep these icon+label combos simple; exact
icon choice is up to you, just keep it minimal (don't need the "VAR"
icon or extra decorative elements from the reference — that's their
specific flourish, skip it).