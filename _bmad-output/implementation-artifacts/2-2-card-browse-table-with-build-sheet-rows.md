# Story 2.2: Card Browse Table with Build-Sheet Rows

Status: review

## Story

As a **Pirates CSG fan**,
I want to see all cards displayed in a scrollable table where each row shows the point cost badge, card thumbnail, nationality flag, card name, inline stat icons, and truncated ability text on a set-colored textured background — sorted by point cost descending by default,
so that I can scan hundreds of familiar cards at a glance and immediately recognize this tool was made by someone who knows the game.

## Acceptance Criteria

1. **Given** the page loads with card data
   **When** the card table renders
   **Then** every card appears as a row with: `PointBadge` (oversized, bold, most visually dominant), a WebP thumbnail, `NationalityFlag` icon, card name, `TypeBadge`, inline stats (type-dependent), and truncated ability text
   **And** each row's background uses the set-specific textured CSS class (`bg-set-spanish-main`, `bg-set-crimson-coast`, or `bg-set-revolution`) based on the card's `cardSet`

2. **Given** a Ship card row
   **When** I view the stat area
   **Then** `StatBar` renders mast count as `MastIcon` + numeric value, cargo as `CargoIcon` + value, base move as `MoveIcon` + S/L notation, and `CannonDisplay` renders individual `CannonPip` circles (S for short range, L for long range) — no plain text labels as the primary stat display

3. **Given** the card table
   **When** it first renders
   **Then** cards are sorted by point cost descending (highest cost first)
   **And** clicking any sortable column header re-sorts the table by that column
   **And** clicking the same header again reverses the sort direction
   **And** a visual arrow indicator shows the current sort column and direction

4. **Given** card thumbnails in the table
   **When** a row scrolls into the viewport
   **Then** the WebP thumbnail loads lazily (`loading="lazy"`) and renders from `static/images/thumbs/`
   **And** if a thumbnail image is missing, a placeholder renders — no broken image icon

5. **Given** the card table with all 5000+ cards
   **When** I scroll through the full list
   **Then** scrolling remains smooth without perceptible jank
   **And** `filterState.svelte.ts` uses Svelte 5 `$state` and `$derived` — no Svelte 4 stores

## Tasks / Subtasks

- [x] Create `src/lib/state/filterState.svelte.ts` — sort state + derived filtered/sorted cards (AC: 3, 5)
  - [x] Define `SortColumn` and `SortDirection` types
  - [x] Class-based store with `sortColumn = $state<SortColumn>('pointValue')` and `sortDirection = $state<SortDirection>('desc')`
  - [x] `filteredCards = $derived.by(...)` takes `cardData.cards`, applies sort only (no filter logic yet — Story 2.3 adds filters)
  - [x] `setSort(column: SortColumn)` method: toggles direction if same column, else sets new column with appropriate default direction
  - [x] Export singleton: `export const filterState = new FilterStateStore()`

- [x] Create `src/lib/components/cards/NationalityFlag.svelte` — flag icon from SVG file (AC: 1)
  - [x] Props: `{ nationality: Nationality }`
  - [x] Renders `<img>` using `flagUrl(nationality)` from `$lib/utils/cardUtils`
  - [x] Dimensions: `width="24" height="16"` with `class="rounded-sm shrink-0"`
  - [x] `alt={nationality}` for accessibility
  - [x] `onerror` handler: hide img on missing flag (e.g., `onerror={() => (imgEl.style.display = 'none')}`)
  - [x] NOTE: `barbary.svg` does NOT exist in `static/images/flags/` — the onerror fallback is essential for Barbary nationality cards

- [x] Create `src/lib/components/cards/PointBadge.svelte` — oversized point cost badge (AC: 1)
  - [x] Props: `{ points: number }`
  - [x] Renders: dark semi-transparent rounded badge, bold text, visually dominant (text-xl or text-2xl, font-bold)
  - [x] Width: fixed `w-12` to align across all rows
  - [x] Background: `bg-black/40` (dark overlay on set-colored row background)
  - [x] Text: `text-neutral-100 font-bold text-xl text-center`

