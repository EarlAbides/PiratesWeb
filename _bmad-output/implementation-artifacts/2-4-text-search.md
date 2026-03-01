# Story 2.4: Text Search

Status: done

## Story

As a **Pirates CSG fan**,
I want a text search field that filters cards by matching the search term against card names and ability text,
So that I can find any card instantly by typing part of its name or a keyword from its ability (e.g., "HMS" or "helmsman").

## Acceptance Criteria

1. **Given** the search input field is visible in the filter sidebar
   **When** I type a search term
   **Then** the card table updates to show only cards whose name or ability text contains the term (case-insensitive)
   **And** the result count updates to reflect the matched set
   **And** the search interacts with any active filters (text search AND filters, all combined)

2. **Given** an active text search
   **When** I clear the search field
   **Then** the table returns to the pre-search filtered state (other active filters remain)

3. **Given** `src/lib/utils/filterUtils.ts` contains `matchesSearch()`
   **When** I run unit tests
   **Then** `filterUtils.test.ts` passes for: exact match, partial match, case-insensitive match, empty query (returns all), and no-match (returns none)

## Tasks / Subtasks

- [x] Export `matchesSearch(card: Card, query: string): boolean` from `src/lib/utils/filterUtils.ts` (AC: 3)
  - [x] Extract the inline search predicate from `applyFilters()` into a standalone `matchesSearch()` function
  - [x] `matchesSearch` returns `true` when `query.trim()` is empty (no query = all cards match)
  - [x] Checks `card.name.toLowerCase().includes(q)` OR `card.ability.toLowerCase().includes(q)` where `q = query.toLowerCase().trim()`
  - [x] Update `applyFilters()` to call `matchesSearch()` instead of the inline predicate (same behavior, no regression)

- [x] Add `matchesSearch` unit tests to `src/lib/utils/filterUtils.test.ts` (AC: 3)
  - [x] Exact match: query `"HMS Victory"` matches card with name `"HMS Victory"`
  - [x] Partial match: query `"HMS"` matches card with name `"HMS Victory"`
  - [x] Case-insensitive: query `"victory"` matches card with name `"HMS Victory"`
  - [x] Ability text match: query `"boarding"` matches card with ability `"Boarding specialist."`
  - [x] Empty query returns `true` (empty string = no filter, card passes through)
  - [x] No-match: query `"zzzzzz"` returns `false` for all test cards

- [x] Verify AC compliance
  - [x] `npm run check` — zero TypeScript errors
  - [x] `npm run test:unit` — all existing 28 tests pass + new `matchesSearch` tests pass (36/36)
  - [x] `npm run build` — clean build

- [x] Review Follow-ups (AI)
  - [x] [AI-Review][LOW] Remove redundant `query.trim()` in `matchesSearch` — trim once and reuse [filterUtils.ts:12-13]
  - [x] [AI-Review][LOW] Add test: whitespace-padded query `" HMS "` returns true [filterUtils.test.ts]
  - [x] [AI-Review][LOW] Add test: card with empty `ability` string matches on name only [filterUtils.test.ts]
  - [x] [AI-Review][LOW] Add test: `applyFilters` combining searchText + dimension filter (AC1 AND interaction) [filterUtils.test.ts]

## Dev Notes

### CRITICAL: What's Already Done — Do NOT Recreate

Story 2.3 implemented the complete text search UI and state. **Do NOT reimplement any of the following:**

**`SearchInput.svelte` (COMPLETE — do not touch):**
```svelte
<!-- src/lib/components/filters/SearchInput.svelte -->
<!-- 150ms debounced input, oninput not onchange, onDestroy cleanup, aria-label -->
```

**`FilterSidebar.svelte` (COMPLETE — do not touch):**
- Search input is already at the top of the sidebar
- Active search chip already renders as `Search: "{filterState.searchText}"`
- Clear via chip removes `filterState.searchText`

**`filterState.svelte.ts` (COMPLETE — do not touch):**
```typescript
searchText = $state<string>('');
// already included in activeFilterCount via this.searchText.trim()
// filteredCards already delegates to applyFilters() which includes search
```

**`filterUtils.ts` — EXTEND ONLY (add `matchesSearch`, update `applyFilters`):**
```typescript
// Current state of filterUtils.ts:
export interface FilterCriteria { ... }

export function applyFilters(cards: Card[], criteria: FilterCriteria): Card[] {
  // ...set/type/nationality/rarity filters...
  if (criteria.searchText.trim()) {
    const q = criteria.searchText.toLowerCase().trim();
    result = result.filter(
      (c) => c.name.toLowerCase().includes(q) || c.ability.toLowerCase().includes(q)
    );
  }
  return result;
}
```

### What This Story Adds

Extract the inline search predicate into an exported `matchesSearch()` function. The behavior must be identical — this is a pure refactor + export:

```typescript
// Target state of filterUtils.ts after this story:

export interface FilterCriteria { ... } // unchanged

export function matchesSearch(card: Card, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase().trim();
  return card.name.toLowerCase().includes(q) || card.ability.toLowerCase().includes(q);
}

export function applyFilters(cards: Card[], criteria: FilterCriteria): Card[] {
  let result = cards;
  if (criteria.selectedSet) result = result.filter((c) => c.cardSet === criteria.selectedSet);
  if (criteria.selectedType) result = result.filter((c) => c.type === criteria.selectedType);
  if (criteria.selectedNationality)
    result = result.filter((c) => c.nationality === criteria.selectedNationality);
  if (criteria.selectedRarity) result = result.filter((c) => c.rarity === criteria.selectedRarity);
  if (criteria.searchText.trim())
    result = result.filter((c) => matchesSearch(c, criteria.searchText));
  return result;
}
```

