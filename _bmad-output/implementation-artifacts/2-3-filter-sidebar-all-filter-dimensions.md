# Story 2.3: Filter Sidebar — All Filter Dimensions

Status: review

## Story

As a **Pirates CSG fan**,
I want a sidebar with filter controls for expansion set, card type, nationality, and rarity — combinable in any combination — along with a text search, a result count, and individual clear controls for each active filter,
so that I can narrow 5000+ cards to exactly what I need (e.g., "English Ships from Spanish Main") in seconds with no perceptible delay.

## Acceptance Criteria

1. **Given** the filter sidebar
   **When** the page loads
   **Then** I see: a text search input at the top, followed by four `<select>` dropdowns for Expansion Set, Card Type, Nationality, and Rarity — all defaulting to "All"
   **And** a result count shows "Showing {filtered} of {total} cards" at the bottom of the sidebar

2. **Given** I select a filter value (e.g., "Ship" for Card Type)
   **When** the filter is applied
   **Then** the card table updates instantly with no perceptible delay
   **And** an active filter chip appears in the sidebar showing "Type: Ship" with an ✕ clear button
   **And** the result count updates to reflect the filtered set

3. **Given** multiple active filters (e.g., Type: Ship + Nationality: English + Set: Spanish Main)
   **When** all three filters are active simultaneously
   **Then** the table shows only cards matching ALL active filters (AND logic)
   **And** each active filter has its own independent ✕ clear button

4. **Given** active filters are present
   **When** I click the "Clear All" button
   **Then** all filters reset and the full card catalog is shown
   **And** all active filter chips disappear
   **And** the result count returns to the total card count

5. **Given** a filter combination that matches zero cards
   **When** the filters are applied
   **Then** the card table shows "No cards match your current filters." (existing CardTable empty state)
   **And** the sidebar result count shows "Showing 0 of {total} cards"
   **And** no error, no spinner

6. **Given** the text search input
   **When** I type in it
   **Then** the card table filters to cards whose `name` OR `ability` text contains the search string (case-insensitive)
   **And** the search applies with ~150ms debounce (no filtering on every keystroke)
   **And** the active search appears as a chip "Search: {text}" with ✕ to clear
   **And** clearing the input removes the search chip and restores the pre-search results

7. **Given** active filters exist
   **When** I change the sort column in CardTable
   **Then** sort state is preserved and applies on top of the filtered set

## Tasks / Subtasks

- [x] Extend `src/lib/state/filterState.svelte.ts` — add filter state + filter logic (AC: 1–7)
  - [x] Add `selectedSet = $state<CardSet | ''>('')` — empty string = "All"
  - [x] Add `selectedType = $state<CardType | ''>('')`
  - [x] Add `selectedNationality = $state<Nationality | ''>('')`
  - [x] Add `selectedRarity = $state<Rarity | ''>('')`
  - [x] Add `searchText = $state<string>('')`
  - [x] Add `activeFilterCount = $derived(...)` — count of non-empty filter values (for "Clear All" visibility)
  - [x] Update `filteredCards = $derived.by(...)` — apply all active filters BEFORE the existing sort logic
  - [x] Add `clearAllFilters()` method — resets all 5 filter state properties to '' (does NOT reset sort)
  - [x] Add imports: `CardSet`, `CardType`, `Nationality`, `Rarity` from `$lib/types/cardTypes`

- [x] Add `SET_LABEL` constant to `src/lib/utils/setUtils.ts` (AC: 1, 2)
  - [x] `export const SET_LABEL: Record<string, string> = { PPSM: 'Spanish Main', PPCC: 'Crimson Coast', PPRV: 'Revolution' }`
  - [x] Import this in FilterSidebar for dropdown option labels and chip labels

- [x] Create `src/lib/components/filters/SearchInput.svelte` (AC: 6)
  - [x] Props: `{ value: string; onchange: (v: string) => void }`
  - [x] DaisyUI `input input-sm w-full` styled input
  - [x] 150ms debounce: use `setTimeout`/`clearTimeout` inside `oninput` handler — NOT a separate debounce library
  - [x] Calls `onchange(e.target.value)` after debounce delay
  - [x] Placeholder: `"Search name or ability…"`
  - [x] No submit button — search triggers on input

