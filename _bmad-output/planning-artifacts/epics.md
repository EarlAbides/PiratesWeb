---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
---

# PiratesWeb - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for PiratesWeb, decomposing the requirements from the PRD, UX Design, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**Card Browsing (Phase 1)**
- FR1: Users can browse a complete card catalog spanning three expansion sets (Spanish Main, Crimson Coast, Revolution)
- FR2: Users can view card thumbnail images alongside card names and key attributes in a browse list
- FR3: Users can browse cards across all sets simultaneously or within a single set
- FR4: Users can paginate or scroll through large result sets without performance degradation
- FR5: The system displays card images using lazy loading, only rendering images as they enter the viewport

**Card Filtering & Search (Phase 1)**
- FR6: Users can filter cards by expansion set (Spanish Main, Crimson Coast, Revolution)
- FR7: Users can filter cards by type (Ship, Crew, Treasure, Fort, Event)
- FR8: Users can filter cards by nationality
- FR9: Users can filter cards by rarity
- ~~FR10: Users can filter cards by tournament status~~ *(excluded — `tournamentStatus` removed from data model)*
- FR11: Users can combine multiple filters simultaneously (e.g., English Ships from Spanish Main)
- FR12: Users can perform text search across card names and ability text
- FR13: Users can clear all active filters to return to the full catalog
- FR14: The system displays the count of matching results when filters are applied

**Card Detail (Phase 1)**
- FR15: Users can view a detailed card panel displaying the full-size card image
- FR16: Users can view all card attributes: card number, name, set, type, rarity, nationality, point value
- FR17: Users can view card ability text and description
- FR18: Users can view ship-specific attributes: masts, cargo capacity, base move, cannons, crew slots
- FR19: Users can view crew-specific attributes: build bonuses, cost reductions, cargo bonuses, limit cards
- FR20: Users can view fort-specific attributes: cannons
- FR21: Users can view card modifiers when present

**Data Pipeline (Phase 1)**
- FR22: The system converts the legacy XML card database to JSON format at build time with zero data loss
- FR23: The system maps all 424 card images to their corresponding card entries by filename convention
- FR24: The system generates thumbnail versions of card images for browse view performance

**Fleet Building (Phase 2)**
- FR25: Users can create a new fleet build
- FR26: Users can add ships to a fleet build
- FR27: Users can assign crew cards to specific ships in the fleet
- FR28: Users can set a fleet point limit
- FR29: The system tracks the running point total of all cards in the fleet against the point limit
- FR30: Users can remove ships or crew from a fleet build
- FR31: Users can save fleet builds to browser local storage
- FR32: Users can load previously saved fleet builds from browser local storage
- FR33: Users can delete saved fleet builds

**Rules Enforcement (Phase 3)**
- FR34: The system validates fleet builds against game rules and displays rule violations
- FR35: The system enforces duplicate card limits per game rules
- FR36: The system enforces crew assignment restrictions (crew-to-ship compatibility)
- FR37: The system enforces card-specific constraints defined in the game rules
- FR38: The system provides clear explanations for each rule violation detected
- FR39: The system gracefully handles cards or interactions where rules are not yet implemented, without blocking the user

### NonFunctional Requirements

- NFR1: Card browse list renders and becomes interactive within perceived-instant response time for the initial page load
- NFR2: Applying or changing filters updates the visible card list without perceptible delay
- NFR3: Text search returns results as the user types (or on submit) without noticeable lag
- NFR4: Card images load progressively — thumbnail placeholders appear immediately, full images load as bandwidth allows
- NFR5: Browser caching ensures repeat visits and navigation between views do not re-download card images
- NFR6: Card detail view renders fully (image + all attributes) without visible layout shift or loading stutter
- NFR7: The application functions correctly on current versions of Chrome, Firefox, Safari, and Edge (no IE11 or legacy browser support)
- NFR8: The application renders acceptably on tablet and mobile screen sizes (functional, not optimized)
- NFR9: Deploys as a static site with zero ongoing infrastructure cost

### Additional Requirements

**From Architecture:**
- AR1: Project must be initialized via the official Svelte CLI (`npx sv create`) with TypeScript, Tailwind CSS v4, adapter-static, ESLint, Prettier, Vitest, and Playwright — this is the first implementation action (Epic 1, Story 1)
- AR2: DaisyUI v5 installed as a Tailwind plugin post-initialization
- AR3: All card data served from a single `static/data/cards.json` committed to the repository
- AR4: XML-to-JSON conversion script (`scripts/convert.ts`) run once; output committed to `static/data/cards.json`
- AR5: WebP thumbnail generation script (`scripts/generate-thumbnails.ts`) run once; output committed to `static/images/thumbs/`
- AR6: GitHub Pages deployment via GitHub Actions CI/CD (push to `main` triggers build and deploy)
- AR7: State management uses Svelte 5 runes (`$state`, `$derived`, `$effect`) exclusively — no Svelte 4 `writable`/`readable` stores, no `createEventDispatcher`
- AR8: Card data loaded in SvelteKit `+page.ts` `load()` functions — never fetched inside components
- AR9: Rules engine stub (`rulesEngine.ts` with empty `ValidationRule[]` array) must be present from Phase 2 to enable Phase 3 without refactoring
- AR10: `prerender = true` set in root `+layout.ts` and `fallback: 'index.html'` set in svelte.config.js for SPA mode

