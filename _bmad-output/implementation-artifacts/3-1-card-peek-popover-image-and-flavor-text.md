# Story 3.1: Card Peek Popover — Image & Flavor Text

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **Pirates CSG fan**,
I want to click a card row to see a popover anchored to that row showing the card image at a larger size and the flavor/description text,
so that I can get a closer look at any card's artwork and read its flavor text without leaving the browse table or losing my place in the list.

## Acceptance Criteria

1. **Given** I am viewing the card browse table
   **When** I click a card row (or a designated click target within the row)
   **Then** a `CardPeek` popover appears anchored near the clicked row
   **And** only one popover is open at a time — clicking a different row dismisses the current popover and opens the new one
   **And** clicking the same row again, pressing Escape, or clicking outside the popover dismisses it

2. **Given** the `CardPeek` popover is open for any card
   **When** the popover renders
   **Then** the card image is displayed at ~240–280px width, loaded from `static/images/cards/{imageFilename}`
   **And** if the card has a `description` (flavor text), it is displayed below the image in italic EB Garamond with a left-border accent
   **And** if the card has `modifiers`, they are displayed when present (FR21)

3. **Given** a card with a missing full-size image
   **When** the popover renders
   **Then** a styled placeholder appears — no broken image icon

4. **Given** the popover is open
   **When** I press Escape or click outside the popover
   **Then** the popover dismisses and focus returns to the card row

5. **Given** a touch device (tablet/mobile)
   **When** I tap a card row
   **Then** the popover opens on tap (no hover dependency) and dismisses on tap-outside or Escape

## Tasks / Subtasks

- [x] Create `CardPeek.svelte` component (AC: 1, 2, 3)
  - [x] Component accepts `card: Card` prop and renders full-size card image via `imageUrl(card)`
  - [x] Image displayed at ~240–280px width with proper aspect ratio
  - [x] Description/flavor text section: italic EB Garamond, left-border accent styling, only rendered when `card.description` is non-empty
  - [x] Modifiers section: render `card.modifiers` key-value pairs when `Object.keys(card.modifiers).length > 0`
  - [x] Image error handling: `onerror` handler shows styled placeholder — no broken image icon
  - [x] Place in `src/lib/components/cards/CardPeek.svelte`

- [x] Add click handler to `CardRow.svelte` (AC: 1)
  - [x] Add `onclick` callback prop to CardRow's Props interface
  - [x] Attach click handler to the outermost row div
  - [x] Add `role="button"`, `tabindex="0"`, `aria-expanded` for a11y
  - [x] Support Enter/Space keypress to trigger click (keyboard nav)

- [x] Implement popover anchoring and positioning in `CardTable.svelte` (AC: 1, 4, 5)
  - [x] Track `peekedCardId` state (string | null) — local to CardTable, not global state
  - [x] Pass `onclick` callback to each CardRow that toggles peek for that card
  - [x] Render CardPeek popover adjacent to the clicked row in the DOM
  - [x] Position popover anchored to the row — inline expansion below the row (Option A)
  - [x] Inline expansion naturally stays within viewport via scroll container
  - [x] Only one popover open at a time — clicking different row swaps target
  - [x] Clicking same row again closes popover (toggle behavior)

- [x] Implement dismiss behaviors (AC: 1, 4)
  - [x] Escape key listener closes popover and returns focus to the card row
  - [x] Click-outside detection closes popover
  - [x] Filter/sort changes close popover (watch `filterState.filteredCards` for changes)
  - [x] Focus management: on close via Escape, focus returns to triggering row

- [x] Touch device support (AC: 5)
  - [x] Tap-to-open works via the same click handler (no hover dependency)
  - [x] Tap-outside dismisses (click-outside handler covers this)
  - [x] Verified no `:hover` styles are required for popover functionality

- [x] Visual styling and animation
  - [x] Subtle entrance animation (~200ms fade/slide)
  - [x] Popover background: dark semi-transparent (bg-neutral-900/95)
  - [x] Border/shadow treatment consistent with the dark theme
  - [x] EB Garamond 500 for description text (already loaded globally)
  - [x] Inline expansion approach handles narrow viewports naturally via scroll container