- [x] Create `src/lib/components/filters/FilterChip.svelte` (AC: 2, 3, 4, 6)
  - [x] Props: `{ label: string; onremove: () => void }`
  - [x] Renders DaisyUI `badge badge-sm` with label text + ✕ button
  - [x] ✕ button: `onclick={onremove}` callback prop (Svelte 5 pattern — NOT `createEventDispatcher`)
  - [x] Compact styling: small badge, tight padding

- [x] Create `src/lib/components/filters/FilterSidebar.svelte` (AC: 1–6)
  - [x] No props — reads and writes `filterState` directly (same pattern as `CardTable`)
  - [x] Import `filterState` from `$lib/state/filterState.svelte`
  - [x] Import `cardData` from `$lib/state/cardData.svelte` — for total card count
  - [x] Import `SearchInput` from `./SearchInput.svelte`
  - [x] Import `FilterChip` from `./FilterChip.svelte`
  - [x] Import `SET_LABEL` from `$lib/utils/setUtils`
  - [x] Layout: `flex flex-col gap-4 p-4 h-full`
  - [x] **Search section**: `<SearchInput value={filterState.searchText} onchange={(v) => { filterState.searchText = v; }} />`
  - [x] **Dropdowns section**: 4 `<select>` elements (DaisyUI `select select-sm w-full`)
    - [x] Set dropdown: "All" option (value='') + PPSM/PPCC/PPRV with SET_LABEL display names
    - [x] Type dropdown: "All" option + Ship/Crew/Treasure/Fort/Event
    - [x] Nationality dropdown: "All" option + English/Spanish/Pirates/French/American/Barbary
    - [x] Rarity dropdown: "All" option + Common/Uncommon/Rare/Super Rare/Limited Edition/Common Treasure/Treasure/Super Rare Treasure
  - [x] Bind each select: `bind:value={filterState.selectedSet}` etc.
  - [x] **Active chips section**: render one `<FilterChip>` per active filter, with remove handler setting that filter back to ''
  - [x] **"Clear All" button**: `{#if filterState.activeFilterCount > 0}` — DaisyUI `btn btn-ghost btn-xs`, calls `filterState.clearAllFilters()`
  - [x] **Result count**: `<p class="text-xs text-neutral-500 mt-auto">Showing {filterState.filteredCards.length} of {cardData.cards.length} cards</p>` — at bottom of sidebar

- [x] Update `src/routes/+page.svelte` — wire in FilterSidebar (AC: 1)
  - [x] Add `import FilterSidebar from '$lib/components/filters/FilterSidebar.svelte'`
  - [x] Replace `<div class="p-4 text-sm opacity-40">Filters coming in Story 2.3</div>` with `<FilterSidebar />`

- [x] Verify AC compliance
  - [x] `npm run check` — zero TypeScript errors
  - [x] `npm run build` — clean build
  - [x] `npm run test:unit` — all existing tests pass (no regressions)
  - [x] Manual: apply Set filter → table updates instantly, chip appears
  - [x] Manual: apply Type + Nationality → AND logic works, 2 chips shown
  - [x] Manual: "Clear All" resets all filters and chips
  - [x] Manual: text search filters name + ability, chip shows
  - [x] Manual: zero-results state shows empty state message in table
  - [x] Manual: result count in sidebar updates correctly

- Review Follow-ups (AI)
  - [x] [AI-Review][MEDIUM] Fix phantom search chip: `activeFilterCount` in `filterState.svelte.ts:19` counts whitespace-only `searchText` as active. Use `this.searchText.trim()` in the array to match `filteredCards` trimming logic [`filterState.svelte.ts:19`]
  - [x] [AI-Review][MEDIUM] Add number formatting to result count: UX7 spec shows comma-separated numbers ("5,231"). Use `.toLocaleString()` on both counts in FilterSidebar [`FilterSidebar.svelte:119`]
  - [x] [AI-Review][MEDIUM] Add `aria-label="Search name or ability"` to the search input for screen reader accessibility — `placeholder` is not a reliable accessible name per WCAG [`SearchInput.svelte:19`]
  - [x] [AI-Review][MEDIUM] Change "Nat:" chip label to "Nationality:" for consistency with other chip labels ("Set:", "Type:", "Rarity:") [`FilterSidebar.svelte:89`]
  - [x] [AI-Review][LOW] Clean up debounce timer on component destroy — add `onDestroy(() => clearTimeout(timer))` or `$effect` cleanup to prevent post-unmount callback [`SearchInput.svelte:8`]
  - [x] [AI-Review][LOW] Strengthen `SET_LABEL` and `SET_CLASS` typing from `Record<string, string>` to `Record<CardSet, string>` for compile-time key validation [`setUtils.ts:1,7`]
  - [x] [AI-Review][LOW] Consider extracting filter/search logic to `filterUtils.ts` with co-located tests per architecture spec — currently inline in Svelte state module and untestable in isolation [`filterState.svelte.ts:28-36`]

