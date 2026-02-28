---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-02-27'
inputDocuments:
  - '_bmad-output/planning-artifacts/product-brief-PiratesWeb-2026-02-26.md'
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - 'docs/legacy-reference/index.md'
  - 'docs/legacy-reference/project-overview.md'
workflowType: 'architecture'
project_name: 'PiratesWeb'
user_name: 'Captain'
date: '2026-02-27'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
39 requirements across 5 categories and 3 delivery phases. Phase 1 (Card Browser MVP) covers card browsing, filtering, text search, card detail view, and the XML-to-JSON data pipeline. Phase 2 adds the ship-centric fleet builder with local storage persistence. Phase 3 adds the rules enforcement engine with graceful handling of unimplemented rules. The phased structure means each phase must stand alone as a coherent user experience.

**Non-Functional Requirements:**

- Perceived-instant filter response for in-memory queries over 5000+ records
- Progressive image loading (lazy thumbnails, full images on demand, browser caching)
- Static site deployment — zero infrastructure cost, zero runtime dependencies
- Modern browser support (Chrome, Firefox, Safari, Edge) — no legacy browser requirements
- Desktop-first layout, functional on mobile but not optimized

**Scale & Complexity:**

- Primary domain: Static web SPA (SvelteKit + adapter-static)
- Complexity level: Low-Medium (low backend complexity, meaningful UI/data component surface)
- Estimated architectural components: 6 major
  1. Build-time data pipeline (XML → JSON conversion)
  2. Image serving & optimization (424 JPGs, thumbnails, lazy loading)
  3. In-memory filter/sort engine (~5000 records, instant response)
  4. Card Browser UI layer (~14 domain-specific Svelte components)
  5. Fleet Builder UI layer (Phase 2, ship-centric hierarchy, localStorage)
  6. Rules Engine (Phase 3, pluggable from Phase 2)

### Technical Constraints & Dependencies

- **SvelteKit + adapter-static** — Already decided. SSR must be disabled; all data available at build time. No server-side rendering in production.
- **Tailwind CSS + DaisyUI** — Already decided in UX spec. Design system foundation.
- **Legacy XML source data** — PiratesCards.xml (437 KB, ~5000+ entries) is the sole card data source. XSD schema (CardData.xsd) documents the data model. Conversion must be lossless and produce a well-typed JSON schema.
- **424 JPGs organized by set prefix** — Filename convention (PPSM*\*, PPCC*_, PPRV\__) is the image-to-card mapping mechanism. No renaming or restructuring of images assumed.
- **No backend, no runtime API** — All data at build time. No server to query.
- **Browser localStorage** — Only client-side persistence mechanism available.

### Cross-Cutting Concerns Identified

- **Data fidelity** — XML-to-JSON conversion correctness and image-to-card mapping accuracy underpin everything; a single wrong data point breaks user trust irreparably.
- **Perceived performance** — In-memory filtering of 5000+ records, virtual scroll for large result sets, and lazy image loading all require deliberate implementation to achieve the "instant" feel the UX spec mandates.
- **Phase extensibility** — Rules engine must be architecturally present (as a stub) in Phase 2 so Phase 3 can add rule implementations without refactoring fleet builder.
- **Component reuse** — CardRow and stat display components must work in both the browse table and the Phase 2 fleet builder panel without duplication.
- **Design system consistency** — Game-native visual tokens (set colors, cannon display, stat icons) must be defined once and consumed consistently across all components.

## Starter Template Evaluation

### Primary Technology Domain

Static web SPA — SvelteKit with adapter-static, all data bundled at build time, no server-side runtime.

### Starter Options Considered

The official Svelte CLI (`npx sv create`) is the standard, actively maintained scaffolding tool for SvelteKit 2.x projects. No third-party starters evaluated — the official CLI covers all requirements including TypeScript, Tailwind CSS v4, adapter-static, testing, linting, and formatting in a single command. All required add-ons are first-party supported.

### Selected Starter: Official Svelte CLI (`npx sv create`)

**Rationale for Selection:**
All technology decisions (SvelteKit, TypeScript, Tailwind, adapter-static) were pre-decided in the PRD and UX spec. The official CLI scaffolds all of them directly. No custom or community starter adds value over the official tooling for this stack.

