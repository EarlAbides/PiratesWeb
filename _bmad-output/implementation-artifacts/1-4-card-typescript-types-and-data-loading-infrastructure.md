# Story 1.4: Card TypeScript Types and Data Loading Infrastructure

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **developer**,
I want the TypeScript discriminated union types for all card types (`Card`, `ShipCard`, `CrewCard`, etc.), a `cardData.svelte.ts` state module, and a `+page.ts` load function that fetches `cards.json` and exposes it to the page,
so that all UI components in subsequent epics have a type-safe, reactive, globally accessible card data source that follows the architecture's Svelte 5 runes and SvelteKit load() patterns.

## Acceptance Criteria

1. **Given** `src/lib/types/cardTypes.ts` is created
   **When** I write `if (card.type === 'Ship') { card.details.masts }`
   **Then** TypeScript narrows correctly with no cast needed
   **And** `Treasure` and `Event` cards have no `details` property in their type

2. **Given** `src/lib/state/cardData.svelte.ts` is created
   **When** a component imports and accesses the card array
   **Then** it uses `$state` runes — no `writable` or `readable` Svelte 4 stores exist anywhere
   **And** a `cardById` Map is available for O(1) lookups by `cardId`

3. **Given** `src/routes/+page.ts` contains the `load()` function
   **When** the page loads in the browser
   **Then** `cards.json` is fetched once via SvelteKit's `load()` and the array is passed to `+page.svelte` as a prop
   **And** no component fetches `cards.json` inside `onMount` or any lifecycle function

4. **Given** `src/routes/+error.svelte` exists
   **When** `cards.json` fails to load (simulated)
   **Then** SvelteKit's error boundary renders the error page instead of a blank or broken page

5. **Given** `scripts/convert.ts` is updated and re-run
   **When** I inspect the regenerated `static/data/cards.json`
   **Then** no card entry contains a `tournamentStatus` field
   **And** total card count remains 550 (no data loss beyond the removed field)

## Tasks / Subtasks

- [x] Update `scripts/convert.ts` to omit `tournamentStatus` (AC: 5)
  - [x] Remove `tournamentStatus: card.TournamentStatus,` from the `base` object (line 62 of `scripts/convert.ts`)
  - [x] Re-run `npx tsx scripts/convert.ts` to regenerate `static/data/cards.json`
  - [x] Verify: no `tournamentStatus` key in any card entry in the new `static/data/cards.json`
  - [x] Confirm total card count still 550

- [x] Create `src/lib/types/cardTypes.ts` with discriminated union types (AC: 1)
  - [x] Define `CardSet`, `CardType`, `Rarity`, `Nationality` string literal union types (no `TournamentStatus` — excluded from data model)
  - [x] Define `BaseCard` interface with all shared fields (cardId, cardSet, cardNumber, name, type, rarity, nationality, pointValue, imageFilename, ability, description, modifiers)
  - [x] Define `ShipDetails`, `CrewDetails`, `FortDetails` interfaces matching actual JSON schema
  - [x] Define `ShipCard`, `CrewCard`, `FortCard`, `TreasureCard`, `EventCard` extending `BaseCard`
  - [x] Export `Card` as discriminated union: `ShipCard | CrewCard | TreasureCard | FortCard | EventCard`
  - [x] Verify narrowing: `if (card.type === 'Ship') { card.details.masts }` compiles without cast
  - [x] Verify `TreasureCard` and `EventCard` have no `details` property

- [x] Create `src/lib/utils/cardUtils.ts` with URL helpers (AC: 1, 3)
  - [x] Implement `thumbUrl(card: Card): string` — replaces `.jpg` with `.webp`, prepends `/images/thumbs/`
  - [x] Implement `imageUrl(card: Card): string` — prepends `/images/cards/` to `imageFilename`
  - [x] Implement `formatMove(baseMove: string): string` — returns move notation as-is (e.g., `"S+L"`)
  - [x] Create co-located `src/lib/utils/cardUtils.test.ts` with unit tests for all three helpers