**From UX Design:**
- UX1: UI chrome uses a dark neutral theme; card rows use set-specific textured background images (TanBG.jpg for Spanish Main, RedBG.jpg for Crimson Coast, BlueBG.jpg for Revolution) via CSS design token classes — never hardcoded hex
- UX2: Point cost rendered as oversized, bold `PointBadge` — the most visually dominant element in every card row
- UX3: `StatBar` renders iconic visual elements (mast icons, cargo icon, S/L movement notation), not text labels; `CannonDisplay` renders individual cannon pip circles (S/L differentiated) — faithful to physical card layout
- UX4: Text on dark and set-colored backgrounds must meet WCAG AA contrast ratios (4.5:1 minimum for body text)
- UX5: All interactive elements (filters, column headers, expandable rows) must have visible focus indicators for keyboard navigation
- UX6: Inline card detail expansion uses a ~200ms smooth slide-down animation
- UX7: Result count always visible in the filter sidebar (e.g., "Showing 47 of 5,231 cards")
- UX8: Default sort is point cost descending; all table columns are sortable with visible sort direction indicator
- UX9: Active filters displayed with individual clear controls; a "Clear All" option returns to the full catalog
- UX10: Phase 2 point tracking indicator shifts color (green → amber → red) based on remaining points vs. limit
- UX11: Phase 2 fleet builder uses three-panel layout: left filter sidebar, center card browser, right build panel with ship-centric hierarchy and nested crew

### FR Coverage Map

| FR | Epic | Description |
|---|---|---|
| FR1 | Epic 2 | Browse complete card catalog |
| FR2 | Epic 2 | Thumbnail images alongside key attributes |
| FR3 | Epic 2 | Browse across all sets or single set |
| FR4 | Epic 2 | Scroll large result sets without degradation |
| FR5 | Epic 2 | Lazy loading for card images |
| FR6 | Epic 2 | Filter by expansion set |
| FR7 | Epic 2 | Filter by card type |
| FR8 | Epic 2 | Filter by nationality |
| FR9 | Epic 2 | Filter by rarity |
| ~~FR10~~ | ~~Epic 2~~ | ~~Filter by tournament status~~ *(excluded)* |
| FR11 | Epic 2 | Combine multiple filters |
| FR12 | Epic 2 | Text search (name + ability) |
| FR13 | Epic 2 | Clear all filters |
| FR14 | Epic 2 | Display matching result count |
| FR15 | Epic 3 | Full-size card image in detail panel |
| FR16 | Epic 3 | All card attributes in detail panel |
| FR17 | Epic 3 | Ability text and description |
| FR18 | Epic 3 | Ship-specific attributes |
| FR19 | Epic 3 | Crew-specific attributes |
| FR20 | Epic 3 | Fort-specific attributes |
| FR21 | Epic 3 | Modifiers when present |
| FR22 | Epic 1 | XML-to-JSON conversion (lossless) |
| FR23 | Epic 1 | Image-to-card mapping |
| FR24 | Epic 1 | Thumbnail generation |
| FR25 | Epic 4 | Create new fleet build |
| FR26 | Epic 4 | Add ships to fleet |
| FR27 | Epic 4 | Assign crew to ships |
| FR28 | Epic 4 | Set fleet point limit |
| FR29 | Epic 4 | Running point total tracking |
| FR30 | Epic 4 | Remove ships or crew |
| FR31 | Epic 4 | Save fleet to local storage |
| FR32 | Epic 4 | Load saved fleet builds |
| FR33 | Epic 4 | Delete saved fleet builds |
| FR34 | Epic 5 | Validate builds against game rules |
| FR35 | Epic 5 | Enforce duplicate card limits |
| FR36 | Epic 5 | Enforce crew restrictions |
| FR37 | Epic 5 | Enforce card-specific constraints |
| FR38 | Epic 5 | Clear violation explanations |
| FR39 | Epic 5 | Graceful handling of unimplemented rules |

## Epic List

### Epic 1: Project Foundation & Deployment

A working SvelteKit application is initialized, all card data is converted and committed, thumbnail images are generated, and the site deploys to GitHub Pages via GitHub Actions. The technical foundation is complete — any subsequent epic can build on it immediately.

**FRs covered:** FR22, FR23, FR24
**Additional reqs covered:** AR1, AR2, AR3, AR4, AR5, AR6, AR7, AR8, AR9, AR10

---

### Epic 2: Card Discovery — Browse & Filter