**Initialization Command:**

```bash
npx sv create pirates-web \
  --template minimal \
  --types ts \
  --add tailwindcss eslint prettier vitest playwright \
  --add sveltekit-adapter="adapter:static"
```

Post-initialization (DaisyUI):

```bash
npm install -D daisyui@latest
# Add to src/app.css: @plugin "daisyui";
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
TypeScript with strict mode. `$lib` alias for `src/lib/` — all shared code, components, stores, utilities, and types live here.

**Styling Solution:**
Tailwind CSS v4 via Vite plugin (CSS-first configuration — no `tailwind.config.js`). Custom tokens (set colors, typography scale, spacing) defined in `app.css` using `@theme` directive. DaisyUI v5 layered on top via `@plugin "daisyui"` for standard UI components (dropdowns, modals, buttons).

**Build Tooling:**
Vite 6 with SvelteKit 2.53.x. adapter-static 3.x outputs a fully static build to `/build`. `prerender = true` set in root `+layout.ts`. SPA mode via `fallback: 'index.html'` for client-side routing on static hosts.

**Testing Framework:**
Vitest for unit tests (data pipeline, filter logic, rules engine). Playwright for e2e tests (browsing flows, fleet builder interactions).

**Code Organization:**
SvelteKit file-based routing under `src/routes/`. Shared code under `src/lib/` (components, stores, utils, types, data). Static assets under `static/` (card images, nationality flags). Build-time scripts under `scripts/` (XML-to-JSON conversion).

**Development Experience:**
Vite HMR, TypeScript checking via `svelte-check`, ESLint + Prettier preconfigured. Import path aliases (`$lib`) prevent deep relative imports.

**Svelte 5 Reactivity Model:**
Runes-based reactivity (`$state`, `$derived`, `$effect`) replaces Svelte 4's `let`/`$:` syntax. This affects all store and component design decisions in later steps.

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**

- JSON schema design (single cards.json)
- XML-to-JSON conversion approach (pre-committed)
- Image optimization strategy (pre-generated WebP thumbnails)
- State management approach (Svelte 5 runes only)
- Rules engine extensibility contract (validation function array)

**Important Decisions (Shape Architecture):**

- Card detail UX pattern (inline expansion, per UX spec)
- Hosting platform (GitHub Pages, with re-hosting available if needed)

**Deferred Decisions (Post-MVP):**

- CDN/image performance optimization (revisit if needed after GitHub Pages)
- Mobile-optimized layout
- Shareable fleet links

### Data Architecture

**JSON Schema — Single File**

- Decision: All card data in a single `static/data/cards.json`
- Rationale: ~150KB gzipped is trivial to load upfront. In-memory filtering stays fully synchronous — no async loading states, no fetch coordination, no edge cases when combining filters across sets. Loaded once, cached by the browser indefinitely.
- Provided by starter: No — custom implementation required

**XML-to-JSON Conversion — Pre-committed Output**

- Decision: Convert once via `scripts/convert.ts`, commit `static/data/cards.json` to the repository. Re-run the script only if source data changes.
- Rationale: The source XML (PiratesCards.xml) is stable — the game is out of print and no new sets are forthcoming. Committing the output makes it a first-class reviewable artifact, eliminates build-time conversion complexity, and ensures the exact data served is always visible in version history. The conversion script lives in `scripts/` for re-runs and documentation.
- Provided by starter: No — custom Node.js/TypeScript script required

**Image Optimization — Pre-generated WebP Thumbnails**

- Decision: Generate WebP thumbnails once via `scripts/generate-thumbnails.ts`, commit to `static/images/thumbs/`. Original JPGs in `static/images/` serve as full-size detail view assets.
- Rationale: Same stability reasoning as JSON conversion — 424 card images are a fixed, immutable set. Pre-generating and committing gives zero build complexity, optimal browser caching (committed files get stable URLs), and ~30-50% size reduction over original JPGs for the browse thumbnail case. WebP with ~200px width is appropriate for card row thumbnails.
- Provided by starter: No — custom image processing script required (sharp)

### Authentication & Security

Not applicable. PiratesWeb is a fully static site with no user accounts, no authentication, no sensitive data, and no server-side execution. Standard browser security model applies (HTTPS on host, no mixed content).

### API & Communication Patterns

Not applicable. All data is bundled at build time. There are no runtime API calls, no external service integrations, and no server communication in any phase of the application.

### Frontend Architecture

**State Management — Svelte 5 Runes Only**

- Decision: Use Svelte 5 runes (`$state`, `$derived`, `$effect`) exclusively. Global state lives in reactive `.svelte.ts` modules under `src/lib/state/`. No Svelte 4-style `writable`/`readable` stores.
- Rationale: Runes are the idiomatic Svelte 5 approach. Reactive `.svelte.ts` modules can be imported across components and behave exactly like local rune state. Mixing store and rune paradigms adds cognitive overhead with no benefit. Key state modules: `filterState.svelte.ts`, `cardData.svelte.ts`, `fleetState.svelte.ts` (Phase 2).
- Provided by starter: Partial — Svelte 5 runes are built-in; module organization is custom
- **Implementation pattern (Story 1.4):** Svelte 5 build constraints prevent exporting reassignable `$state` or `$derived` variables directly from `.svelte.ts` modules (`state_invalid_export`, `derived_invalid_export` errors). The canonical solution is a **class-based store**: define `$state` and `$derived.by()` as class properties, then export a singleton instance. Components import the singleton and access reactive properties on it.
  - Correct import: `import { cardData } from '$lib/state/cardData.svelte'`
  - Correct access: `cardData.cards`, `cardData.cardById`, `cardData.setCards(arr)`
  - Do NOT use: `import { cards, cardById } from '$lib/state/cardData.svelte'` (module-level rune exports are not supported)

**Card Detail Pattern — Inline Expansion**

- Decision: Clicking a card row expands an inline detail panel below the row. No route change, no modal, no page navigation. Only one row expanded at a time.
- Rationale: Confirmed per UX spec Direction A+F. Keeps users in browsing flow, makes the full table width available in Phase 1, and is consistent with the filter-scan-expand mental model the UX spec establishes.
- Provided by starter: No — custom component behavior

**Routing Structure**

- Phase 1: Single route (`/`) for card browser. No card detail routes.
- Phase 2: Add `/fleet` or tab-based mode toggle within the same layout.
- Phase 3: No new routes anticipated.
- SvelteKit file-based routing with `prerender = true` on root layout.

### Infrastructure & Deployment

**Hosting — GitHub Pages**

- Decision: Deploy to GitHub Pages via GitHub Actions on push to `main`.
- Rationale: Zero friction to set up, free, direct Git integration. If card image performance becomes a bottleneck (large asset CDN latency), migration to Cloudflare Pages is straightforward — same static build output, no code changes required.
- SvelteKit adapter-static outputs to `/build`; GitHub Pages serves from `/build` or configured root.

**CI/CD — GitHub Actions**

- Decision: Simple GitHub Actions workflow on push to `main`: install → build → deploy to GitHub Pages.
- No staging environment needed — solo developer, passion project.

### Decision Impact Analysis

**Implementation Sequence:**

1. Project init (`npx sv create`) + DaisyUI setup
2. XML-to-JSON conversion script → commit `cards.json`
3. Image thumbnail generation script → commit thumbnails
4. Card data TypeScript types + data loading module
5. Filter state module (`filterState.svelte.ts`)
6. Core UI components (FilterSidebar, CardTable, CardRow, StatBar, etc.)
7. Inline card detail expansion (CardRowExpanded)
8. GitHub Actions deploy workflow
9. (Phase 2) Fleet state module + BuildPanel components
10. (Phase 2) Rules engine stub (validation function array, empty)
11. (Phase 3) Rules engine implementation

**Cross-Component Dependencies:**

- `cards.json` schema → TypeScript card types → all components
- Card types → filterState logic → FilterSidebar + CardTable
- CardRow component → reused in both CardTable (Phase 1) and BuildPanel (Phase 2)
- Rules engine interface defined in Phase 2 → filled in Phase 3 without touching fleet builder components
- Design tokens (set colors, stat icons) → all card display components

## Implementation Patterns & Consistency Rules

### Critical Conflict Points Identified

7 areas where AI agents could make different implementation choices without explicit rules: file/type naming, JSON schema field naming, Svelte 5 component patterns, component organization, test location, styling tool selection, and error handling approaches.

### Naming Patterns

**File & Directory Naming:**

- Svelte components: PascalCase `.svelte` — `CardRow.svelte`, `FilterSidebar.svelte`
- Rune state modules: camelCase `.svelte.ts` — `filterState.svelte.ts`, `cardData.svelte.ts`
- TypeScript type files: camelCase `.ts` — `cardTypes.ts`, `fleetTypes.ts`
- Utility functions: camelCase `.ts` — `cardUtils.ts`, `filterUtils.ts`
- SvelteKit routes: kebab-case folder names — `src/routes/fleet/`
- Static data files: kebab-case — `cards.json`
- Thumbnail images: match source filename convention with new extension — `PPSM_EC-001.webp`

**TypeScript Naming Conventions:**

- Interfaces / Types: PascalCase — `Card`, `ShipCard`, `FilterState`, `Fleet`
- Enums: PascalCase — `CardType`, `Nationality`, `CardSet`, `Rarity`
- Functions: camelCase — `filterCards()`, `loadCardData()`
- Rune state variables: camelCase — `let filters = $state(...)`
- Module-level constants: SCREAMING_SNAKE_CASE — `MAX_FLEET_POINTS`, `CARD_SETS`

### JSON Card Schema

**Field Naming: camelCase throughout** (converted from XML PascalCase attributes)

```json
{
	"cardId": "5758",
	"cardSet": "PPSM",
	"cardNumber": "EC-001",
	"name": "Admiral Morgan",
	"type": "Crew",
	"rarity": "Rare",
	"nationality": "English",
	"pointValue": 5,
	"imageFilename": "PPSM_EC-001.jpg",
	"ability": "...",
	"description": "...",
	"modifiers": {},
	"details": {}
}
```

**Type-specific fields nested under `details`:**

```json
// Ship
"details": { "masts": 4, "cargo": 6, "baseMove": "S+L", "cannons": ["3S","3S","3L","3L"], "crewSlots": 4 }
// Crew
"details": { "buildBonus": 2, "costReduction": 1, "cargoBonus": 0, "limitCards": [] }
// Fort
"details": { "cannons": ["3S","3S","3L","3L"] }
```

**Missing/inapplicable fields: omitted entirely** (not `null`, not `undefined`). A Treasure card has no `details` key at all.

### Structure Patterns

**Test Location: Co-located with source files**

```
src/lib/utils/filterUtils.ts
src/lib/utils/filterUtils.test.ts
```

**Component Organization: By domain role**

```
src/lib/components/
  cards/        ← CardRow, CardRowExpanded, StatBar, CannonDisplay, PointBadge, NationalityFlag
  filters/      ← FilterSidebar, FilterChip, SearchInput
  layout/       ← AppHeader, SidebarLayout
  fleet/        ← BuildPanel, BuildShipCard, BuildSummary, ModeToggle (Phase 2)