- [x] Create `src/lib/state/cardData.svelte.ts` with Svelte 5 runes (AC: 2)
  - [x] Use `$state()` rune for the cards array (initialized empty, populated from load())
  - [x] Use `$derived()` for `cardById` Map computed from the cards array (O(1) lookup by `cardId`)
  - [x] Export `setCards(cards: Card[]): void` function to populate state from the load() result
  - [x] Export `cardData` object (or named exports) for component consumption
  - [x] Confirm: zero `writable`, `readable`, `derived` store imports anywhere in the module

- [x] Create `src/routes/+page.ts` load function (AC: 3)
  - [x] Export `load()` async function that fetches `/data/cards.json` via the provided `fetch`
  - [x] Parse response as `Card[]` and return `{ cards }` typed object
  - [x] Use SvelteKit's typed `LoadEvent` for the `fetch` parameter — no bare global `fetch`
  - [x] Handle fetch failure by throwing a SvelteKit `error()` with status 500 and descriptive message

- [x] Update `src/routes/+page.svelte` to consume load data (AC: 3)
  - [x] Add `let { data } = $props()` to receive the `cards` array from `+page.ts`
  - [x] Call `setCards(data.cards)` to populate `cardData.svelte.ts` state
  - [x] Replace placeholder content with a minimal confirmation (e.g., "Loaded N cards")
  - [x] Confirm: no `fetch()`, no `onMount`, no `import.meta.glob` for card data in this file

- [x] Verify `src/routes/+error.svelte` handles load failure (AC: 4)
  - [x] The existing `+error.svelte` (from Story 1.1) already handles SvelteKit errors — verify it renders correctly
  - [x] No new file needed; confirm existing implementation displays status + message

- [x] Run full validation (AC: all)
  - [x] `npm run check` — svelte-check reports zero TypeScript errors
  - [x] `npm run test:unit` — all unit tests pass (cardUtils.test.ts)
  - [x] `npm run build` — static build succeeds with no errors
  - [x] Manual verify: dev server loads page and console shows card count

## Dev Notes

### Tournament Status: Intentionally Excluded

`tournamentStatus` is present in the source XML (`card.TournamentStatus`) but is **deliberately excluded** from the data model. The field has only one value in the dataset (`"Active"`) and adds no filtering or display value. This story's first task is to remove it from `convert.ts` and regenerate `cards.json`. The `TournamentStatus` type is not defined in `cardTypes.ts`. No component, filter, or display in any epic references it.

[Source: epics.md, architecture.md, prd.md — updated to reflect this exclusion]

### Critical: Actual JSON Schema vs. Architecture Spec

The architecture document (`architecture.md#Gap Analysis`) documented a minor gap regarding `crewSlots`. **Story 1.3 confirmed: `crewSlots` is absent from the actual `static/data/cards.json`** — it does not exist in the source XML. Do NOT include `crewSlots` in `ShipDetails`.

**Actual `ShipDetails` from inspecting `static/data/cards.json`:**
```typescript
interface ShipDetails {
  masts: number;
  cargo: number;
  baseMove: string;      // e.g., "L", "S+L", "S+S+L"
  cannons: string[];     // e.g., ["3S", "3L", "3S"] — no crewSlots
}
```

**Actual `FortDetails` from JSON (architecture only mentioned `cannons`):**
```typescript
interface FortDetails {
  cannons: string[];     // e.g., ["3L","3L","3L","3L"]
  goldCost: number;      // e.g., 3 — present in actual data!
}
```

**Actual `CrewDetails`:**
```typescript
interface CrewDetails {
  buildBonus: number;
  costReduction: number;
  cargoBonus: number;
  limitCards: string[];  // array of cardId strings (e.g., ["7909"]) — can be empty
}
```

**Note on `modifiers`:** In the current dataset, all `modifiers` values are `{}` (empty object). Type it as `Record<string, unknown>` to be future-safe without constraining it.

### Actual Card Data Facts (from `static/data/cards.json`)