## Dev Notes

### Architecture & Patterns

- **Svelte 5 runes only**: Use `$state` for `peekedCardId` tracking. No Svelte 4 stores.
- **Callback props**: CardRow must use `onclick?: () => void` callback prop pattern (not `createEventDispatcher`).
- **Component props typed via `$props()`**: All new components follow the `interface Props { ... } let { ... }: Props = $props()` pattern.
- **Image URLs**: Use existing `imageUrl(card)` from `$lib/utils/cardUtils.ts` — returns `${base}/images/cards/{imageFilename}`. Do NOT construct image paths manually.
- **Styling hierarchy**: Tailwind utilities first, DaisyUI second, custom CSS only for game-native elements.
- **No new state modules needed**: `peekedCardId` is local UI state to CardTable, not global. Do not create a `peekState.svelte.ts`.

### Scope Notes — What NOT to Build

This is a **popover**, not the full inline expansion panel originally described in the UX spec as `CardRowExpanded`. The UX spec's `CardRowExpanded` component (two-column layout with full stats grid, stat bar, complete ability text) was designed before VP-1 delivered all those stats inline in the card rows. The epics file explicitly redefines Epic 3 as a lightweight "Card Peek" — image + flavor text + modifiers only.

**Do NOT implement:**
- Full stat grid or StatBar in the popover (already visible in card rows)
- Card identity section (name, set, nationality, rarity — already in rows)
- Ability text in the popover (already visible in card rows)
- Type-specific detail sections (ship stats, crew stats, etc.)
- The `CardRowExpanded` component from the architecture doc's file tree

### Key Data Facts

- **302 of ~5000 cards** have non-empty `description` (flavor text) — most cards will show image only
- **12 cards** have non-empty `modifiers` — object with keys like `limit: true`, `buildBonus: 5`
- **Card images**: Full-res JPGs in `static/images/cards/`, filenames like `PPSM_SS-004.jpg`, `PPCC_041.jpg`, `PPRV_008.jpg`
- **`modifiers` type**: `Record<string, unknown>` — render as key-value pairs with human-readable formatting

### Existing Components to Modify

| File | Change |
|------|--------|
| `src/lib/components/cards/CardRow.svelte` (237 lines) | Add `onclick` callback prop, click handler on outer div, a11y attrs |
| `src/lib/components/cards/CardTable.svelte` (18 lines) | Add `peekedCardId` state, pass onclick to CardRow, render CardPeek conditionally |

### New Components to Create

| File | Purpose |
|------|---------|
| `src/lib/components/cards/CardPeek.svelte` | Popover content: card image + description + modifiers |

### Current CardRow Structure

CardRow has 5 rendering paths (Ship, Treasure, Crew, Fort, Event) — all wrapped in a single outer `<div>` with `style="width: 575px"`, set background class, and `border-b border-neutral-700`. The click handler should be on this outer div.

Current CardRow props (line 14): `card: Card` only — no callbacks.

### Current CardTable Structure (complete, 18 lines)

```svelte
<div class="flex flex-col h-full">
  <div class="overflow-y-auto flex-1">
    <div class="flex flex-col gap-3 p-3">
      {#each filterState.filteredCards as card (card.cardId)}
        <CardRow {card} />
      {/each}
    </div>
  </div>
</div>
```

Popover should render inside the `{#each}` loop, adjacent to the clicked CardRow.

### Popover Positioning Strategy

The CardTable uses `overflow-y-auto` for scrolling. Consider rendering the popover:
- **Option A**: Inline below the row (like an expansion) — simplest, no z-index/positioning complexity, but changes scroll content height
- **Option B**: Absolutely positioned relative to the row — stays above content, needs viewport boundary checks
- **Option C**: Portal/floating element — most flexible but most complex

The AC says "popover anchored near the clicked row" — this is flexible. Start with the simplest approach that looks good. The UX spec's original inline expansion approach (Option A with animation) is the lowest-complexity path and matches the "anchored to row" requirement.