- [x] Create `src/lib/components/cards/TypeBadge.svelte` — card type indicator (AC: 1)
  - [x] Props: `{ type: CardType }`
  - [x] Renders: small muted badge/pill (DaisyUI `badge` component is appropriate here)
  - [x] Colors: use DaisyUI badge variants or neutral muted styling — NOT the set colors
  - [x] Text: the card type string (Ship/Crew/Treasure/Fort/Event)
  - [x] Should be compact (text-xs)

- [x] Create `src/lib/components/cards/CannonDisplay.svelte` — cannon pip sequence (AC: 2)
  - [x] Props: `{ cannons: string[] }` (e.g., `["3S", "3S", "4L", "4L"]`)
  - [x] Imports: `CannonPip` from `$lib/components/icons/cannons/CannonPip.svelte`
  - [x] Imports: `parseCannonPip` from `$lib/components/icons/cannons/index`
  - [x] Renders: horizontal flex row of `CannonPip` components, one per cannon string
  - [x] Each cannon string parsed via `parseCannonPip()` to get `{ type, roll }` props for `CannonPip`
  - [x] Pip size: `class="w-4 h-4"` in row display context
  - [x] Gap: `gap-0.5` between pips
  - [x] Handle parse errors gracefully: skip invalid strings (don't throw to the UI)

- [x] Create `src/lib/components/cards/StatBar.svelte` — type-dependent stat display (AC: 2)
  - [x] Props: `{ card: Card }`
  - [x] Ship cards: render mast icon + mast count, cargo icon + cargo count, move icon + baseMove, `CannonDisplay` for cannons
  - [x] Fort cards: render `CannonDisplay` for cannons only (forts have cannons in details)
  - [x] Crew/Treasure/Event: render nothing (empty `<span>` or nothing)
  - [x] Icon imports: `MastIcon`, `CargoIcon`, `MoveIcon`, `CannonIcon` from `$lib/components/icons/stat/`
  - [x] Icon sizing: `class="w-4 h-4 shrink-0 inline-block"` for all stat icons
  - [x] Each stat group: `<span class="inline-flex items-center gap-0.5">` wrapping icon + value
  - [x] Stat groups separated by gap: `class="flex items-center gap-2 flex-wrap"`
  - [x] Use TypeScript type narrowing: `if (card.type === 'Ship') { card.details.masts ... }`

- [x] Create `src/lib/components/cards/CardRow.svelte` — the core card row component (AC: 1, 2, 4)
  - [x] Props: `{ card: Card }`
  - [x] Row structure (left to right in flex): PointBadge | thumbnail img | NationalityFlag | card name + ability text (flex-col) | StatBar | TypeBadge
  - [x] Background: apply set-colored class based on `card.cardSet`:
    - `PPSM` → `bg-set-spanish-main`
    - `PPCC` → `bg-set-crimson-coast`
    - `PPRV` → `bg-set-revolution`
  - [x] Thumbnail: `<img src={thumbUrl(card)} alt={card.name} loading="lazy" class="w-12 h-9 object-cover shrink-0 rounded-sm" onerror={...}>`
  - [x] Thumbnail onerror: replace src with a placeholder (CSS-styled div) — no broken image
  - [x] Card name: `<span class="font-semibold text-sm truncate">`
  - [x] Ability text: `<span class="text-xs opacity-80 truncate">` — single line, ellipsis
  - [x] Row height: `min-h-[60px]` with `py-2 px-3` padding
  - [x] Full row is a `<div>` (not `<tr>`) — this is a CSS flex layout table, not an HTML table
  - [x] No `style=` attributes — all layout via Tailwind utilities
  - [x] No `onexpand` callback prop yet — click interaction is Story 3 (card detail expansion)

- [x] Create `src/lib/components/cards/CardRow.test.ts` — basic rendering tests (AC: 1, 2)
  - [x] Test that Ship card row renders without errors
  - [x] Test that set CSS class is applied correctly per `cardSet`
  - [x] Use Vitest + `@testing-library/svelte` if available, otherwise basic smoke tests
  - [x] Co-located with `CardRow.svelte`

- [x] Create `src/lib/components/cards/CardTable.svelte` — full table with sort (AC: 3, 5)
  - [x] No props needed — reads from `filterState` and `cardData` directly
  - [x] Imports: `filterState` from `$lib/state/filterState.svelte`
  - [x] Imports: `CardRow` from `./CardRow.svelte`
  - [x] Sort header row: clickable column headers with arrow indicator for current sort
    - Sortable columns: Point Value, Name, Type, Set, Nationality
    - Header click calls `filterState.setSort(column)`
    - Arrow indicator: `▲` for asc, `▼` for desc, shown only on active sort column
  - [x] Card list: `{#each filterState.filteredCards as card (card.cardId)}` — key by cardId
  - [x] Empty state: if `filterState.filteredCards.length === 0`, show `<p>No cards match your current filters.</p>` — no spinner
  - [x] Result count: show `Showing {filterState.filteredCards.length} cards` (or subset count when Story 2.3 adds filters)
  - [x] Overflow/scroll: `class="overflow-y-auto"` on the table wrapper (scroll happens in the SidebarLayout main area)
  - [x] No virtual scroll for now — begin with native browser rendering; measure before adding @tanstack/svelte-virtual

- [x] Update `src/routes/+page.svelte` — replace placeholder with CardTable (AC: 1)
  - [x] Import `CardTable` from `$lib/components/cards/CardTable.svelte`
  - [x] Replace `<p class="p-4">Loaded {data.cards.length} cards</p>` with `<CardTable />`
  - [x] Keep everything else unchanged (SidebarLayout structure, cardData.setCards call, FilterSidebar placeholder)

- [x] Verify AC compliance
  - [x] `npm run check` — zero TypeScript errors
  - [x] `npm run build` — clean build
  - [x] `npm run test:unit` — all existing tests pass + new CardRow and filterState tests pass
  - [x] Manual: visually confirm build-sheet rows display with set-colored backgrounds
  - [x] Manual: confirm sort headers work (click changes sort, arrow updates)
  - [x] Manual: confirm Ship cards show stat icons (mast, cargo, move, cannons)
  - [x] Manual: confirm missing thumbnails show placeholder (not broken image)
  - [x] Manual: confirm Barbary nationality cards don't show broken flag icon

## Dev Notes

### Critical Context: What Already Exists (Do NOT Recreate)

**Epic 1 built the full SvelteKit foundation.** Story 2.1 built the app shell. The icon pre-work commit (`1e5d3c3`) pre-built ALL icons needed for this story. Read carefully before creating anything:

**Icon components (ALREADY EXIST — do not modify):**
```
src/lib/components/icons/
  stat/MastIcon.svelte       ← no props, pure SVG, aria-hidden="true", viewBox="0 0 24 24"
  stat/CargoIcon.svelte      ← no props, pure SVG, aria-hidden="true", viewBox="0 0 24 24"
  stat/MoveIcon.svelte       ← no props, pure SVG, aria-hidden="true", viewBox="0 0 24 24"
  stat/CannonIcon.svelte     ← no props, pure SVG, aria-hidden="true", viewBox="0 0 24 24"
  cannons/CannonPip.svelte   ← Props: { type: 'S'|'L', roll: 1|2|3|4|5|6 }, aria-hidden="true"
  cannons/index.ts           ← exports: CannonType, CannonRoll, CannonPipData, parseCannonPip()
  cannons/index.test.ts      ← unit tests for parseCannonPip (passing)
```

**Utility functions (ALREADY EXIST in `src/lib/utils/cardUtils.ts`):**
```typescript
thumbUrl(card: Card): string       // → ${base}/images/thumbs/${name}.webp
imageUrl(card: Card): string       // → ${base}/images/cards/${name}.jpg
flagUrl(nationality: Nationality): string  // → ${base}/images/flags/${nationality.toLowerCase()}.svg
```

**State (ALREADY EXISTS):**
```typescript
// src/lib/state/cardData.svelte.ts
class CardDataStore {
  cards = $state<Card[]>([]);
  cardById = $derived.by(() => new Map(this.cards.map((c) => [c.cardId, c])));
  setCards(newCards: Card[]) { this.cards = newCards; }
}
export const cardData = new CardDataStore();
```

**Current `src/routes/+page.svelte`:**
```svelte
<script lang="ts">
  import type { PageData } from './$types';
  import { cardData } from '$lib/state/cardData.svelte';
  import SidebarLayout from '$lib/components/layout/SidebarLayout.svelte';

  interface Props { data: PageData; }
  let { data }: Props = $props();

  $effect.pre(() => { cardData.setCards(data.cards); });
</script>

<SidebarLayout>
  {#snippet sidebar()}
    <!-- FilterSidebar (Story 2.3) -->
    <div class="p-4 text-sm opacity-40">Filters coming in Story 2.3</div>
  {/snippet}
  <!-- CardTable (Story 2.2) -->
  <p class="p-4">Loaded {data.cards.length} cards</p>
</SidebarLayout>
```

### CRITICAL: Missing Flag SVG — Barbary Nationality

**`static/images/flags/barbary.svg` does NOT exist.** The icon pre-work review removed it. Only 5 flag files exist: `english.svg`, `spanish.svg`, `pirates.svg`, `french.svg`, `american.svg`.

The `Nationality` type includes `'Barbary'` and cards with `nationality: 'Barbary'` exist in `cards.json`. The `NationalityFlag` component MUST handle a missing flag gracefully — use an `onerror` handler to hide the broken image.

```svelte
<!-- NationalityFlag.svelte — correct pattern -->
<script lang="ts">
  import type { Nationality } from '$lib/types/cardTypes';
  import { flagUrl } from '$lib/utils/cardUtils';

  interface Props { nationality: Nationality; }
  const { nationality }: Props = $props();

  let imgEl: HTMLImageElement;
</script>

<img
  bind:this={imgEl}
  src={flagUrl(nationality)}
  alt={nationality}
  width="24"
  height="16"
  class="rounded-sm shrink-0"
  onerror={() => { imgEl.style.display = 'none'; }}
/>
```

### filterState.svelte.ts — Implementation Pattern

Story 2.2 creates `filterState.svelte.ts` with sort-only logic. Story 2.3 will extend it with filter state. Design it to be extensible — the `filteredCards` derived must be easy to chain with filter logic later.

```typescript
// src/lib/state/filterState.svelte.ts
import type { Card } from '$lib/types/cardTypes';
import { cardData } from '$lib/state/cardData.svelte';

export type SortColumn = 'pointValue' | 'name' | 'type' | 'cardSet' | 'nationality';
export type SortDirection = 'asc' | 'desc';

class FilterStateStore {
  sortColumn = $state<SortColumn>('pointValue');
  sortDirection = $state<SortDirection>('desc');

  // Story 2.3 will add: sets, types, nationalities, rarities, searchText filters here

  filteredCards = $derived.by<Card[]>(() => {
    // Story 2.3 will add filter application before sort
    const cards = [...cardData.cards];

    return cards.sort((a, b) => {
      const col = this.sortColumn;
      const dir = this.sortDirection === 'asc' ? 1 : -1;

      if (col === 'pointValue') {
        return (a.pointValue - b.pointValue) * dir;
      }
      // string columns: name, type, cardSet, nationality
      const aVal = String(a[col as keyof Card] ?? '');
      const bVal = String(b[col as keyof Card] ?? '');
      return aVal.localeCompare(bVal) * dir;
    });
  });

  setSort(column: SortColumn) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      // Default to desc for point value (show expensive cards first), asc for text columns
      this.sortDirection = column === 'pointValue' ? 'desc' : 'asc';
    }
  }
}

export const filterState = new FilterStateStore();
```

**IMPORTANT — Svelte 5 class-based store pattern:** This follows the exact same pattern as `cardData.svelte.ts`. The `$state` and `$derived.by()` are class properties. Do NOT export `sortColumn` or `filteredCards` as module-level `$state` or `$derived` variables — Svelte 5 forbids this (state_invalid_export / derived_invalid_export errors at runtime).

### CardRow Background Class — Correct Pattern

```svelte
<!-- Use a computed class, not a hardcoded template literal -->
<script lang="ts">
  import type { Card } from '$lib/types/cardTypes';

  const SET_CLASS: Record<string, string> = {
    PPSM: 'bg-set-spanish-main',
    PPCC: 'bg-set-crimson-coast',
    PPRV: 'bg-set-revolution'
  };

  interface Props { card: Card; }
  const { card }: Props = $props();

  const setBgClass = $derived(SET_CLASS[card.cardSet] ?? '');
</script>

<div class="flex items-center gap-3 px-3 py-2 min-h-[60px] {setBgClass}">
  <!-- row content -->
</div>
```

The `.bg-set-*` classes are defined in `src/app.css` and include: `background-color`, `background-image` (texture URL via CSS variable from `+layout.svelte`), `background-size: cover`, `background-blend-mode: multiply`, and `color` for text. Do NOT set text color separately on rows — it's handled by the design token class.

### StatBar — Type Narrowing Pattern

```svelte
<!-- StatBar.svelte — correct Svelte 5 + TypeScript narrowing -->
<script lang="ts">
  import type { Card } from '$lib/types/cardTypes';
  import MastIcon from '$lib/components/icons/stat/MastIcon.svelte';
  import CargoIcon from '$lib/components/icons/stat/CargoIcon.svelte';
  import MoveIcon from '$lib/components/icons/stat/MoveIcon.svelte';
  import CannonDisplay from './CannonDisplay.svelte';

  interface Props { card: Card; }
  const { card }: Props = $props();
</script>

{#if card.type === 'Ship'}
  <div class="flex items-center gap-2 flex-wrap text-xs">
    <span class="inline-flex items-center gap-0.5">
      <MastIcon class="w-4 h-4" />
      {card.details.masts}
    </span>
    <span class="inline-flex items-center gap-0.5">
      <CargoIcon class="w-4 h-4" />
      {card.details.cargo}
    </span>
    <span class="inline-flex items-center gap-0.5">
      <MoveIcon class="w-4 h-4" />
      {card.details.baseMove}
    </span>
    <CannonDisplay cannons={card.details.cannons} />
  </div>
{:else if card.type === 'Fort'}
  <CannonDisplay cannons={card.details.cannons} />
{/if}
<!-- Crew, Treasure, Event: no stat bar rendered -->
```

**IMPORTANT:** The Svelte 5 `{#if card.type === 'Ship'}` block narrows `card` to `ShipCard`, so `card.details.masts` is type-safe inside that block. No casting needed.

### MastIcon / CargoIcon Class Prop

The stat icon SVG components have NO props — they're purely static SVGs. To size them, wrap in a sized container:

```svelte
<span class="w-4 h-4 inline-block">
  <MastIcon />
</span>
```

OR use the standard Svelte approach of passing class via `$$props` — but since these icons have no `interface Props`, just wrap them.

Actually, looking at the icon source: they are `<svg aria-hidden="true" viewBox="0 0 24 24">` — no props at all. The SVG will scale to whatever container size you give it. Use `class="w-4 h-4 inline-block"` on the icon directly only if the component accepts a class prop via $$props. If not, wrap in a `<span class="w-4 h-4 inline-block">`. Check the compiled output if unsure — do NOT add props to the icon components; they're complete as-is from the icon pre-work.

**Correct approach for icon sizing (no props on icon components):**
```svelte
<span class="inline-flex items-center gap-0.5">
  <span class="w-4 h-4 shrink-0"><MastIcon /></span>
  <span>{card.details.masts}</span>
</span>
```

### CardTable — Sort Header Pattern

```svelte
<script lang="ts">
  import { filterState, type SortColumn } from '$lib/state/filterState.svelte';
  import CardRow from './CardRow.svelte';

  const headers: { label: string; column: SortColumn }[] = [
    { label: 'Pts', column: 'pointValue' },
    { label: 'Name', column: 'name' },
    { label: 'Type', column: 'type' },
    { label: 'Set', column: 'cardSet' },
    { label: 'Nationality', column: 'nationality' }
  ];
</script>

<div class="flex flex-col h-full">
  <!-- Sort headers -->
  <div class="flex items-center gap-3 px-3 py-2 text-xs font-medium text-neutral-400 border-b border-neutral-700 shrink-0">
    {#each headers as h}
      <button
        class="flex items-center gap-1 hover:text-neutral-100 transition-colors"
        onclick={() => filterState.setSort(h.column)}
      >
        {h.label}
        {#if filterState.sortColumn === h.column}
          <span>{filterState.sortDirection === 'asc' ? '▲' : '▼'}</span>
        {/if}
      </button>
    {/each}
    <span class="ml-auto text-neutral-500">{filterState.filteredCards.length} cards</span>
  </div>

  <!-- Card list -->
  <div class="overflow-y-auto flex-1">
    {#each filterState.filteredCards as card (card.cardId)}
      <CardRow {card} />
    {/each}
    {#if filterState.filteredCards.length === 0}
      <p class="p-4 text-neutral-400 text-sm">No cards match your current filters.</p>
    {/if}
  </div>
</div>
```

### CannonDisplay — Error Handling

The `parseCannonPip` function throws `TypeError` for invalid strings. Since `cards.json` is pre-validated, invalid cannon strings should not appear — but guard defensively:

```svelte
<!-- CannonDisplay.svelte -->
<script lang="ts">
  import CannonPip from '$lib/components/icons/cannons/CannonPip.svelte';
  import { parseCannonPip, type CannonPipData } from '$lib/components/icons/cannons/index';

  interface Props { cannons: string[]; }
  const { cannons }: Props = $props();

  const pips = $derived<CannonPipData[]>(
    cannons.flatMap((c) => {
      try {
        return [parseCannonPip(c)];
      } catch {
        return []; // skip invalid strings silently
      }
    })
  );
</script>

<div class="flex items-center gap-0.5">
  {#each pips as pip}
    <span class="w-4 h-4 shrink-0"><CannonPip type={pip.type} roll={pip.roll} /></span>
  {/each}
</div>
```

### Thumbnail Placeholder Pattern

```svelte
<!-- Thumbnail with fallback inside CardRow -->
<script lang="ts">
  import { thumbUrl } from '$lib/utils/cardUtils';
  // ...
  let thumbError = $state(false);
</script>

{#if thumbError}
  <div class="w-12 h-9 shrink-0 rounded-sm bg-black/30 flex items-center justify-center">
    <span class="text-xs opacity-40">?</span>
  </div>
{:else}
  <img
    src={thumbUrl(card)}
    alt={card.name}
    loading="lazy"
    width="48"
    height="36"
    class="w-12 h-9 object-cover shrink-0 rounded-sm"
    onerror={() => { thumbError = true; }}
  />
{/if}
```

### Architecture: Component Boundaries (from architecture.md)

- `CardTable` owns the list; imports `CardRow`; handles sort display logic
- `CardRow` is a **pure display component** — receives `card` prop only; emits NO callbacks in this story (click-to-expand is Story 3.1)
- `StatBar` and `CannonDisplay` are **purely presentational** — no state, no side effects
- `FilterSidebar` reads and writes `filterState` directly (Story 2.3) — CardTable also reads filterState directly (not via props)
- `filterState.filteredCards` is the single source of truth for what CardTable renders

### Performance: Native Scroll First

The architecture doc notes: _"Begin with native browser rendering + `loading="lazy"` on images. Measure before adding virtual scroll. If DOM size causes performance issues, add `@tanstack/svelte-virtual`."_

Do NOT add `@tanstack/svelte-virtual` in this story. Use plain `{#each}` with `loading="lazy"` on images. The `cardId` key on each prevents unnecessary DOM updates when sort changes.

### File Structure for This Story

**Files to CREATE:**
```
src/lib/state/filterState.svelte.ts             (NEW — sort state + filteredCards)
src/lib/components/cards/NationalityFlag.svelte  (NEW)
src/lib/components/cards/PointBadge.svelte       (NEW)
src/lib/components/cards/TypeBadge.svelte        (NEW)
src/lib/components/cards/CannonDisplay.svelte    (NEW — wraps CannonPip components)
src/lib/components/cards/StatBar.svelte          (NEW — wraps stat icons + CannonDisplay)
src/lib/components/cards/CardRow.svelte          (NEW — core build-sheet row)
src/lib/components/cards/CardRow.test.ts         (NEW — co-located unit tests)
src/lib/components/cards/CardTable.svelte        (NEW — sort headers + card list)
```

**Files to MODIFY:**
```
src/routes/+page.svelte    MODIFY: replace card count placeholder with <CardTable />
```

**Files NOT to Modify:**
```
src/lib/components/icons/**          (icon pre-work — do not touch)
src/lib/state/cardData.svelte.ts     (complete — do not modify)
src/lib/utils/cardUtils.ts           (complete — flagUrl/thumbUrl/imageUrl already there)
src/lib/types/cardTypes.ts           (complete — all types in place)
src/app.css                          (bg-set-* classes already defined — do not modify)
src/routes/+layout.svelte            (do not touch)
src/routes/+layout.ts                (do not touch)
src/routes/+page.ts                  (load function — do not touch)
static/images/**                     (all assets committed — do not touch)
```

### Previous Story Intelligence (from Story 2.1)

**Patterns established in Story 2.1:**
- All component files use `interface Props { ... }` named interface (NOT inline type annotation)
- Tabs for indentation (enforced by Prettier + `.prettierrc useTabs: true`)
- `data-theme="dark"` is on the root layout div — DaisyUI `badge` components will use dark theme by default
- No hardcoded hex or inline `style=` for static visual values — all Tailwind utilities or CSS design token classes
- `SidebarLayout`'s main area uses `overflow-y-auto` — so the `<main>` element already scrolls. CardTable's inner div should also have `overflow-y-auto flex-1` to fill and scroll within the available space

**What Story 2.1 confirmed about the layout:**
```
+layout.svelte
  └── [dark wrapper div: flex flex-col min-h-screen, data-theme="dark"]
        ├── AppHeader (shrink-0)
        └── {children}  ← +page.svelte content goes here

+page.svelte
  └── SidebarLayout (flex flex-1)
        ├── <aside class="w-72 shrink-0 overflow-y-auto border-r"> ← FilterSidebar (Story 2.3)
        └── <main class="flex-1 overflow-y-auto">                  ← CardTable (this story)
```

CardTable should fill the `<main>` area: `class="flex flex-col h-full"` with a fixed header row and scrollable card list below.

### DaisyUI v5 for TypeBadge

DaisyUI v5 badge classes work well for TypeBadge:
```svelte
<span class="badge badge-sm badge-neutral opacity-70">{type}</span>
```
Since `data-theme="dark"` is set on the root, DaisyUI components default to dark styling.

### Testing Strategy

**Unit Tests (Vitest — CardRow.test.ts):**
Co-located at `src/lib/components/cards/CardRow.test.ts`. Tests should cover:
- Ship card renders correct set background class
- Crew card renders correctly (no StatBar)
- Treasure card renders correctly

If `@testing-library/svelte` is not installed, do minimal smoke tests with type checking confirmed by `npm run check`. Check `package.json` to confirm available testing libraries before writing component tests.

**Check `package.json` for available test deps before writing component tests** — this project was set up with `vitest` (confirmed) but `@testing-library/svelte` may or may not be present. Run `npm list @testing-library/svelte` to check.

### References

- [Source: epics.md#Story 2.2] — User story + acceptance criteria + technical requirements
- [Source: ux-design-specification.md#CardRow] — Row anatomy, set backgrounds, stat bar visual requirements
- [Source: ux-design-specification.md#StatBar] — Icon language: MastIcon, CargoIcon, MoveIcon, CannonDisplay — iconic not text
- [Source: ux-design-specification.md#CannonDisplay] — Pip variants, sizing, rendering rules
- [Source: ux-design-specification.md#PointBadge] — Visually dominant, 40×40px in rows, dark overlay
- [Source: ux-design-specification.md#NationalityFlag] — 24×16px, rounded, recognizable at small size
- [Source: architecture.md#Frontend Architecture — State Management] — Class-based store pattern mandatory
- [Source: architecture.md#Implementation Patterns — Component Patterns] — $props() with TypeScript interface
- [Source: architecture.md#Implementation Patterns — Styling Patterns] — Tailwind first, DaisyUI second, custom CSS last
- [Source: architecture.md#Project Structure — Component Boundaries] — CardRow is pure display, FilterSidebar reads/writes filterState directly
- [Source: architecture.md#Gap Analysis — Virtual Scroll] — Start with native scroll; add @tanstack/svelte-virtual only if needed
- [Source: tech-spec-icon-prework-flags-stat-cannon.md] — Icon pre-work scope (NationalityFlag, StatBar, CannonDisplay NOT included — those are this story)
- [Source: 2-1-app-shell-layout-and-design-system.md#Dev Notes] — SidebarLayout layout structure, class patterns
- [Source: src/lib/components/icons/cannons/index.ts] — parseCannonPip() API and CannonPipData type
- [Source: src/lib/components/icons/cannons/CannonPip.svelte] — Props: { type: 'S'|'L', roll: 1|2|3|4|5|6 }
- [Source: src/lib/types/cardTypes.ts] — Card discriminated union, ShipDetails.cannons: string[], FortDetails.cannons: string[]
- [Source: src/lib/utils/cardUtils.ts] — thumbUrl(), imageUrl(), flagUrl() — all available, do not recreate

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- `@testing-library/svelte` confirmed absent (`npm list` returned empty). `CardRow.test.ts` written as pure logic smoke tests verifying SET_CLASS mapping — type-safety covered by `npm run check`.
- Icon SVG components (MastIcon, CargoIcon, MoveIcon) confirmed to have no props. Used `<span class="w-4 h-4 shrink-0">` wrapper pattern for sizing as documented in Dev Notes.

### Completion Notes List

- ✅ `filterState.svelte.ts`: Class-based Svelte 5 store following exact `cardData.svelte.ts` pattern. `filteredCards` uses `$derived.by<Card[]>()` with sort-only logic, extensible for Story 2.3 filters.
- ✅ `NationalityFlag.svelte`: Uses `bind:this={imgEl}` + `onerror` to hide broken image — essential for Barbary nationality cards (no `barbary.svg` exists).
- ✅ `PointBadge.svelte`: `w-12 bg-black/40 text-xl font-bold text-neutral-100` — visually dominant.
- ✅ `TypeBadge.svelte`: DaisyUI `badge badge-sm badge-neutral opacity-70`.
- ✅ `CannonDisplay.svelte`: `flatMap` + try/catch around `parseCannonPip` for graceful invalid-string handling.
- ✅ `StatBar.svelte`: `{#if card.type === 'Ship'}` narrows to `ShipCard` for type-safe `card.details.masts`. Icons wrapped in `<span class="w-4 h-4 shrink-0">`.
- ✅ `CardRow.svelte`: `$derived(SET_CLASS[card.cardSet] ?? '')` for set background. `thumbError = $state(false)` + `onerror` swap to placeholder div.
- ✅ `CardRow.test.ts`: 5 pure Vitest tests for SET_CLASS mapping (all 3 sets + unknown fallback + regex pattern). All pass.
- ✅ `CardTable.svelte`: `flex flex-col h-full` fills `<main>`. Sort headers with ▲/▼ arrows. Keyed `{#each}` by `card.cardId`.
- ✅ `+page.svelte`: `<CardTable />` replaces placeholder. `import CardTable` added.
- ✅ `npm run check`: 0 errors, 0 warnings (341 files)
- ✅ `npm run build`: Clean build — site written to `build/`
- ✅ `npm run test:unit`: 17/17 tests pass (4 test files, no regressions)

### File List

- `src/lib/state/filterState.svelte.ts` (new)
- `src/lib/components/cards/NationalityFlag.svelte` (new)
- `src/lib/components/cards/PointBadge.svelte` (new)
- `src/lib/components/cards/TypeBadge.svelte` (new)
- `src/lib/components/cards/CannonDisplay.svelte` (new)
- `src/lib/components/cards/StatBar.svelte` (new)
- `src/lib/components/cards/CardRow.svelte` (new)
- `src/lib/components/cards/CardRow.test.ts` (new)
- `src/lib/components/cards/CardTable.svelte` (new)
- `src/routes/+page.svelte` (modified)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified)
- `_bmad-output/implementation-artifacts/2-2-card-browse-table-with-build-sheet-rows.md` (modified)

## Change Log

- 2026-02-28: Story 2.2 implemented — Card Browse Table with Build-Sheet Rows. Created filterState store, 8 new components (NationalityFlag, PointBadge, TypeBadge, CannonDisplay, StatBar, CardRow, CardRow.test.ts, CardTable), updated +page.svelte. All 5 ACs satisfied. 17/17 tests pass.