A Pirates CSG fan can land on the site, see all 5000+ cards in a build-sheet-inspired table with set-colored rows and thumbnails, and immediately filter by set/type/nationality/rarity, combine multiple filters, and perform text search — all with instant, zero-perceptible-delay responses.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR14
**UX reqs covered:** UX1, UX2, UX3, UX7, UX8, UX9

---

### Epic 3: Card Detail — Explore & Learn

A user can click any card row to expand an inline detail panel below it, revealing the full-size card image, complete stats rendered in iconic visual format (mast icons, cannon pips), full ability text, card back flavor/description text, and all type-specific attributes — then collapse it and continue browsing.

**FRs covered:** FR15, FR16, FR17, FR18, FR19, FR20, FR21
**UX reqs covered:** UX5, UX6

---

### Epic 4: Fleet Builder — Assemble Your Fleet

Captain Rex can switch into fleet builder mode, add ships and assign crew in a three-panel layout, set a point limit, watch the running point total update in real time, remove cards, and save/load/delete multiple fleet builds to browser local storage.

**FRs covered:** FR25, FR26, FR27, FR28, FR29, FR30, FR31, FR32, FR33
**UX reqs covered:** UX10, UX11

---

### Epic 5: Rules Engine — Play by the Rules

The fleet builder enforces game rules — duplicate limits, crew restrictions, card-specific constraints — displaying clear violation explanations when rules are broken, while gracefully passing through any interactions the engine doesn't yet cover (no false positives, no blocking saves).

**FRs covered:** FR34, FR35, FR36, FR37, FR38, FR39

---

## Epic 1: Project Foundation & Deployment

A working SvelteKit application is initialized, all card data is converted and committed, thumbnail images are generated, and the site deploys to GitHub Pages via GitHub Actions. The technical foundation is complete — any subsequent epic can build on it immediately.

### Story 1.1: Initialize SvelteKit Project with Full Toolchain

As a **developer**,
I want the SvelteKit project initialized using the official Svelte CLI with TypeScript, Tailwind CSS v4, DaisyUI v5, adapter-static, ESLint, Prettier, Vitest, and Playwright configured,
So that the foundational development environment is production-ready and every subsequent story has a consistent, fully-typed, style-capable base to build on.

**Acceptance Criteria:**

**Given** I clone the repository and run `npm install`
**When** I run `npm run dev`
**Then** the dev server starts and serves a working SvelteKit app at localhost
**And** TypeScript strict mode is enabled and `svelte-check` reports no errors

**Given** the project is initialized
**When** I inspect `src/app.css`
**Then** it contains `@plugin "daisyui"` and a `@theme` block with placeholder design token slots for set colors
**And** `svelte.config.js` uses `adapter-static` with `fallback: 'index.html'`
**And** `src/routes/+layout.ts` exports `export const prerender = true`

**Given** the project is initialized
**When** I run `npm run build`
**Then** the build succeeds and outputs a fully static site to `/build`

**Given** the project is initialized
**When** I run `npm run test:unit`
**Then** Vitest runs (with zero test files, zero failures)
**And** when I run `npm run test:e2e`, Playwright is installed and ready

---

### Story 1.2: XML-to-JSON Card Data Conversion Script

As a **developer**,
I want a `scripts/convert.ts` script that reads `reference/PiratesCards.xml` and produces a typed `static/data/cards.json` with camelCase field names,
So that all 5000+ card records are available as a committed, version-controlled static asset with zero runtime conversion and no data loss.

**Acceptance Criteria:**

**Given** `reference/PiratesCards.xml` exists
**When** I run `npx tsx scripts/convert.ts`
**Then** `static/data/cards.json` is generated with every card as an object in a JSON array
**And** all field names are camelCase (e.g., `cardId`, `cardSet`, `pointValue`) — not PascalCase from the source XML

**Given** the generated `cards.json`
**When** I inspect a Ship card entry
**Then** it has a `details` object with `masts`, `cargo`, `baseMove`, `cannons` (array), and `crewSlots`
**And** when I inspect a Crew card, it has `details` with `buildBonus`, `costReduction`, `cargoBonus`, `limitCards`
**And** when I inspect a Treasure or Event card, it has no `details` key at all

**Given** the generated `cards.json`
**When** I count the total card entries
**Then** the count matches the total record count in the source XML (zero data loss)

**Given** the generated `cards.json`
**When** I inspect any card entry
**Then** `imageFilename` correctly reflects the naming convention (e.g., `PPSM_EC-001.jpg`) matching the source image files

---

### Story 1.3: WebP Thumbnail Generation Script

As a **developer**,
I want a `scripts/generate-thumbnails.ts` script that generates WebP thumbnails (~200px wide) from all 424 source JPGs and commits them to `static/images/thumbs/`,
So that the card browse view has lightweight, browser-cache-friendly thumbnail images served with stable URLs and ~30–50% smaller file sizes than the originals.

**Acceptance Criteria:**

