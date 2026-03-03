# Story VP-1: Pre-Epic 3 Visual Polish Sprint

Status: done

## Story

As a **Pirates CSG fan**,
I want the card catalog to feel like a polished, thematic product — with pirate-appropriate typography, color-coded rarity indicators, a branded site header, and well-structured per-type card rows —
so that browsing the catalog is visually immersive and feels native to the Pirates CSG world.

## Acceptance Criteria

1. **Given** the site header
   **When** the page loads
   **Then** a Jolly Roger PNG logo appears to the left of the title, the title "Pirates of the Spanish Main" renders in Cinzel serif with small-caps, and the subtitle "Card Catalog" appears in gold-tinted Cinzel below the title

2. **Given** the filter sidebar
   **When** the page loads
   **Then** all section labels (Sort, Expansion Set, Card Type, Nationality, Rarity) render in Cinzel uppercase gold (`text-yellow-500/70`), and Sort controls appear inside the sidebar (not in the table header row)

3. **Given** any card row
   **When** the card catalog renders
   **Then** each row is exactly 575px wide with `overflow-hidden`, and a triangular corner badge appears in the top-right corner showing the card number in white/dark text, color-coded by rarity (red=Common, silver=Uncommon/Common Treasure, gold=Rare/Treasure/Limited Edition, black=Super Rare/Super Rare Treasure, orange=Limited Edition)

4. **Given** a card name longer than 22 characters
   **When** the row renders
   **Then** the font size adapts: 26px for ≤22 chars, 22px for 23–29 chars, 18px for 30+ chars — preventing overflow while keeping the name on one line

5. **Given** a Ship card row
   **When** rendered
   **Then** it shows: PointBadge (59×59, absolute top-left), NationalityFlag + name (40px zone), stats pills (masts/cargo/move/cannons in black bg extending behind badge), and an EB Garamond ability box (12px/15px, 300px wide, centered) below stats

6. **Given** a Treasure card row
   **When** rendered
   **Then** it shows: circular 59×59 thumbnail (left), name + 3×N coin grid of treasure values (gold-on-black coins)

7. **Given** a Crew card row
   **When** rendered
   **Then** it shows: PointBadge (absolute top-left), 59×59 rounded-sm thumbnail (absolute at left: 65px), NationalityFlag + name zone (padding-left: 116px), and an EB Garamond ability box below

8. **Given** a Fort card row
   **When** rendered
   **Then** it shows: GoldCostBadge (59×59, shows gold cost + "GOLD" label), NationalityFlag + name zone, inline cannon pill (cannon icon + CannonPip SVGs on black bg), and an EB Garamond ability box below

9. **Given** an Event card row
   **When** rendered
   **Then** it shows: PointBadge (absolute top-left), 59×59 rounded-sm thumbnail (at padding-left: 65px), name (Cinzel, flex-1), and an EB Garamond ability box below

10. **Given** PPSM, PPCC, and PPRV cards
    **When** rows render
    **Then** each set has its own background color (parchment/burgundy/blue respectively), and row separators use `border-neutral-700`

## Tasks / Subtasks

- [x] Site header redesign — AppHeader.svelte (AC: 1)
  - [x] Process jolly-roger-orig.png with Pillow (black bg removal, alpha threshold LOW=40/HIGH=140, sharpen, resize to 148×96px LANCZOS)
  - [x] Add `static/images/jolly-roger.png`
  - [x] Update AppHeader.svelte with Jolly Roger img, h1 Cinzel 2xl bold small-caps, gold subtitle span

- [x] Filter sidebar visual update (AC: 2)
  - [x] Add Sort section to FilterSidebar.svelte with btn-xs buttons (Pts/Name/Type/Set/Nation)
  - [x] Change all section labels to Cinzel uppercase gold (`text-yellow-500/70`)
  - [x] Remove sort header row from CardTable.svelte entirely

- [x] Card corner badge — CardCornerBadge.svelte (AC: 3)
  - [x] Create new component using `clip-path: polygon(100% 0%, 100% 100%, 0% 0%)` for filled triangle
  - [x] Rarity color map: Common=#991b1b, Uncommon/Common Treasure=#9ca3af, Rare/Treasure=#eab308, Super Rare/Super Rare Treasure=#111111, Limited Edition=#ea580c
  - [x] Card number text: `rotate(45deg)` at `top: 12px; right: 5px`, Cinzel 10px
  - [x] Integrate into all card type branches of CardRow.svelte with `overflow-hidden` and `width: 575px`