**Zero behavior change.** The same filtering logic, just extracted into a named, testable function.

### filterUtils.test.ts — New Tests to Add

Add a `describe('matchesSearch', ...)` block to the existing test file. Do NOT replace the existing `describe('applyFilters', ...)` tests — those stay:

```typescript
import { describe, it, expect } from 'vitest';
import { applyFilters, matchesSearch } from './filterUtils'; // add matchesSearch to import
import type { Card } from '$lib/types/cardTypes';

// ... existing makeCard and cards fixtures stay unchanged ...

describe('matchesSearch', () => {
  const card = makeCard({ name: 'HMS Victory', ability: 'Boarding specialist.' });

  it('returns true when query is empty', () => {
    expect(matchesSearch(card, '')).toBe(true);
  });

  it('returns true when query is whitespace only', () => {
    expect(matchesSearch(card, '   ')).toBe(true);
  });

  it('matches exact card name', () => {
    expect(matchesSearch(card, 'HMS Victory')).toBe(true);
  });

  it('matches partial card name', () => {
    expect(matchesSearch(card, 'HMS')).toBe(true);
  });

  it('is case-insensitive on name', () => {
    expect(matchesSearch(card, 'victory')).toBe(true);
  });

  it('matches ability text', () => {
    expect(matchesSearch(card, 'boarding')).toBe(true);
  });

  it('is case-insensitive on ability', () => {
    expect(matchesSearch(card, 'BOARDING')).toBe(true);
  });

  it('returns false when no match', () => {
    expect(matchesSearch(card, 'zzzzzz')).toBe(false);
  });
});
```

### Architecture Guardrails

- All code follows Svelte 5 / TypeScript patterns established in architecture.md
- `matchesSearch` is a pure function (no side effects, no imports from state modules)
- Tests are co-located: `filterUtils.test.ts` beside `filterUtils.ts` [Source: architecture.md#Test Location]
- Import `matchesSearch` using `$lib` alias in any consumer: `import { matchesSearch } from '$lib/utils/filterUtils'`
- Do NOT modify `filterState.svelte.ts` — it already delegates to `applyFilters()`

### Files Changed by This Story

**File to EXTEND (one function added, one refactored):**
```
src/lib/utils/filterUtils.ts     ADD: matchesSearch(); UPDATE: applyFilters() to call it
src/lib/utils/filterUtils.test.ts  ADD: describe('matchesSearch', ...) block
```

**Files NOT to modify:**
```
src/lib/state/filterState.svelte.ts     — complete, delegates to applyFilters()
src/lib/components/filters/**           — complete (SearchInput, FilterChip, FilterSidebar)
src/lib/components/cards/**             — complete visual rework, do not touch
src/routes/+page.svelte                — complete
src/app.css                            — complete
```

### Testing Notes

- Current test count: 28 passing (`npm run test:unit`)
- Add ~8 new `matchesSearch` tests → expect ~36 passing after this story
- No component render tests — `@testing-library/svelte` is NOT installed
- Primary validation: `npm run check`, `npm run build`, `npm run test:unit`
- `matchesSearch` is a pure function — unit testing is straightforward, no Svelte context needed

### Context: Why Story 2.4 Exists After 2.3 Already Implemented Search

Story 2.3 (Filter Sidebar) went ahead and implemented the complete text search UI and state as part of the sidebar build. The AC for Story 2.3 explicitly included text search (AC 6). Story 2.4 was originally planned to implement text search, but 2.3 did most of it. What remains is:

1. Extracting `matchesSearch()` as a standalone exported function (for testability and single-responsibility)
2. Adding targeted unit tests for `matchesSearch()` specifically

All user-facing behavior is already live. This story completes the code quality requirements from the epics spec.

### References

- [Source: epics.md#Story 2.4] — Text search AC including `matchesSearch()` requirement
- [Source: 2-3-filter-sidebar-all-filter-dimensions.md#Completion Notes] — All search UI implemented in 2.3
- [Source: 2-3-filter-sidebar-all-filter-dimensions.md#File List] — filterUtils.ts and filterUtils.test.ts file list
- [Source: architecture.md#Test Location] — Co-located tests beside source files
- [Source: architecture.md#Naming Patterns] — `filterUtils.ts` follows camelCase utility pattern
- [Source: src/lib/utils/filterUtils.ts] — Current implementation to refactor
- [Source: src/lib/utils/filterUtils.test.ts] — Existing 11 tests (all passing) — extend, don't replace

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

None.

### Completion Notes List

- Extracted inline search predicate from `applyFilters()` into exported `matchesSearch(card: Card, query: string): boolean` pure function. Returns `true` when query is empty/whitespace-only. Checks `name` and `ability` with `toLowerCase().includes()`.
- Updated `applyFilters()` to delegate to `matchesSearch()` — identical behavior, no regressions.
- Added `describe('matchesSearch', ...)` block to `filterUtils.test.ts` with 8 new tests: empty query, whitespace-only query, exact name match, partial name match, case-insensitive name, ability text match, case-insensitive ability, no-match.
- All validation: `npm run check` (0 errors/0 warnings), `npm run test:unit` (36/36 passing, up from 28), `npm run build` (clean).

### File List

- `src/lib/utils/filterUtils.ts` — added `matchesSearch()` export; refactored `applyFilters()` to call it
- `src/lib/utils/filterUtils.test.ts` — added 8-test `describe('matchesSearch', ...)` block
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — updated 2-4 status to review
- `_bmad-output/implementation-artifacts/2-4-text-search.md` — story file updated

## Change Log

- Extracted `matchesSearch()` from `applyFilters()` and added targeted unit tests — all ACs satisfied (Date: 2026-03-01)