## Dev Notes

### CRITICAL: What Already Exists — Do NOT Recreate

**`filterState.svelte.ts` (EXISTS — EXTEND IT, do not create a new file):**
```typescript
// src/lib/state/filterState.svelte.ts — current state (Story 2.2)
class FilterStateStore {
  sortColumn = $state<SortColumn>('pointValue');
  sortDirection = $state<SortDirection>('desc');
  // Story 2.3 will add: sets, types, nationalities, rarities, searchText filters here

  filteredCards = $derived.by<Card[]>(() => {
    // Story 2.3 will add filter application before sort
    const cards = [...cardData.cards];
    return cards.sort(...); // sort-only logic
  });

  setSort(column: SortColumn) { ... }
}
export const filterState = new FilterStateStore();
```
Add 5 new `$state` properties and `clearAllFilters()` to this class. Update the `filteredCards` derived to filter before sorting.

**`setUtils.ts` (EXISTS — ADD to it, do not replace):**
```typescript
// src/lib/utils/setUtils.ts — current
export const SET_CLASS: Record<string, string> = {
  PPSM: 'bg-set-spanish-main',
  PPCC: 'bg-set-crimson-coast',
  PPRV: 'bg-set-revolution'
};
// ADD this:
export const SET_LABEL: Record<string, string> = {
  PPSM: 'Spanish Main',
  PPCC: 'Crimson Coast',
  PPRV: 'Revolution'
};
```

**`src/lib/components/filters/` directory does NOT exist yet — create it.**

**`src/lib/components/cards/CardRow.svelte` (DO NOT TOUCH):**
The card row was visually redesigned in the sandbox merge (commit `fbeae75`). Ships now use a layered absolute-position design with PNG stat icons and Cinzel typography. Non-ships use flat flex layout. Do not modify CardRow for this story.

**`cardData.svelte.ts` (DO NOT TOUCH):**
```typescript
// Already exports:
export const cardData = new CardDataStore();
// cardData.cards — full array
// cardData.cards.length — total count for "Showing X of Y"
```

### filterState.svelte.ts — Full Updated Pattern

```typescript
import type { Card, CardSet, CardType, Nationality, Rarity } from '$lib/types/cardTypes';
import { cardData } from '$lib/state/cardData.svelte';

export type SortColumn = 'pointValue' | 'name' | 'type' | 'cardSet' | 'nationality';
export type SortDirection = 'asc' | 'desc';

class FilterStateStore {
  // --- Sort state (from Story 2.2, unchanged) ---
  sortColumn = $state<SortColumn>('pointValue');
  sortDirection = $state<SortDirection>('desc');

  // --- Filter state (Story 2.3) ---
  selectedSet = $state<CardSet | ''>('');
  selectedType = $state<CardType | ''>('');
  selectedNationality = $state<Nationality | ''>('');
  selectedRarity = $state<Rarity | ''>('');
  searchText = $state<string>('');

  activeFilterCount = $derived(
    [this.selectedSet, this.selectedType, this.selectedNationality, this.selectedRarity, this.searchText]
      .filter(Boolean).length
  );

  filteredCards = $derived.by<Card[]>(() => {
    let cards = [...cardData.cards];

    // Apply filters (AND logic — each non-empty filter narrows results)
    if (this.selectedSet) cards = cards.filter((c) => c.cardSet === this.selectedSet);
    if (this.selectedType) cards = cards.filter((c) => c.type === this.selectedType);
    if (this.selectedNationality) cards = cards.filter((c) => c.nationality === this.selectedNationality);
    if (this.selectedRarity) cards = cards.filter((c) => c.rarity === this.selectedRarity);
    if (this.searchText.trim()) {
      const q = this.searchText.toLowerCase().trim();
      cards = cards.filter(
        (c) => c.name.toLowerCase().includes(q) || c.ability.toLowerCase().includes(q)
      );
    }

    // Apply sort (same logic as Story 2.2)
    const col = this.sortColumn;
    const dir = this.sortDirection === 'asc' ? 1 : -1;
    return cards.sort((a, b) => {
      if (col === 'pointValue') return (a.pointValue - b.pointValue) * dir;
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
      this.sortDirection = column === 'pointValue' ? 'desc' : 'asc';
    }
  }

  clearAllFilters() {
    this.selectedSet = '';
    this.selectedType = '';
    this.selectedNationality = '';
    this.selectedRarity = '';
    this.searchText = '';
    // NOTE: intentionally does NOT reset sortColumn/sortDirection
  }
}

export const filterState = new FilterStateStore();
```