- [x] Adaptive name font size (AC: 4)
  - [x] Add `nameFontSize` derived: >29 chars→18px, >22 chars→22px, else→26px
  - [x] Replace all hardcoded name font sizes in CardRow.svelte (Ship, Treasure, Crew, Fort, Event)

- [x] Ship card row (AC: 5) — layered design
  - [x] PointBadge absolute top-left (4px,4px), z-index 2
  - [x] Name zone 40px height, padding-left 55px, NationalityFlag + name
  - [x] Stats zone: masts pill extends behind badge (padding-left 59px), cargo, move, cannons on black bg
  - [x] Ability box: border-2 border-black, 300px wide, EB Garamond 12px/15px centered, mt-1 mb-1.5

- [x] Treasure card row (AC: 6)
  - [x] Circular 59×59 thumbnail with rounded-full border-black
  - [x] Coin grid: 3-column grid of 18×18px black rounded-full badges with gold Cinzel numbers
  - [x] Ability box below (same style as ship)

- [x] Crew card row (AC: 7)
  - [x] PointBadge absolute top-left, thumbnail absolute at left: 65px
  - [x] Name zone padding-left 116px (flag overlaps thumbnail right edge)
  - [x] Ability box: mt-[27px] to clear badge/thumbnail bottom

- [x] Fort card row (AC: 8)
  - [x] Create GoldCostBadge.svelte (59×59, dark bg, cost number 3xl, "GOLD" label 8px)
  - [x] GoldCostBadge absolute top-left, name zone padding-left 55px
  - [x] Cannon zone: inline pill (padding-left 59px) with cannon icon + CannonPip SVGs
  - [x] Ability box below

- [x] Event card row (AC: 9)
  - [x] PointBadge absolute top-left, thumbnail at padding-left 65px content row
  - [x] Name flex-1 Cinzel in content row, no flag
  - [x] Ability box below (no mt margin needed, flows naturally)

- [x] Set backgrounds and separators (AC: 10)
  - [x] Set bg classes in app.css: bg-set-spanish-main, bg-set-crimson-coast, bg-set-revolution
  - [x] Row border: `border-neutral-700` (not border-black)
  - [x] PPCC: oklch(56% 0.12 15), PPRV: oklch(48% 0.12 255)

- [x] Data fix: trailing newlines in 3 PPCC ship names, regenerate cards.json

- Review Follow-ups (AI)
  - [x] [AI-Review][HIGH] Fix absolute image path in AppHeader — `src="/images/jolly-roger.png"` breaks on GitHub Pages deployment (BASE_PATH=/PiratesWeb in CI → 404). Import `base` from `$app/paths` and use `src="{base}/images/jolly-roger.png"` to match pattern used everywhere else [`AppHeader.svelte:2`]
  - [~] [AI-Review][MEDIUM] Replace hardcoded "Pirates of the Spanish Main" title — REJECTED: keeping "Pirates of the Spanish Main" as the branded title by user preference
  - [x] [AI-Review][MEDIUM] Remove sandbox-only fonts from global `app.html` — `Pirata One`, `IM Fell English`, and `Cormorant Garamond` are only used in `sandbox/+page.svelte`; loading them for all users adds unnecessary network weight; keep only `Cinzel` and `EB Garamond` [`app.html:8`]
  - [x] [AI-Review][MEDIUM] Eliminate Fort cannon rendering duplication — added `paddingLeft` prop to `CannonDisplay`; Fort branch now uses `<CannonDisplay paddingLeft="59px" />`; removed `CannonPip`, `parseCannonPip`, `TypeBadge`, `StatBar` imports [`CardRow.svelte`]
  - [x] [AI-Review][MEDIUM] Remove `{:else}` dead-code branch — removed unreachable branch, resolved 6 TS errors [`CardRow.svelte`]
  - [x] [AI-Review][LOW] Fix conflicting a11y attrs on Jolly Roger — changed `alt="Jolly Roger"` to `alt=""` (aria-hidden="true" retained) [`AppHeader.svelte`]
  - [x] [AI-Review][LOW] Fix `CardCornerBadge` ARIA — replaced `aria-label` with `aria-hidden="true"` on decorative div [`CardCornerBadge.svelte`]
  - [x] [AI-Review][LOW] Add accessible grouping to Sort buttons — added `id="sort-label"` to `<p>` and `role="group" aria-labelledby="sort-label"` to buttons container [`FilterSidebar.svelte`]