**Given** the 424 source JPGs exist in `static/images/cards/`
**When** I run `npx tsx scripts/generate-thumbnails.ts`
**Then** a corresponding `.webp` thumbnail is generated in `static/images/thumbs/` for every source JPG
**And** each thumbnail filename matches the source filename convention with `.webp` extension (e.g., `PPSM_EC-001.webp`)

**Given** a generated WebP thumbnail
**When** I check its dimensions
**Then** its width is approximately 200px and aspect ratio matches the original card image

**Given** the thumbnails are generated
**When** I run `npm run build`
**Then** the thumbnails are included in the static build output under `/build/images/thumbs/`

---

### Story 1.4: Card TypeScript Types and Data Loading Infrastructure

As a **developer**,
I want the TypeScript discriminated union types for all card types (`Card`, `ShipCard`, `CrewCard`, etc.), a `cardData.svelte.ts` state module, and a `+page.ts` load function that fetches `cards.json` and exposes it to the page,
So that all UI components in subsequent epics have a type-safe, reactive, globally accessible card data source that follows the architecture's Svelte 5 runes and SvelteKit load() patterns.

**Acceptance Criteria:**

**Given** `src/lib/types/cardTypes.ts` is created
**When** I write `if (card.type === 'Ship') { card.details.masts }`
**Then** TypeScript narrows correctly with no cast needed
**And** `Treasure` and `Event` cards have no `details` property in their type

**Given** `src/lib/state/cardData.svelte.ts` is created
**When** a component imports and accesses the card array
**Then** it uses `$state` runes — no `writable` or `readable` Svelte 4 stores exist anywhere
**And** a `cardById` Map is available for O(1) lookups by `cardId`

**Given** `src/routes/+page.ts` contains the `load()` function
**When** the page loads in the browser
**Then** `cards.json` is fetched once via SvelteKit's `load()` and the array is passed to `+page.svelte` as a prop
**And** no component fetches `cards.json` inside `onMount` or any lifecycle function

**Given** `src/routes/+error.svelte` exists
**When** `cards.json` fails to load (simulated)
**Then** SvelteKit's error boundary renders the error page instead of a blank or broken page

---

### Story 1.5: GitHub Actions CI/CD Deployment Pipeline

As a **developer**,
I want a GitHub Actions workflow at `.github/workflows/deploy.yml` that runs `npm run build` and deploys the `/build` output to GitHub Pages on every push to `main`,
So that every merge to main automatically results in an updated live site with zero manual deployment steps.

**Acceptance Criteria:**

**Given** I push a commit to the `main` branch
**When** the GitHub Actions workflow triggers
**Then** it installs dependencies, runs `npm run build`, and deploys the `/build` directory to GitHub Pages
**And** the live site at the GitHub Pages URL reflects the pushed changes

**Given** the workflow runs
**When** `npm run build` fails (e.g., TypeScript error)
**Then** the deploy step does not run and the live site is not updated

**Given** the GitHub Pages deployment
**When** a user navigates directly to any SvelteKit client-side route
**Then** the `fallback: 'index.html'` config ensures the app loads correctly (no 404 on deep links)

---

## Epic 2: Card Discovery — Browse & Filter

A Pirates CSG fan can land on the site, see all 5000+ cards in a build-sheet-inspired table with set-colored rows and thumbnails, and immediately filter by set/type/nationality/rarity, combine multiple filters, and perform text search — all with instant, zero-perceptible-delay responses.

### Story 2.1: App Shell, Layout, and Design System

As a **Pirates CSG fan**,
I want to land on a polished, dark-themed site with the two-panel layout (filter sidebar left, content area right) and expansion set colors defined,
So that the visual foundation communicates craft and purpose from the first second — before I even see a card.

**Acceptance Criteria:**

**Given** I navigate to the site
**When** the page loads
**Then** I see an `AppHeader` at the top with the site name/branding
**And** the body uses a dark neutral background (near-black) with off-white primary text

**Given** the page layout
**When** I view it at desktop width (≥1280px)
**Then** a left sidebar panel and a main content area are visible side by side (`SidebarLayout`)

**Given** the design token system
**When** I inspect `src/app.css`
**Then** CSS custom properties exist for Spanish Main (tan/parchment), Crimson Coast (burgundy/red), and Revolution (royal blue) set backgrounds, each referencing the appropriate texture image (TanBG.jpg, RedBG.jpg, BlueBG.jpg) via `@theme`
**And** utility classes `bg-set-spanish-main`, `bg-set-crimson-coast`, `bg-set-revolution` apply the correct textured backgrounds
**And** no hardcoded hex color values appear in any component markup

**Given** the layout on mobile (≤768px)
**When** I view the page
**Then** the page renders without horizontal overflow and content remains readable (functional, not optimized)

---

### Story 2.2: Card Browse Table with Build-Sheet Rows

As a **Pirates CSG fan**,
I want to see all cards displayed in a scrollable table where each row shows the point cost badge, card thumbnail, nationality flag, card name, inline stat icons, and truncated ability text on a set-colored textured background — sorted by point cost descending by default,
So that I can scan hundreds of familiar cards at a glance and immediately recognize this tool was made by someone who knows the game.