**CRITICAL — Svelte 5 class-based store constraint:** Do NOT export `selectedSet`, `filteredCards`, etc. as module-level `$state`/`$derived` variables. They must be class properties. This is `state_invalid_export` / `derived_invalid_export` — hard runtime error.

### SearchInput — Debounce Pattern

150ms debounce using plain `setTimeout`/`clearTimeout`. No external library needed.

```svelte
<!-- src/lib/components/filters/SearchInput.svelte -->
<script lang="ts">
  interface Props {
    value: string;
    onchange: (v: string) => void;
  }
  const { value, onchange }: Props = $props();

  let timer: ReturnType<typeof setTimeout>;

  function handleInput(e: Event) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      onchange((e.target as HTMLInputElement).value);
    }, 150);
  }
</script>

<input
  type="search"
  class="input input-sm w-full"
  placeholder="Search name or ability…"
  {value}
  oninput={handleInput}
/>
```

**Note:** Use `oninput` not `onchange` — `onchange` fires only on blur in HTML. Use `oninput` for real-time (debounced) filtering.

### FilterSidebar — Assembly Pattern

```svelte
<!-- src/lib/components/filters/FilterSidebar.svelte -->
<script lang="ts">
  import { filterState } from '$lib/state/filterState.svelte';
  import { cardData } from '$lib/state/cardData.svelte';
  import { SET_LABEL } from '$lib/utils/setUtils';
  import SearchInput from './SearchInput.svelte';
  import FilterChip from './FilterChip.svelte';
</script>

<div class="flex h-full flex-col gap-4 p-4">
  <!-- Search -->
  <SearchInput
    value={filterState.searchText}
    onchange={(v) => { filterState.searchText = v; }}
  />

  <!-- Dropdowns -->
  <div class="flex flex-col gap-3">
    <div>
      <label class="label label-text text-xs">Expansion Set</label>
      <select bind:value={filterState.selectedSet} class="select select-sm w-full">
        <option value="">All</option>
        <option value="PPSM">{SET_LABEL.PPSM}</option>
        <option value="PPCC">{SET_LABEL.PPCC}</option>
        <option value="PPRV">{SET_LABEL.PPRV}</option>
      </select>
    </div>
    <!-- ... Type, Nationality, Rarity dropdowns same pattern ... -->
  </div>

  <!-- Active filter chips -->
  {#if filterState.activeFilterCount > 0}
    <div class="flex flex-wrap gap-1">
      {#if filterState.selectedSet}
        <FilterChip label="Set: {SET_LABEL[filterState.selectedSet]}" onremove={() => { filterState.selectedSet = ''; }} />
      {/if}
      {#if filterState.selectedType}
        <FilterChip label="Type: {filterState.selectedType}" onremove={() => { filterState.selectedType = ''; }} />
      {/if}
      {#if filterState.selectedNationality}
        <FilterChip label="Nat: {filterState.selectedNationality}" onremove={() => { filterState.selectedNationality = ''; }} />
      {/if}
      {#if filterState.selectedRarity}
        <FilterChip label="Rarity: {filterState.selectedRarity}" onremove={() => { filterState.selectedRarity = ''; }} />
      {/if}
      {#if filterState.searchText}
        <FilterChip label='Search: "{filterState.searchText}"' onremove={() => { filterState.searchText = ''; }} />
      {/if}
    </div>
    <button class="btn btn-ghost btn-xs self-start" onclick={() => filterState.clearAllFilters()}>
      Clear All
    </button>
  {/if}

  <!-- Result count — mt-auto pushes to bottom -->
  <p class="mt-auto text-xs text-neutral-500">
    Showing {filterState.filteredCards.length} of {cardData.cards.length} cards
  </p>
</div>
```