| Property | Values |
|---|---|
| Total cards | 550 |
| `type` | `'Ship' \| 'Crew' \| 'Treasure' \| 'Fort' \| 'Event'` |
| `cardSet` | `'PPSM' \| 'PPCC' \| 'PPRV' \| 'PPSMU'` |
| `rarity` | `'Common' \| 'Uncommon' \| 'Rare' \| 'Super Rare' \| 'Limited Edition' \| 'Common Treasure' \| 'Treasure' \| 'Super Rare Treasure'` |
| `nationality` | `'English' \| 'Spanish' \| 'Pirates' \| 'French' \| 'American' \| 'Barbary'` |

**Important:** `PPSMU` (Pirates of the Spanish Main Unlimited) exists in the data as a 4th set — not mentioned in the architecture. Include it in the `CardSet` union type.

### Exact TypeScript Card Types to Implement

Based on architecture.md and the actual JSON schema:

```typescript
// src/lib/types/cardTypes.ts

export type CardSet = 'PPSM' | 'PPCC' | 'PPRV' | 'PPSMU';

export type CardType = 'Ship' | 'Crew' | 'Treasure' | 'Fort' | 'Event';

export type Rarity =
  | 'Common'
  | 'Uncommon'
  | 'Rare'
  | 'Super Rare'
  | 'Limited Edition'
  | 'Common Treasure'
  | 'Treasure'
  | 'Super Rare Treasure';

export type Nationality = 'English' | 'Spanish' | 'Pirates' | 'French' | 'American' | 'Barbary';

export interface ShipDetails {
  masts: number;
  cargo: number;
  baseMove: string;
  cannons: string[];
  // NOTE: crewSlots intentionally omitted — absent from source XML and cards.json
}

export interface CrewDetails {
  buildBonus: number;
  costReduction: number;
  cargoBonus: number;
  limitCards: string[];
}

export interface FortDetails {
  cannons: string[];
  goldCost: number;
}

export interface BaseCard {
  cardId: string;
  cardSet: CardSet;
  cardNumber: string;
  name: string;
  type: CardType;
  rarity: Rarity;
  nationality: Nationality;
  pointValue: number;
  imageFilename: string;
  ability: string;
  description: string;
  modifiers: Record<string, unknown>;
}

export interface ShipCard extends BaseCard {
  type: 'Ship';
  details: ShipDetails;
}

export interface CrewCard extends BaseCard {
  type: 'Crew';
  details: CrewDetails;
}

export interface TreasureCard extends BaseCard {
  type: 'Treasure';
  // no details property
}

export interface FortCard extends BaseCard {
  type: 'Fort';
  details: FortDetails;
}

export interface EventCard extends BaseCard {
  type: 'Event';
  // no details property
}

export type Card = ShipCard | CrewCard | TreasureCard | FortCard | EventCard;
```

### cardData.svelte.ts Pattern (Svelte 5 Runes)

Architecture mandates: global state in reactive `.svelte.ts` modules, `$state` runes only, no Svelte 4 stores.

```typescript
// src/lib/state/cardData.svelte.ts
import type { Card } from '$lib/types/cardTypes';

let cards = $state<Card[]>([]);

const cardById = $derived(
  new Map(cards.map((c) => [c.cardId, c]))
);

export function setCards(newCards: Card[]) {
  cards = newCards;
}

export { cards, cardById };
```

**Key pattern notes:**
- `$state` and `$derived` are Svelte 5 runes — they work at module level in `.svelte.ts` files
- The module is NOT a class — it uses module-level rune variables
- `setCards()` is the single write entry point, called from `+page.svelte` after `load()`
- `cardById` is a `$derived` Map — updates automatically when `cards` changes
- Components import directly: `import { cards, cardById } from '$lib/state/cardData.svelte'`

### +page.ts Load Function Pattern

Architecture AR8: "Card data loaded in SvelteKit `+page.ts` `load()` functions — never fetched inside components."

```typescript
// src/routes/+page.ts
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Card } from '$lib/types/cardTypes';

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch('/data/cards.json');
  if (!res.ok) {
    throw error(500, 'Failed to load card data');
  }
  const cards: Card[] = await res.json();
  return { cards };
};
```