**Acceptance Criteria:**

**Given** the page loads with card data
**When** the card table renders
**Then** every card appears as a row with: `PointBadge` (oversized, bold, most visually dominant), a WebP thumbnail, `NationalityFlag` icon, card name, `TypeBadge`, inline stats, and truncated ability text
**And** each row's background uses the set-specific textured CSS class (`bg-set-spanish-main`, `bg-set-crimson-coast`, or `bg-set-revolution`) based on the card's `cardSet`

**Given** a Ship card row
**When** I view the stat area
**Then** `StatBar` renders mast count as mast icons, cargo as a cargo icon with value, base move in S/L notation, and `CannonDisplay` renders individual cannon pip circles (S for short range, L for long range) — no plain text labels as the primary stat display

**Given** the card table
**When** it first renders
**Then** cards are sorted by point cost descending (highest cost first)
**And** clicking any sortable column header re-sorts the table by that column
**And** clicking the same header again reverses the sort direction
**And** a visual arrow indicator shows the current sort column and direction

**Given** card thumbnails in the table
**When** a row scrolls into the viewport
**Then** the WebP thumbnail loads lazily (via `loading="lazy"`) and renders from `static/images/thumbs/`
**And** if a thumbnail image is missing, a placeholder renders — no broken image icon

**Given** the card table with all 5000+ cards
**When** I scroll through the full list
**Then** scrolling remains smooth without perceptible jank
**And** `filterState.svelte.ts` uses Svelte 5 `$state` and `$derived` — no Svelte 4 stores

---

### Story 2.3: Filter Sidebar — All Filter Dimensions

As a **Pirates CSG fan**,
I want a sidebar with filter controls for expansion set, card type, nationality, and rarity — combinable in any combination — along with a result count and individual clear controls for each active filter,
So that I can narrow 5000+ cards to exactly what I need (e.g., "English Ships from Spanish Main") in seconds with no perceptible delay.

**Acceptance Criteria:**

**Given** the filter sidebar
**When** I open it
**Then** I see filter controls for: Expansion Set, Card Type, Nationality, and Rarity
**And** a result count displays the number of currently matching cards (e.g., "Showing 47 of 5,231 cards")

**Given** I select a filter value (e.g., "Ship" for type)
**When** the filter is applied
**Then** the card table updates instantly with no perceptible delay
**And** an active filter chip appears for "Type: Ship" with an ✕ clear button
**And** the result count updates to reflect the filtered set

**Given** multiple active filters (e.g., Type: Ship + Nationality: English + Set: Spanish Main)
**When** all three filters are active simultaneously
**Then** the table shows only cards matching ALL active filters (AND logic)
**And** each active filter has its own independent clear button

**Given** active filters are present
**When** I click the "Clear All" button
**Then** all filters reset and the full card catalog is shown
**And** all active filter chips disappear
**And** the result count returns to the total card count

**Given** a filter combination that matches zero cards
**When** the filters are applied
**Then** the card table shows an empty state message ("No cards match your current filters.")
**And** no error, no spinner — just the empty state message

---

### Story 2.4: Text Search

As a **Pirates CSG fan**,
I want a text search field that filters cards by matching the search term against card names and ability text,
So that I can find any card instantly by typing part of its name or a keyword from its ability (e.g., "HMS" or "helmsman").

**Acceptance Criteria:**

**Given** the search input field is visible in the filter sidebar
**When** I type a search term
**Then** the card table updates to show only cards whose name or ability text contains the term (case-insensitive)
**And** the result count updates to reflect the matched set
**And** the search interacts with any active filters (text search AND filters, all combined)

**Given** an active text search
**When** I clear the search field
**Then** the table returns to the pre-search filtered state (other active filters remain)

**Given** `src/lib/utils/filterUtils.ts` contains `matchesSearch()`
**When** I run unit tests
**Then** `filterUtils.test.ts` passes for: exact match, partial match, case-insensitive match, empty query (returns all), and no-match (returns none)

---

## Epic 3: Card Detail — Explore & Learn

A user can click any card row to expand an inline detail panel below it, revealing the full-size card image, complete stats rendered in iconic visual format (mast icons, cannon pips), full ability text, card back flavor/description text, and all type-specific attributes — then collapse it and continue browsing.

### Story 3.1: Inline Card Detail Expansion — Interaction and Base Content

As a **Pirates CSG fan**,
I want to click a card row to expand an inline detail panel below it showing the full card image, complete identity attributes, full ability text, and card back flavor/description text — with a smooth animation and keyboard accessibility,
So that I can explore any card in depth without leaving the browse table or losing my place in the list.

**Acceptance Criteria:**

**Given** I am viewing the card browse table
**When** I click a card row
**Then** a `CardRowExpanded` panel slides open below that row with a ~200ms smooth animation
**And** only one row is expanded at a time — clicking a second row collapses the first and expands the second
**And** clicking the currently expanded row collapses it and returns to the full table view