### FilterChip Pattern

```svelte
<!-- src/lib/components/filters/FilterChip.svelte -->
<script lang="ts">
  interface Props {
    label: string;
    onremove: () => void;
  }
  const { label, onremove }: Props = $props();
</script>

<span class="badge badge-sm badge-neutral gap-1">
  {label}
  <button class="hover:text-error" onclick={onremove} aria-label="Remove filter">✕</button>
</span>
```

### DaisyUI v5 Classes in Use

- `input input-sm` — search input field
- `select select-sm` — filter dropdowns
- `label label-text` — dropdown labels
- `badge badge-sm badge-neutral` — filter chips
- `btn btn-ghost btn-xs` — Clear All button
- `data-theme="dark"` is already on the root layout div — all DaisyUI components render dark by default

### Types Available (cardTypes.ts)

```typescript
export type CardSet = 'PPSM' | 'PPCC' | 'PPRV';
export type CardType = 'Ship' | 'Crew' | 'Treasure' | 'Fort' | 'Event';
export type Nationality = 'English' | 'Spanish' | 'Pirates' | 'French' | 'American' | 'Barbary';
export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Super Rare' | 'Limited Edition'
  | 'Common Treasure' | 'Treasure' | 'Super Rare Treasure';
```

**Note:** `Nationality` does NOT include 'Barbary Corsair' — it is `'Barbary'`. Use exact type values as option values in selects.

### Result Count — Avoid Duplication

`CardTable.svelte` already shows `{filterState.filteredCards.length} cards` in its sort header row (from Story 2.2). The `FilterSidebar` adds the more descriptive "Showing X of Y cards" format at the bottom of the sidebar. Both read from the same `filterState.filteredCards` reactive state — they stay in sync automatically.

Do NOT add another count display to `CardTable`. The sort header count in CardTable is intentional and complementary.

### bind:value on filterState Properties

`bind:value={filterState.selectedSet}` works in Svelte 5 because `selectedSet` is a `$state` class property accessed through a reactive singleton. When the `<select>` value changes, `filterState.selectedSet` updates, which triggers `filteredCards` to recompute, which updates `CardTable` — all synchronously in the same microtask. No manual event dispatching needed.

### +page.svelte — Minimal Change

```svelte
<!-- Before (Story 2.2 placeholder): -->
<div class="p-4 text-sm opacity-40">Filters coming in Story 2.3</div>

<!-- After (Story 2.3): -->
<FilterSidebar />
```

Also add to script:
```typescript
import FilterSidebar from '$lib/components/filters/FilterSidebar.svelte';
```

No other changes to `+page.svelte` — the `SidebarLayout`, `CardTable`, `cardData.setCards`, and `$effect.pre` remain unchanged.

### Recent Visual Rework — Do Not Touch These Files

The sandbox merge (`fbeae75`) significantly reworked the visual components. These are complete and must NOT be modified:
```
src/lib/components/cards/CardRow.svelte       ← layered ship design + PNG icons
src/lib/components/cards/StatBar.svelte       ← PNG icon mini-pills
src/lib/components/cards/MoveDisplay.svelte   ← NEW from sandbox (Cinzel typography pill)
src/lib/components/cards/CannonDisplay.svelte ← PNG cannon pips
src/lib/components/cards/PointBadge.svelte    ← 59×59px
src/lib/components/icons/**                   ← all icon components (PNG-based)
src/routes/sandbox/+page.svelte               ← keep as-is (design reference)
```

### File Structure for This Story

**Files to EXTEND (do not recreate):**
```
src/lib/state/filterState.svelte.ts   EXTEND: add 5 filter state props + clearAllFilters() + update filteredCards
src/lib/utils/setUtils.ts             EXTEND: add SET_LABEL export
```