```

**State Module Organization:**

```
src/lib/state/
  cardData.svelte.ts      ← loaded card array, derived lookups by ID
  filterState.svelte.ts   ← active filters, derived filtered+sorted results
  fleetState.svelte.ts    ← fleet builds, localStorage sync (Phase 2 only)
```

### Component Patterns (Svelte 5)

**Props: Always typed via `$props()` with explicit TypeScript interface**

```typescript
// ✅ Correct
interface Props {
	card: Card;
	isExpanded?: boolean;
}
let { card, isExpanded = false }: Props = $props();

// ❌ Wrong — untyped, no defaults declared
let { card, isExpanded } = $props();
```

**Callbacks over Svelte events (Svelte 5 pattern):**

```typescript
// ✅ Correct — callback prop
interface Props {
	onexpand: (cardId: string) => void;
}

// ❌ Wrong — Svelte 4 pattern, do not use
import { createEventDispatcher } from 'svelte';
```

**State access: Components import from state modules directly — no prop-drilling global state more than one level:**

```typescript
// ✅ Correct
import { filterState } from '$lib/state/filterState.svelte';

// ❌ Wrong — passing global state through multiple component layers as props
```

**Data loading: Always in SvelteKit `+page.ts` `load()` functions — never fetch inside components:**

```typescript
// ✅ Correct — src/routes/+page.ts
export async function load(): Promise<{ cards: Card[] }> {
	const res = await fetch('/data/cards.json');
	return { cards: await res.json() };
}
```

### Styling Patterns

**Tool selection hierarchy — use the lowest-level tool that solves the problem:**

1. **Tailwind utilities first** — spacing, color, typography, layout, responsive breakpoints
2. **DaisyUI components second** — buttons, dropdowns, modals, badges, tooltips (standard UI elements)
3. **Custom CSS only** — game-native elements with no standard equivalent (set-colored row backgrounds using texture images, cannon pip circles, stat bar icon layout)

**Set background colors: Always via design token classes, never hardcoded hex or inline styles:**

```html
<!-- ✅ Correct -->
<tr class="bg-set-spanish-main text-set-spanish-main-text">
	<!-- ❌ Wrong -->