**Given** a card row is expanded
**When** the `CardRowExpanded` panel renders
**Then** the left side displays the full-size card image (minimum 240px wide) loaded from `static/images/cards/`
**And** the right side displays: card number, name, set, rarity, nationality flag, and point value (FR15, FR16)

**Given** a card row is expanded
**When** I view the ability and description sections
**Then** the full, untruncated ability text is displayed (FR17)
**And** the card back description/flavor text is displayed in an italic, styled block with a left-border accent
**And** card modifiers are displayed when present on the card (FR21)

**Given** the expanded detail panel
**When** I navigate the page by keyboard (Tab key)
**Then** the expanded row and its interactive elements receive visible focus indicators
**And** pressing Escape or clicking the row again collapses the panel

**Given** a card with a missing full-size image
**When** the detail panel renders
**Then** a placeholder displays in place of the broken image — no broken image icon

---

### Story 3.2: Type-Specific Detail Attributes

As a **Pirates CSG fan**,
I want the card detail panel to display type-appropriate stats — ship stats as iconic mast/cannon/cargo visuals, crew stats as their build bonuses and restrictions, fort stats as cannon pips — with no empty or inapplicable fields shown,
So that every card type presents a clean, purpose-built detail view faithful to the physical card layout.

**Acceptance Criteria:**

**Given** I expand a Ship card row
**When** the detail panel renders
**Then** the ship's stats are displayed using the same iconic `StatBar` and `CannonDisplay` components from the browse view: mast icons, cargo icon, S/L move notation, and individual cannon pip circles (FR18)
**And** crew slot count is displayed with an appropriate visual indicator

**Given** I expand a Crew card row
**When** the detail panel renders
**Then** crew-specific attributes are displayed: build bonus, cost reduction, cargo bonus, and limit cards (when present) (FR19)
**And** no ship stat fields (masts, cannons, cargo) appear in the crew detail panel

**Given** I expand a Fort card row
**When** the detail panel renders
**Then** the fort's cannon configuration is displayed using `CannonDisplay` pip circles (FR20)
**And** no ship movement or crew fields appear

**Given** I expand a Treasure or Event card row
**When** the detail panel renders
**Then** only the ability text, description/flavor text, and base identity attributes are shown
**And** no ship, crew, or fort stat sections appear — the layout adapts cleanly to the card type with no empty placeholders

**Given** `CardRowExpanded` renders any card type
**When** I run the component
**Then** TypeScript type narrowing (`card.type === 'Ship'`) determines which stat sections render — no runtime errors for missing `details` on Treasure or Event cards

---

## Epic 4: Fleet Builder — Assemble Your Fleet

Captain Rex can switch into fleet builder mode, add ships and assign crew in a three-panel layout, set a point limit, watch the running point total update in real time, remove cards, and save/load/delete multiple fleet builds to browser local storage.

### Story 4.1: Fleet Builder Layout, Mode Toggle, and State Foundation

As a **fleet builder**,
I want a "Build" mode tab that switches the layout to three panels (filters left, card browser center, fleet build panel right) and initializes the fleet state infrastructure,
So that the fleet builder has a complete structural foundation — including the rules engine stub — that all subsequent fleet stories build on.

**Acceptance Criteria:**

**Given** I am in the default Browse mode
**When** I click the `ModeToggle` "Build" tab
**Then** the layout shifts to three panels: filter sidebar (left), card table (center, slightly narrower), and `BuildPanel` (right)
**And** clicking the "Browse" tab returns to the full-width two-panel layout with no data loss

**Given** the Build mode panel is open
**When** no ships have been added yet
**Then** `BuildPanel` shows an empty state ("No ships in fleet yet — add a ship to start building")

**Given** `src/lib/state/fleetState.svelte.ts` is created
**When** I inspect it
**Then** it uses Svelte 5 `$state` runes — no Svelte 4 `writable` stores
**And** `src/lib/types/fleetTypes.ts` defines `Fleet`, `FleetShip`, and `FleetCrew` TypeScript interfaces

**Given** `src/lib/utils/rulesEngine.ts` is created
**When** I inspect it
**Then** it exports `type ValidationRule`, an empty `rules: ValidationRule[]` array, and a `validateFleet()` function that returns an empty array (Phase 2 stub — no rules enforced yet)
**And** `rulesEngine.test.ts` verifies that `validateFleet()` returns `[]` for any fleet input

---

### Story 4.2: Add Ships and Assign Crew to Fleet

As a **fleet builder**,
I want to add ships from the card browser to my fleet and assign crew cards to specific ships,
So that I can assemble the ship-centric fleet hierarchy that mirrors how Pirates CSG fleets actually work.

**Acceptance Criteria:**

**Given** I am in Build mode viewing the card browser
**When** I view a Ship card row
**Then** an "Add to Fleet" button is visible on the row (not visible in Browse mode)
**And** clicking it adds the ship to `fleetState` and it appears as a `BuildShipCard` entry in `BuildPanel`