**Files to CREATE:**
```
src/lib/components/filters/FilterSidebar.svelte  (NEW — main filter panel)
src/lib/components/filters/FilterChip.svelte     (NEW — active filter chip)
src/lib/components/filters/SearchInput.svelte    (NEW — debounced search input)
```

**Files to MODIFY:**
```
src/routes/+page.svelte   MODIFY: import FilterSidebar, replace placeholder with <FilterSidebar />
```

**Files NOT to Modify:**
```
src/lib/components/cards/**              (visual rework complete — do not touch)
src/lib/components/icons/**             (complete — do not touch)
src/lib/components/layout/**            (SidebarLayout sets up 240px sidebar — correct as-is)
src/lib/state/cardData.svelte.ts        (complete)
src/lib/utils/cardUtils.ts             (complete)
src/lib/types/cardTypes.ts             (complete)
src/app.css                            (complete — bg-set-* classes defined)
src/routes/+layout.svelte              (do not touch)
```

### Testing Notes

- `@testing-library/svelte` is NOT installed (confirmed in Story 2.2 debug log)
- Tests should be pure Vitest logic tests, not component render tests
- Primary validation: `npm run check` (TypeScript), `npm run build` (clean build), `npm run test:unit` (no regressions)
- No new test file required for this story (filter logic is covered by TypeScript + manual testing)
- If you write a test file, co-locate it: `src/lib/state/filterState.test.ts`

### Architecture Guardrails (from architecture.md)

- `FilterSidebar` reads AND writes `filterState` directly — NOT via props (architecture mandates this)
- Callback props over `createEventDispatcher` — `FilterChip` uses `onremove: () => void` prop
- No `style=` attributes for static values — use Tailwind utilities
- No Svelte 4 `writable`/`readable` stores — runes only
- Tabs for indentation (Prettier `.prettierrc useTabs: true`)
- All new files: `interface Props { ... }` TypeScript interface pattern for `$props()`

### Project Structure Notes

- FilterSidebar lives at `src/lib/components/filters/FilterSidebar.svelte` — confirmed by architecture.md component organization
- `SidebarLayout`'s `<aside>` is already `w-72 shrink-0 overflow-y-auto border-r` (from Story 2.1) — no layout changes needed
- FilterSidebar fills the full aside height via `h-full` — use `mt-auto` on result count to push it to the bottom

### References