**Important:** Use the `fetch` provided by SvelteKit's `LoadEvent` (parameter destructuring `{ fetch }`), NOT the global `fetch`. SvelteKit's fetch is enhanced for SSR-safety and static prerendering.

**Type imports:** `PageLoad` is auto-generated by `svelte-kit sync` into `.svelte-kit/types/src/routes/$types.d.ts`. Run `npm run check` (which calls `svelte-kit sync`) to generate if it doesn't exist.

### +page.svelte Update Pattern

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';
  import { setCards } from '$lib/state/cardData.svelte';

  let { data }: { data: PageData } = $props();

  // Populate state from load() result
  setCards(data.cards);
</script>

<p>Loaded {data.cards.length} cards</p>
```

The minimal content ("Loaded N cards") will be replaced by the full card browser UI in Epic 2 stories.

### cardUtils.ts Helpers

From Story 1.3 notes: thumbnail URL is derived by replacing `.jpg` with `.webp` and prepending `/images/thumbs/`.

```typescript
// src/lib/utils/cardUtils.ts
import type { Card } from '$lib/types/cardTypes';

export function thumbUrl(card: Card): string {
  const webpName = card.imageFilename.replace(/\.jpg$/i, '.webp');
  return `/images/thumbs/${webpName}`;
}

export function imageUrl(card: Card): string {
  return `/images/cards/${card.imageFilename}`;
}

export function formatMove(baseMove: string): string {
  return baseMove; // e.g., "S+L", "L", "S+S+L" — display as-is
}
```

**Unit tests for `cardUtils.test.ts`:**
- `thumbUrl`: PPSM card → `/images/thumbs/PPSM_EC-001.webp`
- `thumbUrl`: PPCC card with underscore → `/images/thumbs/PPCC_046_2.webp`
- `imageUrl`: returns `/images/cards/PPSM_EC-001.jpg`
- `formatMove`: returns input string unchanged

### Project Structure Notes

#### Files to Create

```
src/
  lib/
    types/
      cardTypes.ts          ← CREATE (discriminated union types)
    state/
      cardData.svelte.ts    ← CREATE (Svelte 5 runes state module)
    utils/
      cardUtils.ts          ← CREATE (URL helpers)
      cardUtils.test.ts     ← CREATE (co-located unit tests)
  routes/
    +page.ts                ← CREATE (load function — does not exist yet)
    +page.svelte            ← MODIFY (add $props(), setCards call)
```

#### Files Already Existing (do NOT recreate)

```
src/routes/+error.svelte    ← EXISTS from Story 1.1 — verify, do not recreate
src/routes/+layout.ts       ← EXISTS (prerender = true) — do not touch
```

#### Alignment with Architecture

All file locations match `architecture.md#Complete Project Directory Structure`:
- `cardTypes.ts` → `src/lib/types/cardTypes.ts` ✓
- `cardData.svelte.ts` → `src/lib/state/cardData.svelte.ts` ✓
- `cardUtils.ts` + `cardUtils.test.ts` → `src/lib/utils/` ✓ (co-located)
- `+page.ts` → `src/routes/+page.ts` ✓

### Svelte 5 Runes in `.svelte.ts` Modules — Key Notes

**`$state` and `$derived` work at module scope in `.svelte.ts` files.** They are NOT restricted to `.svelte` component files. This is the intended pattern for global reactive state in Svelte 5.

The file extension `.svelte.ts` tells the Svelte compiler to process rune syntax. A plain `.ts` file will NOT process runes — the `.svelte.ts` extension is mandatory.