### Testing Standards

- Co-located tests: `src/lib/components/cards/CardPeek.test.ts` (if unit-testable logic exists)
- Vitest for unit tests, Playwright for e2e
- Existing test example: `src/lib/components/cards/CardRow.test.ts`

### Previous Story Intelligence (VP-1)

Key patterns from the most recent story:
- CardRow.svelte is 237 lines with 5 type-specific branches — changes to the outer wrapper affect all types
- `nameFontSize` is a `$derived` reactive value — good pattern reference
- Image error handling pattern: `onerror={() => ...}` on `<img>` tags with placeholder fallback
- Ability boxes use: `font-family: 'EB Garamond'`, 12px/15px, centered, border-2 border-black, 300px wide
- `imageUrl(card)` and `thumbUrl(card)` from `$lib/utils/cardUtils` both use `base` from `$app/paths` — critical for GitHub Pages deployment
- Set background classes: `bg-set-spanish-main`, `bg-set-crimson-coast`, `bg-set-revolution` (mapped via `SET_CLASS` in `$lib/utils/setUtils.ts`)

### Git Intelligence

Recent commits show:
- `1d756b4` feat: cardy rows, metallic corner badges, and fixed scroll layout
- `140bcf7` fix: use base path for jolly-roger image in sandbox
- `7923233` Visual Polish Sprint (VP-1) (#10)

The base path fix (`140bcf7`) is a reminder: **always use `base` from `$app/paths`** for any image or asset URLs. Direct `/images/...` paths break on GitHub Pages.

### Project Structure Notes

- New component goes in `src/lib/components/cards/CardPeek.svelte` — aligns with domain-role organization
- No routing changes needed — popover is within the existing `/` route
- No new state modules — local state in CardTable

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 3] — Epic 3 scope rationale and Story 3.1 AC
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Patterns] — Svelte 5 props, callback props, styling hierarchy
- [Source: _bmad-output/planning-artifacts/architecture.md#Error Handling Patterns] — Missing image placeholder pattern
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#CardRowExpanded] — Original detail panel anatomy (superseded by popover scope)
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Interaction Patterns] — Keyboard nav, focus management, Escape dismiss, aria-expanded
- [Source: _bmad-output/implementation-artifacts/vp-1-visual-polish-sprint.md] — Previous story patterns, CardRow structure, image handling

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — clean implementation with no blocking issues.

### Completion Notes List

- Created `CardPeek.svelte` with card image (260px width), flavor text (italic EB Garamond, amber left-border accent), and modifiers (camelCase-to-Title-Case formatting, boolean Yes/No display)
- Added `onclick`, `isActive` props to `CardRow.svelte` with keyboard nav (Enter/Space), a11y attrs (`role="button"`, `tabindex`, `aria-expanded`) applied conditionally only when onclick is provided
- Rewrote `CardTable.svelte` with inline expansion approach (Option A from Dev Notes) — CardPeek renders below clicked row with 200ms fade/slide animation
- Dismiss behaviors: Escape key returns focus to row, click-outside detection, filter/sort changes auto-close popover
- Touch support inherent — click handlers work for tap, no hover dependency
- Image error handling: styled placeholder with "Image not available" text, no broken image icon
- All 45 tests pass (6 new tests for modifier formatting and data expectations)
- Build succeeds with 0 errors

### Change Log

- 2026-03-11: Implemented Card Peek popover — all 6 tasks complete, all ACs satisfied

### File List

- `src/lib/components/cards/CardPeek.svelte` (new) — Popover content: image + description + modifiers
- `src/lib/components/cards/CardPeek.test.ts` (new) — Unit tests for modifier formatting logic
- `src/lib/components/cards/CardRow.svelte` (modified) — Added onclick/isActive props, keyboard nav, a11y attrs
- `src/lib/components/cards/CardTable.svelte` (modified) — Inline expansion with peekedCardId state, dismiss behaviors, animation