- [Source: epics.md#Story 2.3] — User story + acceptance criteria
- [Source: ux-design-specification.md#FilterSidebar] — Sidebar anatomy, dropdown pattern, chip design, result count
- [Source: ux-design-specification.md#SearchInput] — 150ms debounce, searches name + ability
- [Source: ux-design-specification.md#FilterChip] — DaisyUI badge + × remove button
- [Source: architecture.md#Frontend Architecture — State Management] — Class-based store pattern mandatory
- [Source: architecture.md#Component Boundaries] — FilterSidebar reads/writes filterState directly (not via props)
- [Source: architecture.md#Implementation Patterns — Component Patterns] — $props() with TypeScript interface
- [Source: architecture.md#Implementation Patterns — Styling Patterns] — DaisyUI select for dropdowns
- [Source: 2-2-card-browse-table-with-build-sheet-rows.md#Dev Notes] — filterState.svelte.ts class pattern, SET_CLASS in setUtils.ts
- [Source: 2-2-card-browse-table-with-build-sheet-rows.md#Completion Notes] — @testing-library/svelte absent, SET_CLASS extracted to setUtils.ts
- [Source: src/lib/state/filterState.svelte.ts] — Current class structure to extend (sort state + filteredCards)
- [Source: src/lib/types/cardTypes.ts] — CardSet, CardType, Nationality, Rarity exact type values for select options
- [Source: src/lib/utils/setUtils.ts] — SET_CLASS exists; add SET_LABEL alongside it
- [Source: src/lib/components/cards/CardRow.svelte] — Ship layered design, non-ship flat; do not modify

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

None.

### Completion Notes List

- Extended `filterState.svelte.ts` with 5 new `$state` filter properties (`selectedSet`, `selectedType`, `selectedNationality`, `selectedRarity`, `searchText`), `activeFilterCount` derived, updated `filteredCards` derived to apply AND-logic filters before sort, and added `clearAllFilters()` method. Imports for `CardSet`, `CardType`, `Nationality`, `Rarity` types added.
- Added `SET_LABEL` export to `setUtils.ts` alongside existing `SET_CLASS`.
- Created `SearchInput.svelte` with 150ms `setTimeout`/`clearTimeout` debounce using `oninput` (not `onchange`). DaisyUI `input input-sm w-full`.
- Created `FilterChip.svelte` with DaisyUI `badge badge-sm badge-neutral`, callback prop `onremove: () => void` (Svelte 5 pattern).
- Created `FilterSidebar.svelte` with search input, 4 labeled dropdowns (for/id pairs for a11y), active filter chips section, Clear All button (conditional on `activeFilterCount > 0`), and result count pushed to bottom via `mt-auto`.
- Updated `+page.svelte`: replaced placeholder div with `<FilterSidebar />`, added import.
- All `<label>` elements given `for` + `id` attributes to eliminate a11y warnings — `npm run check` passes with 0 errors/0 warnings.
- `npm run build` clean. `npm run test:unit` 17/17 passing, no regressions.
- ✅ Resolved review finding [MEDIUM]: Fixed phantom search chip — `activeFilterCount` now uses `this.searchText.trim()` to match `filteredCards` trim logic.
- ✅ Resolved review finding [MEDIUM]: Added `.toLocaleString()` to result count in `FilterSidebar.svelte` for comma-separated number formatting.
- ✅ Resolved review finding [MEDIUM]: Added `aria-label="Search name or ability"` to `SearchInput.svelte` for WCAG-compliant accessible name.
- ✅ Resolved review finding [MEDIUM]: Changed "Nat:" chip label to "Nationality:" for consistency with other chip labels.
- ✅ Resolved review finding [LOW]: Added `onDestroy(() => clearTimeout(timer))` to `SearchInput.svelte` to prevent post-unmount timer callbacks.
- ✅ Resolved review finding [LOW]: Strengthened `SET_CLASS` and `SET_LABEL` typing to `Record<CardSet, string>` in `setUtils.ts`. Fixed `CardRow.test.ts` which used loose `string` indexing (now uses `as const` and explicit cast for unknown-key test).
- ✅ Resolved review finding [LOW]: Extracted filter/search predicate logic to `src/lib/utils/filterUtils.ts` (`applyFilters` function + `FilterCriteria` interface). Added 11-test co-located `filterUtils.test.ts`. `filterState.svelte.ts` now delegates to `applyFilters`. `npm run test:unit` 28/28 passing.

### File List

- `src/lib/state/filterState.svelte.ts` — extended with filter state, derived count, updated filteredCards, clearAllFilters(); now delegates filter logic to filterUtils
- `src/lib/utils/setUtils.ts` — added SET_LABEL export; strengthened SET_CLASS and SET_LABEL typing to Record<CardSet, string>
- `src/lib/utils/filterUtils.ts` — new: applyFilters() function + FilterCriteria interface (extracted from filterState)
- `src/lib/utils/filterUtils.test.ts` — new: 11 unit tests for applyFilters (set, type, nationality, rarity, search, AND logic, edge cases)
- `src/lib/components/filters/SearchInput.svelte` — new: debounced search input; added aria-label, onDestroy cleanup
- `src/lib/components/filters/FilterChip.svelte` — new: active filter chip with remove callback
- `src/lib/components/filters/FilterSidebar.svelte` — new: main filter sidebar panel; "Nat:" → "Nationality:", toLocaleString() on result count
- `src/lib/components/cards/CardRow.test.ts` — updated unknown-key test to use explicit cast (required by stronger Record<CardSet, string> typing)
- `src/routes/+page.svelte` — wired FilterSidebar, removed placeholder
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — updated 2-3 status to review
- `_bmad-output/implementation-artifacts/2-3-filter-sidebar-all-filter-dimensions.md` — story file updated

## Change Log

- Initial implementation of FilterSidebar, FilterChip, SearchInput, filter state extensions — all ACs satisfied (Date: 2026-02-27)
- Addressed code review findings — 7 items resolved (4 Medium, 3 Low) (Date: 2026-03-01)