</tr>

<tr style="background-color: #c4a882"></tr>
```

**No `style=` attributes** except for genuinely dynamic computed values (e.g., a JS-calculated pixel width). All static visual properties belong in Tailwind/CSS classes.

### Error Handling Patterns

**Missing card images: Render a placeholder, never a broken image icon:**

```svelte
<img src={thumbUrl} alt={card.name} onerror={() => handleImageError(card.cardId)} />
```

**Empty filter results: Display an empty state message — never an error, never a spinner:**

```svelte
{#if filteredCards.length === 0}
	<p class="empty-state">No cards match your current filters.</p>
{/if}
```

**No loading spinners for card data** — `cards.json` is loaded once at page load via SvelteKit's `load()`. If it fails, SvelteKit's error boundary handles it. Components never show loading states for card data.

### Enforcement Guidelines

**All AI agents MUST:**

- Use camelCase for all JSON card schema fields (never PascalCase from the source XML)
- Use `$props()` with explicit TypeScript interfaces for all Svelte 5 components
- Use callback props (not `createEventDispatcher`) for component events
- Place tests co-located with source files (`.test.ts` beside `.ts`)
- Organize components under `src/lib/components/` by domain role subfolder
- Import global state from `src/lib/state/` modules — never prop-drill global state
- Use Tailwind utilities as the first styling choice; DaisyUI second; custom CSS last
- Apply set colors via design token classes, never inline styles or hardcoded values
- Load card data in `+page.ts` `load()` functions, never inside components

**Anti-Patterns to Avoid:**

- PascalCase JSON field names (XML convention does not carry over)
- Svelte 4 `createEventDispatcher` — this project uses Svelte 5 callback props
- Svelte 4 `writable`/`readable` stores — use runes in `.svelte.ts` modules
- Fetching `cards.json` inside a component `onMount` — use SvelteKit `load()`
- Hardcoded set color hex values in component markup
- Global test folders (`__tests__/`) — tests live beside source files

## Project Structure & Boundaries

### Complete Project Directory Structure

```
pirates-web/
├── .github/
│   └── workflows/
│       └── deploy.yml              ← GitHub Actions: build + deploy to Pages
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── package.json
├── svelte.config.js                ← adapter-static config
├── tsconfig.json
├── vite.config.ts
│
├── scripts/                        ← Build-time tooling (not bundled)
│   ├── convert.ts                  ← XML → cards.json conversion (run once)
│   └── generate-thumbnails.ts      ← JPG → WebP thumbnail generation (run once)
│
├── reference/                      ← Source data & schema (not served)
│   ├── PiratesCards.xml            ← Canonical card database (437KB)
│   └── CardData.xsd                ← XML schema definition
│
├── static/                         ← Served as-is by SvelteKit/host
│   ├── favicon.png
│   ├── data/
│   │   └── cards.json              ← Committed output of scripts/convert.ts
│   └── images/
│       ├── cards/                  ← Original JPGs (424 files, PPSM_*, PPCC_*, PPRV_*)
│       ├── thumbs/                 ← WebP thumbnails (committed, generated once)
│       ├── flags/                  ← Nationality flag SVGs/PNGs
│       └── backgrounds/            ← Set texture images (TanBG, RedBG, BlueBG)
│
├── src/
│   ├── app.css                     ← Tailwind v4 @theme tokens + @plugin "daisyui"
│   ├── app.d.ts                    ← SvelteKit ambient type declarations
│   │
│   ├── routes/
│   │   ├── +layout.ts              ← export const prerender = true
│   │   ├── +layout.svelte          ← App shell: AppHeader + SidebarLayout
│   │   ├── +page.ts                ← load(): fetch cards.json → { cards }
│   │   ├── +page.svelte            ← Card browser: FilterSidebar + CardTable
│   │   ├── +error.svelte           ← SvelteKit error boundary page
│   │   └── fleet/                  ← Phase 2
│   │       ├── +page.ts            ← load(): cards + fleet from localStorage
│   │       └── +page.svelte        ← Three-panel: filters + browser + BuildPanel
│   │
│   └── lib/
│       ├── types/
│       │   ├── cardTypes.ts        ← Card, ShipCard, CrewCard, FortCard, etc.
│       │   ├── filterTypes.ts      ← FilterState, SortConfig, SortDirection
│       │   └── fleetTypes.ts       ← Fleet, FleetShip, FleetCrew (Phase 2)
│       │
│       ├── state/
│       │   ├── cardData.svelte.ts      ← $state: cards[], cardById Map
│       │   ├── filterState.svelte.ts   ← $state: filters; $derived: filteredCards
│       │   └── fleetState.svelte.ts    ← $state: fleet; localStorage sync (Phase 2)
│       │
│       ├── utils/
│       │   ├── cardUtils.ts            ← imageUrl(), thumbUrl(), formatMove()
│       │   ├── cardUtils.test.ts
│       │   ├── filterUtils.ts          ← applyFilters(), matchesSearch()
│       │   ├── filterUtils.test.ts
│       │   ├── fleetUtils.ts           ← addShip(), assignCrew(), calcPoints() (Phase 2)
│       │   ├── fleetUtils.test.ts
│       │   ├── rulesEngine.ts          ← ValidationRule[], validateFleet() (Phase 2 stub)
│       │   └── rulesEngine.test.ts
│       │
│       └── components/
│           ├── cards/
│           │   ├── CardTable.svelte         ← Virtual-scrolled list of CardRow
│           │   ├── CardRow.svelte           ← Build-sheet row: badge+thumb+stats+ability
│           │   ├── CardRow.test.ts
│           │   ├── CardRowExpanded.svelte   ← Inline detail: full image + complete stats
│           │   ├── StatBar.svelte           ← Iconic mast/cargo/move display
│           │   ├── CannonDisplay.svelte     ← S/L cannon pip circles
│           │   ├── PointBadge.svelte        ← Oversized bold point cost badge
│           │   ├── NationalityFlag.svelte   ← Flag icon by nationality
│           │   └── TypeBadge.svelte         ← Ship/Crew/Treasure/Fort/Event badge
│           ├── filters/
│           │   ├── FilterSidebar.svelte     ← Left panel: all filters + search + count
│           │   ├── FilterChip.svelte        ← Active filter indicator with clear button
│           │   └── SearchInput.svelte       ← Text search field
│           ├── layout/
│           │   ├── AppHeader.svelte         ← Site header / nav
│           │   └── SidebarLayout.svelte     ← Sidebar + main area two-panel layout
│           └── fleet/                       ← Phase 2
│               ├── BuildPanel.svelte        ← Right panel: fleet hierarchy + totals
│               ├── BuildShipCard.svelte     ← Ship entry with nested crew list
│               ├── BuildSummary.svelte      ← Points used/remaining, card counts
│               └── ModeToggle.svelte        ← Browse / Build tab switcher
│
├── tests/                          ← Playwright e2e tests
│   ├── browse.spec.ts              ← Card browse + scroll
│   ├── filter.spec.ts              ← Filter combinations + text search
│   ├── detail.spec.ts              ← Card row expansion + detail content
│   └── fleet.spec.ts               ← Fleet builder flows (Phase 2)
│
└── build/                          ← Generated by vite build — gitignored
```

### Architectural Boundaries

**Data Boundaries:**

- `reference/PiratesCards.xml` → (scripts/convert.ts, one-time) → `static/data/cards.json`
- `static/data/cards.json` → (SvelteKit load()) → `cardData.svelte.ts` → all components
- `src/lib/state/fleetState.svelte.ts` ↔ `localStorage` (Phase 2, serialize/deserialize on change)
- Components NEVER import from `reference/` or call `fetch()` directly for card data

**Component Boundaries:**

- `+page.svelte` owns the top-level layout; imports `FilterSidebar` and `CardTable`
- `CardTable` owns the list; imports `CardRow`; handles virtual scroll logic
- `CardRow` is a pure display component; emits `onexpand` callback; never touches state directly
- `FilterSidebar` reads and writes `filterState.svelte.ts` directly (not via props)
- `CardRowExpanded` is a pure display component; receives `card` prop only
- `StatBar` and `CannonDisplay` are purely presentational — no state, no side effects

**Rules Engine Boundary (Phase 2 stub → Phase 3 implementation):**

```typescript
// src/lib/utils/rulesEngine.ts
export type ValidationRule = (fleet: Fleet) => ValidationResult[];
export const rules: ValidationRule[] = []; // Phase 2: empty — no rules enforced
export function validateFleet(fleet: Fleet): ValidationResult[] {
	return rules.flatMap((rule) => rule(fleet));
}
// Phase 3: push rule functions into the `rules` array — no other files change
```

### Data Flow

```
Build time:
  PiratesCards.xml → scripts/convert.ts → static/data/cards.json (committed)
  reference/images/*.jpg → scripts/generate-thumbnails.ts → static/images/thumbs/*.webp

Runtime (Phase 1):
  Browser → GET /data/cards.json
  → SvelteKit +page.ts load()
  → cardData.svelte.ts ($state)
  → filterState.svelte.ts ($derived: filteredCards)
  → CardTable → CardRow × N

Runtime (Phase 2 additions):
  fleetState.svelte.ts ↔ localStorage
  rulesEngine.validateFleet() called on every fleet mutation
```

### Requirements to Structure Mapping

**FR1-5 (Card Browsing):**
`src/routes/+page.ts` (load) + `+page.svelte` + `CardTable.svelte` + `CardRow.svelte`

**FR6-14 (Filtering & Search):**
`FilterSidebar.svelte` + `filterState.svelte.ts` + `filterUtils.ts`

**FR15-21 (Card Detail):**
`CardRowExpanded.svelte` + `StatBar.svelte` + `CannonDisplay.svelte` + `cardTypes.ts`

**FR22-24 (Data Pipeline):**
`scripts/convert.ts` → `static/data/cards.json`
`scripts/generate-thumbnails.ts` → `static/images/thumbs/`
`cardUtils.ts` (imageUrl, thumbUrl helpers)

**FR25-33 (Fleet Building — Phase 2):**
`src/routes/fleet/` + `fleetState.svelte.ts` + `fleetUtils.ts` + fleet components

**FR34-39 (Rules Engine — Phase 3):**
`src/lib/utils/rulesEngine.ts` (rules array populated in Phase 3)

### Development Workflow

**One-time setup:**

```bash
npx sv create pirates-web --template minimal --types ts \
  --add tailwindcss eslint prettier vitest playwright \
  --add sveltekit-adapter="adapter:static"
npm install -D daisyui@latest sharp
npx tsx scripts/convert.ts              # generates static/data/cards.json
npx tsx scripts/generate-thumbnails.ts  # generates static/images/thumbs/
```

**Daily development:** `npm run dev` — Vite HMR, all data served from static/

**Build & deploy:** Push to `main` → GitHub Actions → `npm run build` → deploy `/build` to GitHub Pages

## Architecture Validation Results

### Coherence Validation ✅

All technology versions are compatible. SvelteKit 2.53.x + Svelte 5 + Tailwind CSS v4 + DaisyUI v5 + adapter-static 3.x form a coherent, compatible stack. Svelte 5 runes-only state management is internally consistent throughout. Pre-committed data artifacts (cards.json, WebP thumbnails) are coherent with stable source data. GitHub Pages + GitHub Actions is a standard, well-tested deployment combination.

Implementation patterns support all architectural decisions: camelCase JSON fields align with TypeScript conventions; co-located tests align with the no-global-test-folder rule; callback props align with Svelte 5; DaisyUI @plugin aligns with Tailwind v4 CSS-first config.

### Requirements Coverage Validation ✅

All 39 functional requirements are architecturally supported across 6 FR categories. All 5 non-functional requirements (filter performance, image loading, static deployment, browser caching, responsive layout) have explicit architectural provisions.

No functional requirement is left without a mapped file or component.

### Implementation Readiness Validation ✅

All critical decisions are documented with exact versions. The exact initialization command is specified. File naming conventions are comprehensive. Component boundaries are explicit. Data flow is fully traced from source XML to rendered browser card. The rules engine Phase 2 → Phase 3 contract is defined. No ambiguous decisions remain.

### Gap Analysis Results

**Critical Gaps:** None.

**Important Gap — Virtual Scroll:**
CardTable's approach to rendering 5000+ rows is not specified. Decision: begin with native browser rendering + `loading="lazy"` on images. Measure before adding virtual scroll. If DOM size causes performance issues, add `@tanstack/svelte-virtual`. This avoids premature optimization while keeping the path to optimization clear.

**Minor Gap — TypeScript Card Discriminated Union:**
Card type narrowing pattern established here for agent consistency:

```typescript
type CardType = 'Ship' | 'Crew' | 'Treasure' | 'Fort' | 'Event';

interface BaseCard {
	cardId: string;
	cardSet: CardSet;
	cardNumber: string;
	name: string;
	type: CardType;
	rarity: string;
	nationality: string;
	pointValue: number; // Note: tournamentStatus excluded — field is always 'Active' in source data
	imageFilename: string;
	ability: string;
	description: string;
}
interface ShipCard extends BaseCard {
	type: 'Ship';
	details: ShipDetails;
}
interface CrewCard extends BaseCard {
	type: 'Crew';
	details: CrewDetails;
}
interface TreasureCard extends BaseCard {
	type: 'Treasure';
}
interface FortCard extends BaseCard {
	type: 'Fort';
	details: FortDetails;
}
interface EventCard extends BaseCard {
	type: 'Event';
}
type Card = ShipCard | CrewCard | TreasureCard | FortCard | EventCard;
```

Narrowing: `if (card.type === 'Ship') { card.details.masts ... }` — no casting.

### Architecture Completeness Checklist

**✅ Requirements Analysis**

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**

- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Deployment strategy defined
- [x] Performance considerations addressed
- [x] Phase extensibility (rules engine) specified

**✅ Implementation Patterns**

- [x] Naming conventions established (files, types, JSON fields)
- [x] Component patterns specified (Svelte 5 runes, callback props)
- [x] Structure patterns defined (co-located tests, domain-role components)
- [x] Styling patterns documented (Tailwind → DaisyUI → custom CSS hierarchy)
- [x] Error handling patterns specified
- [x] Anti-patterns explicitly documented

**✅ Project Structure**

- [x] Complete directory structure defined (every file named)
- [x] Component boundaries established
- [x] Data flow fully traced
- [x] Requirements to structure mapping complete
- [x] Development workflow documented

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High — all critical decisions made, all requirements covered, no ambiguous implementation paths remain.

**Key Strengths:**

- Pre-committed data artifacts eliminate build complexity entirely
- Svelte 5 runes-only approach prevents paradigm mixing across agents
- Rules engine stub is defined before it's needed — Phase 3 adds zero refactoring
- Complete file tree with named files removes structural guesswork for agents
- Anti-patterns explicitly documented prevent the most common Svelte 4→5 mistakes

**Areas for Future Enhancement:**

- Virtual scroll (add @tanstack/svelte-virtual if DOM performance warrants it)
- CDN migration (Cloudflare Pages if GitHub Pages image CDN is too slow)
- Mobile-optimized layout (deferred, no phase assigned)
- Shareable fleet links (deferred, no phase assigned)

### Implementation Handoff

**AI Agent Guidelines:**

- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently — refer to anti-patterns list
- Respect file structure: every new file belongs in the defined location
- Svelte 5 runes only — no writable/readable stores, no createEventDispatcher
- Card JSON schema is camelCase — never reproduce XML PascalCase field names
- Load card data in +page.ts load() — never fetch inside components

**First Implementation Priority:**

```bash
npx sv create pirates-web --template minimal --types ts \
  --add tailwindcss eslint prettier vitest playwright \
  --add sveltekit-adapter="adapter:static"
npm install -D daisyui@latest sharp
```

Then: XML-to-JSON conversion script → thumbnail generation script → TypeScript types → state modules → UI components.