**Given** a ship has been added to the fleet
**When** I view it in `BuildPanel`
**Then** it displays the ship's name, point cost, and an expandable crew area beneath it
**And** the ship entry shows the ship's mast count and cargo capacity for reference

**Given** I am in Build mode viewing a Crew card row
**When** I click "Add to Fleet"
**Then** if there is exactly one ship in the fleet, the crew is auto-assigned to it
**And** if there are multiple ships, a ship picker appears allowing me to select which ship receives the crew

**Given** crew has been assigned to a ship
**When** I view `BuildPanel`
**Then** the crew card is displayed indented beneath its assigned ship with a visual connector (left border)
**And** `fleetUtils.ts` contains `addShip()`, `assignCrew()` functions with co-located `fleetUtils.test.ts` tests

---

### Story 4.3: Point Tracking and Fleet Summary

As a **fleet builder**,
I want to set a fleet point limit and see a running total that color-shifts from green to amber to red as I approach and exceed the limit,
So that I always know exactly where my fleet stands against the point budget without doing any manual math.

**Acceptance Criteria:**

**Given** I am in Build mode
**When** I view `BuildSummary` at the top of `BuildPanel`
**Then** it displays the current point total and configured limit (e.g., "27 / 40 pts")
**And** a point limit input/selector allows me to set or change the fleet point limit (FR28)

**Given** I add or remove a card
**When** the fleet changes
**Then** the point total updates immediately and reactively
**And** the point display is green when under 80% of the limit, amber when between 80–100%, and red when over the limit (FR29, UX10)

**Given** the fleet point total
**When** I add a card that would exceed the limit
**Then** the point display turns red and shows the overage — but the card is still added (no blocking)
**And** `fleetUtils.ts` contains a `calcPoints()` function with unit tests verifying correct totals across mixed ship+crew fleets

---

### Story 4.4: Remove Cards from Fleet

As a **fleet builder**,
I want to remove individual crew members from a ship or remove an entire ship (along with all its assigned crew) from the fleet,
So that I can freely iterate on my build without being locked into early choices.

**Acceptance Criteria:**

**Given** a ship is in my fleet
**When** I click the remove button on a `BuildShipCard`
**Then** the ship and all of its assigned crew are removed from `fleetState`
**And** the point total updates immediately to reflect the removal

**Given** a crew card is assigned to a ship
**When** I click the remove button on that crew entry
**Then** only that crew card is removed — the ship and other crew remain
**And** the point total updates immediately

**Given** all ships are removed from the fleet
**When** the last ship is removed
**Then** `BuildPanel` returns to the empty state ("No ships in fleet yet — add a ship to start building")

**Given** `fleetUtils.ts`
**When** I run unit tests
**Then** `removeShip()` correctly removes the ship and all its crew, and `removeCrew()` correctly removes only the specified crew card, with point totals recalculated correctly in both cases

---

### Story 4.5: Save, Load, and Delete Fleet Builds

As a **fleet builder**,
I want to save my current fleet to browser local storage with a name I choose, reload a previously saved fleet, and delete fleets I no longer need,
So that I can maintain multiple fleet configurations across sessions and return to a build exactly where I left it.

**Acceptance Criteria:**

**Given** I have a fleet with ships and crew
**When** I click "Save Fleet" and provide a name
**Then** the fleet is serialized and stored in `localStorage` under a key that preserves all ships, crew assignments, and the point limit
**And** the fleet name appears in a saved fleets list within `BuildPanel` (FR31)

**Given** saved fleets exist
**When** I select a fleet from the saved fleets list and click "Load"
**Then** `fleetState` is populated with the saved fleet's ships, crew, and point limit
**And** `BuildPanel` renders the loaded fleet correctly (FR32)

**Given** I have unsaved changes to the current fleet
**When** I attempt to load a different saved fleet
**Then** a confirmation prompt warns me that unsaved changes will be lost before proceeding

**Given** a saved fleet in the list
**When** I click its delete button
**Then** the fleet is removed from `localStorage` and disappears from the saved fleets list (FR33)

**Given** `fleetUtils.ts`
**When** I run unit tests
**Then** `serializeFleet()` and `deserializeFleet()` correctly round-trip a fleet with multiple ships and mixed crew assignments, preserving all data with no loss

---

## Epic 5: Rules Engine — Play by the Rules

The fleet builder enforces game rules — duplicate limits, crew restrictions, card-specific constraints — displaying clear violation explanations when rules are broken, while gracefully passing through any interactions the engine doesn't yet cover (no false positives, no blocking saves).

### Story 5.1: Rule Violation Display Infrastructure

As a **fleet builder**,
I want rule violations to appear as warning indicators on the specific cards in my fleet — with a clear explanation of what rule was broken — while still being able to save the fleet regardless,
So that I get useful feedback on build problems without being blocked, and I always know what the rules engine is and isn't checking.

**Acceptance Criteria:**