**Anti-patterns explicitly forbidden (architecture.md#Anti-Patterns):**
- ❌ `import { writable } from 'svelte/store'`
- ❌ `import { readable } from 'svelte/store'`
- ❌ `import { derived } from 'svelte/store'`
- ❌ `import { createEventDispatcher } from 'svelte'`
- ❌ `fetch('/data/cards.json')` inside any Svelte component

### Previous Story Intelligence (Story 1.3)

From Story 1.3 Dev Agent Record:

- **`"type": "module"` in `package.json`** — ES module imports required (`import`, not `require`)
- **TypeScript strict mode** — no implicit `any`, all types explicit
- **`@types/node` v24** — Node.js types available
- **`tsx` v4.21.0** — for running scripts; not relevant to this story (no scripts)
- **`eslint-disable` comments not acceptable** — use specific types, avoid `any`
- **Ship `crewSlots` absent from XML** — confirmed, do not add to `ShipDetails`
- **423 thumbnails exist** in `static/images/thumbs/` (not 424 — one card was missing from legacy source)
- **`static/images/cards/*.jpg` is gitignored** — only the zip archive is committed

**From Story 1.2 Dev Agent Record:**
- `cards.json` uses camelCase field names throughout (converted from XML PascalCase)
- All 550 cards successfully converted with zero data loss

### Git Intelligence Summary

**Recent commits:**
- `24fc5ff` — Add branching to dev story workflow (BMAD infra update)
- `e585f8b` — Mark stories done (sprint-status.yaml updated)
- `80e49dd` — Story 1-3: WebP thumbnail generation script (#3)
- `36ba090` — Story 1-2: XML-to-JSON card data conversion script (#2)
- `da58153` — Story 1-1: Initialize SvelteKit project with full toolchain (#1)

**Current state of `src/`:**
- `src/routes/+page.ts` — does NOT exist yet (needs to be created)
- `src/routes/+page.svelte` — exists with placeholder content only
- `src/routes/+error.svelte` — exists with status+message display
- `src/routes/+layout.ts` — exists with `prerender = true`
- `src/lib/index.ts` — exists but empty (placeholder)
- No `src/lib/types/`, `src/lib/state/`, or `src/lib/utils/` directories exist yet

**Note on new workflow (from commit `24fc5ff`):** Dev story workflow now creates a git branch `story/1-4-card-typescript-types-and-data-loading-infrastructure` and opens a PR on completion. This is handled automatically by the workflow.

### Testing Requirements

**Required: `src/lib/utils/cardUtils.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { thumbUrl, imageUrl, formatMove } from './cardUtils';
import type { Card } from '$lib/types/cardTypes';

const mockShip: Card = {
  cardId: '1234',
  cardSet: 'PPSM',
  cardNumber: 'EC-001',
  name: 'Test Ship',
  type: 'Ship',
  rarity: 'Rare',
  nationality: 'English',
  pointValue: 5,
  imageFilename: 'PPSM_EC-001.jpg',
  ability: 'Test ability',
  description: 'Test description',
  modifiers: {},
  details: { masts: 3, cargo: 4, baseMove: 'S+L', cannons: ['3S', '3L', '3S'] }
};

const mockCrewWithUnderscore: Card = {
  ...mockShip,
  cardNumber: '046_2',
  type: 'Crew',
  imageFilename: 'PPCC_046_2.jpg',
  details: { buildBonus: 0, costReduction: 0, cargoBonus: 0, limitCards: [] }
};

describe('thumbUrl', () => {
  it('converts .jpg to .webp and prepends thumbs path', () => {
    expect(thumbUrl(mockShip)).toBe('/images/thumbs/PPSM_EC-001.webp');
  });
  it('handles underscores in filename correctly', () => {
    expect(thumbUrl(mockCrewWithUnderscore)).toBe('/images/thumbs/PPCC_046_2.webp');
  });
});

describe('imageUrl', () => {
  it('prepends cards path to imageFilename', () => {
    expect(imageUrl(mockShip)).toBe('/images/cards/PPSM_EC-001.jpg');
  });
});

describe('formatMove', () => {
  it('returns baseMove string unchanged', () => {
    expect(formatMove('S+L')).toBe('S+L');
    expect(formatMove('L')).toBe('L');
    expect(formatMove('S+S+L')).toBe('S+S+L');
  });
});
```

**No Playwright e2e tests required for this story** — this story creates infrastructure only; UI is just a card count placeholder.

**Run tests with:** `npm run test:unit`

### What This Story Explicitly Does NOT Do

- Does NOT create any UI components (CardRow, CardTable, FilterSidebar, etc.) — that is Epic 2
- Does NOT create `filterState.svelte.ts` or `filterTypes.ts` — that is Epic 2
- Does NOT create `fleetState.svelte.ts` or fleet types — that is Phase 2
- Does NOT create `rulesEngine.ts` — that is Story 4.1
- Does NOT modify `cards.json` in any way — data pipeline is complete
- Does NOT add any route beyond `/` — single route in Phase 1
- Does NOT create `filterUtils.ts` — that is Story 2.3/2.4

### References

- [Source: epics.md#Story 1.4] — User story + acceptance criteria
- [Source: architecture.md#Core Architectural Decisions / State Management] — Svelte 5 runes mandate
- [Source: architecture.md#Complete Project Directory Structure] — File locations
- [Source: architecture.md#Component Patterns (Svelte 5)] — `$props()`, callback patterns
- [Source: architecture.md#Gap Analysis Results / TypeScript Card Discriminated Union] — Exact type definitions
- [Source: architecture.md#Data Architecture / JSON Schema] — camelCase field names
- [Source: architecture.md#Enforcement Guidelines] — Anti-patterns list
- [Source: 1-3-webp-thumbnail-generation-script.md#Completion Notes] — crewSlots absent confirmation, 423 thumbs
- [Source: static/data/cards.json] — Actual schema: 550 cards, PPSMU set, FortDetails.goldCost
- [Source: architecture.md#Naming Patterns] — File naming conventions

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

**Svelte 5 module export constraints (resolved):**
- `$state` that is reassigned cannot be exported from a `.svelte.ts` module (error: `state_invalid_export`). Attempted splice-in-place workaround, then discovered `$derived` also cannot be exported (`derived_invalid_export`). Resolution: class-based store pattern — `CardDataStore` class with `$state` and `$derived.by()` as class properties, exported as `export const cardData = new CardDataStore()`. This is the canonical Svelte 5 pattern.
- Svelte 5 warning `state_referenced_locally` triggered by calling `setCards(data.cards)` at module scope in `+page.svelte`. Fixed by wrapping in `$effect(() => { cardData.setCards(data.cards); })`.

### Completion Notes List

- Removed `tournamentStatus` from `scripts/convert.ts` and regenerated `static/data/cards.json` — 550 cards, zero `tournamentStatus` fields.
- Created `src/lib/types/cardTypes.ts` with full discriminated union types (`Card`, `ShipCard`, `CrewCard`, `TreasureCard`, `FortCard`, `EventCard`). TypeScript narrowing verified via `svelte-check`.
- Created `src/lib/utils/cardUtils.ts` with `thumbUrl`, `imageUrl`, `formatMove` helpers.
- Created `src/lib/utils/cardUtils.test.ts` with 4 unit tests — all pass.
- Created `src/lib/state/cardData.svelte.ts` using **class-based Svelte 5 runes pattern** (`CardDataStore` class). The story's module-level rune export pattern is not supported by Svelte 5's build constraints; class-based is the correct approach. Exports `cardData` singleton with `.cards`, `.cardById`, and `.setCards()`.
- Created `src/routes/+page.ts` with typed `PageLoad` using SvelteKit's provided `fetch`. Throws `error(500, ...)` on failure.
- Updated `src/routes/+page.svelte` to use `$props()` and call `cardData.setCards(data.cards)` inside `$effect()`.
- Confirmed `src/routes/+error.svelte` already handles SvelteKit errors (displays status + message).
- `npm run check`: 0 errors, 0 warnings. `npm run test:unit`: 5/5 pass. `npm run build`: succeeded.

### File List

- `scripts/convert.ts` (modified — removed tournamentStatus field)
- `static/data/cards.json` (regenerated — 550 cards, no tournamentStatus)
- `src/lib/types/cardTypes.ts` (created)
- `src/lib/utils/cardUtils.ts` (created)
- `src/lib/utils/cardUtils.test.ts` (created)
- `src/lib/state/cardData.svelte.ts` (created)
- `src/routes/+page.ts` (created)
- `src/routes/+page.svelte` (modified)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (updated — in-progress → review)
- `_bmad-output/implementation-artifacts/1-4-card-typescript-types-and-data-loading-infrastructure.md` (updated)