## Dev Notes

### Visual Polish Sprint Context

This is a pre-Epic 3 sprint targeting the sandbox branch `sandbox/visual-polish-sprint`. Work was tracked in `memory/visual-polish-punchlist.md`. All design decisions were iterated in `src/routes/sandbox/+page.svelte` sections 9–15.

### Key Components Modified

- `src/lib/components/layout/AppHeader.svelte` — fully redesigned
- `src/lib/components/cards/CardRow.svelte` — major: all 5 card type branches + corner badge integration
- `src/lib/components/cards/CardCornerBadge.svelte` — NEW
- `src/lib/components/cards/GoldCostBadge.svelte` — NEW
- `src/lib/components/cards/CardTable.svelte` — sort header removed
- `src/lib/components/cards/CannonDisplay.svelte` — py-1.5 height fix
- `src/lib/components/filters/FilterSidebar.svelte` — sort + Cinzel gold labels

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

None.

### Completion Notes List

- Processed jolly-roger-orig.png with Pillow: black bg removal (LOW=40/HIGH=140 alpha thresholds), 2× SHARPEN passes, LANCZOS resize to 148×96px → static/images/jolly-roger.png
- AppHeader.svelte redesigned: Jolly Roger img (aria-hidden=true, opacity-90), h1 Cinzel 2xl bold small-caps, gold subtitle
- FilterSidebar.svelte: added Sort section with reactive btn-xs buttons, all labels changed to Cinzel gold uppercase
- CardTable.svelte: sort header row removed entirely
- CardCornerBadge.svelte created: clip-path triangle, 8-rarity color map, rotated card number text
- CardRow.svelte: all 5 type branches given overflow-hidden + 575px width + CardCornerBadge; nameFontSize derived (26/22/18px); all name spans updated; new Crew and Fort layout designs implemented
- GoldCostBadge.svelte created: 59×59 dark bg badge for fort gold cost
- Data fix: trailing newlines removed from 3 PPCC ship card names in convert.ts, cards.json regenerated

### File List

- `src/lib/components/layout/AppHeader.svelte` — Jolly Roger PNG, Cinzel title, gold subtitle
- `src/lib/components/cards/CardRow.svelte` — all 5 type branches redesigned, corner badge integrated, nameFontSize derived
- `src/lib/components/cards/CardCornerBadge.svelte` — NEW: clip-path triangle rarity badge
- `src/lib/components/cards/GoldCostBadge.svelte` — NEW: 59×59 gold cost badge for forts
- `src/lib/components/cards/CardTable.svelte` — sort header row removed
- `src/lib/components/cards/CannonDisplay.svelte` — py-1.5 height alignment fix
- `src/lib/components/filters/FilterSidebar.svelte` — sort controls added, Cinzel gold labels
- `src/app.css` — bg-set-* background classes for 3 sets
- `src/lib/types/cardTypes.ts` — (minor: EventCard type unchanged, confirmed no `details` property)
- `static/images/jolly-roger.png` — NEW: processed Jolly Roger PNG
- `static/data/cards.json` — trailing newline fix for 3 PPCC ship names
- `scripts/convert.ts` — source fix for trailing newlines
- `src/routes/sandbox/+page.svelte` — sections 9–15 added (design reference only)
- `reference/jolly-roger-orig.png` — NEW: source image
- `reference/jolly-roger.png` — NEW: processed version
- `reference/process_jolly_roger.py` — NEW: Pillow processing script
- `reference/ability-box-1.png` — NEW: design reference
- `reference/card-corner.png` — NEW: design reference
- `reference/treasure-card.jpeg` — NEW: design reference

## Change Log

- Visual polish sprint implementation — sections 9–15 (Date: 2026-03-02)