**Given** `src/lib/utils/rulesEngine.ts` already exports `ValidationRule` and `validateFleet()`
**When** I update it to also export a `ValidationResult` type with fields for `affectedCardIds`, `ruleId`, and `message`
**Then** `validateFleet()` returns `ValidationResult[]` from all registered rules
**And** existing fleet functionality is unaffected (empty `rules[]` still returns `[]`)

**Given** `validateFleet()` is called after every fleet mutation
**When** it returns one or more violations
**Then** each affected card entry in `BuildPanel` shows a warning icon (⚠) alongside it
**And** hovering or clicking the warning icon reveals the specific violation message (e.g., "Duplicate card limit exceeded: max 1 copy of this card allowed")

**Given** the `BuildSummary` component
**When** the rules engine has run
**Then** it displays the count of rules checked (e.g., "3 rules checked") — never "Build is valid" if future rules may not yet be implemented (FR39)
**And** if violations exist, it shows the count (e.g., "2 violations found")

**Given** my fleet has violations
**When** I click "Save Fleet"
**Then** the fleet saves to localStorage successfully — violations are warnings, never save gates (FR39)
**And** the saved fleet is marked with a warning indicator in the saved fleets list

---

### Story 5.2: Duplicate Card Limit Rule

As a **fleet builder**,
I want the rules engine to detect when I've added more copies of a card than the game allows,
So that I know immediately when my fleet violates the duplicate limit rule without having to count manually.

**Acceptance Criteria:**

**Given** the game rule that limits duplicate copies of the same card in a fleet
**When** I implement a `duplicateLimitRule` function and push it into the `rules` array in `rulesEngine.ts`
**Then** no other files are modified — only `rulesEngine.ts` changes (per the rules engine boundary contract)

**Given** a fleet where the same card appears more than the allowed limit
**When** `validateFleet()` runs
**Then** it returns a `ValidationResult` identifying the duplicate card(s) and the violation message
**And** the affected card entries in `BuildPanel` display the ⚠ warning icon

**Given** a fleet with all unique cards (or within duplicate limits)
**When** `validateFleet()` runs
**Then** the duplicate limit rule returns no violations for those cards

**Given** `rulesEngine.test.ts`
**When** I run unit tests
**Then** tests pass for: no duplicates (no violation), exactly at the limit (no violation), one over the limit (one violation per excess), and multiple duplicate violations in the same fleet

---

### Story 5.3: Crew Assignment Restriction Rule

As a **fleet builder**,
I want the rules engine to detect when crew are assigned to ships they aren't allowed to serve on,
So that my fleet reflects actual game restrictions on crew-to-ship compatibility.

**Acceptance Criteria:**

**Given** the game rules defining crew-to-ship assignment restrictions (e.g., nationality-based restrictions)
**When** I implement a `crewRestrictionRule` function and push it into the `rules` array
**Then** no other files are modified — only `rulesEngine.ts` changes

**Given** a fleet where a crew card is assigned to a ship it is restricted from
**When** `validateFleet()` runs
**Then** it returns a `ValidationResult` identifying the incompatible crew/ship pairing with an explanatory message (FR36, FR38)
**And** both the crew entry and its assigned ship entry in `BuildPanel` display the ⚠ warning icon

**Given** a fleet with valid crew assignments
**When** `validateFleet()` runs
**Then** the crew restriction rule returns no violations

**Given** `rulesEngine.test.ts`
**When** I run unit tests
**Then** tests pass for: valid assignment (no violation), restricted assignment (violation with correct card IDs and message), and multiple restriction violations in the same fleet

---

### Story 5.4: Card-Specific Constraint Rules

As a **fleet builder**,
I want the rules engine to detect violations of card-specific constraints defined in the game rules (such as "limit" cards and unique card restrictions),
So that fleet builds reflect the full constraint set from the official game rules.

**Acceptance Criteria:**

**Given** card-specific constraints defined in the game rules (e.g., cards with `limitCards` entries in their `details`)
**When** I implement a `cardSpecificConstraintRule` function and push it into the `rules` array
**Then** no other files are modified — only `rulesEngine.ts` changes

**Given** a fleet that violates a card-specific constraint (e.g., a "limit 1 per fleet" card appearing multiple times)
**When** `validateFleet()` runs
**Then** it returns a `ValidationResult` with the specific constraint message, identifying the offending card(s) (FR37, FR38)
**And** the affected card entries in `BuildPanel` display the ⚠ warning icon

**Given** a fleet with no card-specific constraint violations
**When** `validateFleet()` runs
**Then** the card-specific constraint rule returns no violations

**Given** `BuildSummary` after all three rules are registered
**When** no violations are present
**Then** it displays "3 rules checked, 0 violations" — an honest count of what was actually checked, not a blanket "valid" claim

**Given** `rulesEngine.test.ts`
**When** I run unit tests
**Then** tests pass for: no constraint violations (no violation), a "limit 1" card appearing twice (violation), and combinations of multiple rule types firing simultaneously

