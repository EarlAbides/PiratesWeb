# Story 2.1: App Shell, Layout, and Design System

Status: done

## Story

As a **Pirates CSG fan**,
I want to land on a polished, dark-themed site with the two-panel layout (filter sidebar left, content area right) and expansion set colors defined,
so that the visual foundation communicates craft and purpose from the first second — before I even see a card.

## Acceptance Criteria

1. **Given** I navigate to the site
   **When** the page loads
   **Then** I see an `AppHeader` at the top with the site name/branding
   **And** the body uses a dark neutral background (near-black) with off-white primary text

2. **Given** the page layout
   **When** I view it at desktop width (≥1280px)
   **Then** a left sidebar panel and a main content area are visible side by side (`SidebarLayout`)

3. **Given** the design token system
   **When** I inspect `src/app.css`
   **Then** CSS custom properties exist for Spanish Main (tan/parchment), Crimson Coast (burgundy/red), and Revolution (royal blue) set backgrounds, each referencing the appropriate texture image (TanBG.jpg, RedBG.jpg, BlueBG.jpg) via `@theme`
   **And** utility classes `bg-set-spanish-main`, `bg-set-crimson-coast`, `bg-set-revolution` apply the correct textured backgrounds
   **And** no hardcoded hex color values appear in any component markup

4. **Given** the layout on mobile (≤768px)
   **When** I view the page
   **Then** the page renders without horizontal overflow and content remains readable (functional, not optimized)

## Tasks / Subtasks

- [x] Update `src/app.css` — dark body background and texture image wiring (AC: 1, 3)
  - [x] Add `body` / `html` base styles: near-black background (`oklch(10% 0.01 0)`), off-white text (`oklch(95% 0.01 0)`), full height
  - [x] Add CSS custom property slots for texture URLs on `:root`: `--bg-texture-spanish-main`, `--bg-texture-crimson-coast`, `--bg-texture-revolution` (defaulting to `none` so flat color fallback works)
  - [x] Update `.bg-set-spanish-main`, `.bg-set-crimson-coast`, `.bg-set-revolution` to add `background-image: var(--bg-texture-*)`, `background-size: cover`, `background-blend-mode: multiply` (texture overlaid on the flat color)

- [x] Create `src/lib/components/layout/AppHeader.svelte` (AC: 1)
  - [x] Dark header bar spanning full width
  - [x] "Pirates of the Spanish Main Card Catalog" site name as primary branding text (styled with Tailwind, using design token colors — no hardcoded hex)
  - [x] No interactive elements yet (ModeToggle is Story 4.1)
  - [x] No props needed for this story

- [x] Create `src/lib/components/layout/SidebarLayout.svelte` (AC: 2, 4)
  - [x] Two-column layout: `sidebar` snippet (left, fixed width ~288px) + `children` snippet (right, fills remaining space)
  - [x] Desktop (≥1280px, via `xl:` Tailwind breakpoint): `flex flex-row`, sidebar and main side by side, full viewport height
  - [x] Below xl: sidebar and main stack vertically (no horizontal overflow), sidebar first
  - [x] No `style=` attributes — layout achieved entirely with Tailwind flex/grid utilities
  - [x] Props interface: `{ sidebar: Snippet; children: Snippet }`

- [x] Update `src/routes/+layout.svelte` — add AppHeader and inject texture CSS variables (AC: 1, 3)
  - [x] Import `AppHeader` from `$lib/components/layout/AppHeader.svelte`
  - [x] Import `base` from `$app/paths` (already used in cardUtils — same pattern)
  - [x] Wrap the layout in a root `<div>` that: sets `--bg-texture-spanish-main`, `--bg-texture-crimson-coast`, `--bg-texture-revolution` via `style:` directive (three separate `style:--varname` bindings with `url('{base}/images/backgrounds/Xxx.jpg')` values — this IS a genuinely dynamic computed value per architecture exception, since `base` differs between dev and CI/GitHub Pages)
  - [x] Render `<AppHeader />` above `{@render children()}`
  - [x] Root div should fill the viewport: `class="min-h-screen flex flex-col"`

- [x] Update `src/routes/+page.svelte` — use SidebarLayout with structural placeholders (AC: 2)
  - [x] Import `SidebarLayout` from `$lib/components/layout/SidebarLayout.svelte`
  - [x] Wrap page body in `<SidebarLayout>` with `{#snippet sidebar()}` and the main content as default children
  - [x] Sidebar snippet: placeholder `<!-- FilterSidebar (Story 2.3) -->` comment, or minimal `<div class="p-4 text-sm opacity-50">Filters</div>` stub so the two-column structure is visible
  - [x] Main children: keep existing `<p>Loaded {data.cards.length} cards</p>` (placeholder for Story 2.2 CardTable)
  - [x] Keep existing `cardData.setCards(data.cards)` call and `$effect.pre` block unchanged

- [x] Verify AC compliance
  - [x] `npm run check` — zero TypeScript errors
  - [x] `npm run build` — clean build
  - [x] `npm run test:unit` — all existing tests pass (no regressions from css/layout changes)
  - [x] Visually inspect at ≥1280px: AppHeader visible, sidebar and main area side by side
  - [x] Visually inspect at ≤768px: no horizontal overflow, content stacked and readable
  - [x] Inspect DOM: confirm no `style="background-color: #..."` or hardcoded hex on any element

### Review Follow-ups (AI)

- [x] [AI-Review][HIGH] Fix broken Prettier/lint toolchain: `.prettierrc` `tailwindStylesheet` references non-existent `./src/routes/layout.css` — change to `./src/app.css`, then run `npm run format` to normalize all files [`.prettierrc`]
- [x] [AI-Review][MEDIUM] Fix mobile scroll trap: change `overflow-hidden` to `xl:overflow-hidden` on SidebarLayout wrapper div so mobile scrolls naturally while desktop keeps independent panel scrolling [`src/lib/components/layout/SidebarLayout.svelte:12`]
- [x] [AI-Review][MEDIUM] Add `data-theme="dark"` to root layout div to prevent DaisyUI v5 components from defaulting to light theme in Stories 2.2/2.3 [`src/routes/+layout.svelte:14`]
- [x] [AI-Review][MEDIUM] Define body bg/text as `@theme` tokens (`--color-base-bg`, `--color-base-text`) instead of raw oklch values in `html, body` rule, ensuring design token consistency with Tailwind neutral utilities [`src/app.css:36-38`]
- [x] [AI-Review][LOW] Fix `+layout.svelte` indentation from 2-space to tabs per `.prettierrc` `useTabs: true` (auto-resolves when Prettier is fixed) [`src/routes/+layout.svelte`]
- [x] [AI-Review][LOW] Refactor `+page.svelte` props to use named `interface Props { data: PageData }` instead of inline type annotation for consistency with architecture pattern [`src/routes/+page.svelte:6`]
- [x] [AI-Review][LOW] Add `aria-label="Filters"` to SidebarLayout `<aside>` element for accessibility (UX5) [`src/lib/components/layout/SidebarLayout.svelte:13`]

## Dev Notes

### Critical Context: What Epic 1 Already Built

This story is the first of Epic 2 — it builds on a **fully working SvelteKit 2.x + Svelte 5 + Tailwind v4 + DaisyUI v5 static site** from Epic 1. Do NOT reinitialize or restructure anything from the Epic 1 foundation.

**`src/app.css` current state (from Story 1.3 + icon pre-work):**

```css
@import 'tailwindcss';
@plugin "daisyui";

@theme {
  /* Set-specific color tokens (already exist) */
  --color-set-spanish-main: oklch(76% 0.05 80);
  --color-set-spanish-main-text: oklch(15% 0.02 80);
  --color-set-crimson-coast: oklch(35% 0.12 15);
  --color-set-crimson-coast-text: oklch(95% 0.01 80);
  --color-set-revolution: oklch(30% 0.12 255);
  --color-set-revolution-text: oklch(95% 0.01 80);

  /* Icon color tokens (already exist) */
  --color-icon-bg: #000000;
  --color-icon-ship: #FFFFFF;
  --color-icon-gold: #C8960C;
  --color-pip-short-bg: #FFFFFF;
  --color-pip-short-dot: #000000;
  --color-pip-long-bg: #C0272D;
  --color-pip-long-dot: #FFFFFF;
}

/* .bg-set-* utility classes (already exist, flat colors only) */
.bg-set-spanish-main { background-color: var(--color-set-spanish-main); color: ...; }
.bg-set-crimson-coast { ... }
.bg-set-revolution { ... }
```

**This story's job:** Wire the texture `background-image` into the `.bg-set-*` classes, and add the dark body background.

**`src/routes/+layout.svelte` current state:**

```svelte
<script lang="ts">
	import '../app.css';
	interface Props {
		children: import('svelte').Snippet;
	}
	let { children }: Props = $props();
</script>

{@render children()}
```

**`src/routes/+page.svelte` current state:**

```svelte
<script lang="ts">
	import type { PageData } from './$types';
	import { cardData } from '$lib/state/cardData.svelte';
	let { data }: { data: PageData } = $props();
	$effect.pre(() => {
		cardData.setCards(data.cards);
	});
</script>

<p>Loaded {data.cards.length} cards</p>
```

### Icon Pre-Work: Already Done (Story 2.2 context)

The commit `feat: icon pre-work` (1e5d3c3) pre-built these components BEFORE Story 2.1. They exist but are NOT used in this story — they're for Story 2.2 (CardRow):

```
src/lib/components/icons/
  stat/MastIcon.svelte
  stat/CargoIcon.svelte
  stat/MoveIcon.svelte
  stat/CannonIcon.svelte
  cannons/CannonPip.svelte
  cannons/index.ts         ← parseCannonPip() utility
  cannons/index.test.ts
```

And in `static/images/flags/`: `english.svg`, `spanish.svg`, `pirates.svg`, `french.svg`, `american.svg`.

Do NOT modify any of these in this story.

### Architecture: Layout Pattern (SidebarLayout in +page.svelte)

The architecture doc notes `+layout.svelte — App shell: AppHeader + SidebarLayout`. However, due to SvelteKit's snippet scoping (page content cannot inject into layout-level snippet slots), `SidebarLayout` belongs in `+page.svelte`, not `+layout.svelte`. This is consistent with the architecture's component boundary rule: **"+page.svelte owns the top-level layout; imports FilterSidebar and CardTable"**.

`+layout.svelte` handles: AppHeader, dark body background, CSS variable injection for texture images.
`+page.svelte` handles: SidebarLayout structure, FilterSidebar (Story 2.3), CardTable (Story 2.2).

Phase 2's fleet page (`src/routes/fleet/`) will use a different 3-panel layout — this confirms the pattern is correct.

### Critical: Texture Background Image URLs + Base Path

The background images are in `static/images/backgrounds/` (TanBG.jpg, RedBG.jpg, BlueBG.jpg). On GitHub Pages, the app is served at `https://earlabides.github.io/PiratesWeb/` — so `base = '/PiratesWeb'` in CI/production, and `base = ''` in local dev.

**CSS `url()` in `app.css` does NOT get the base path prefix automatically.** Tailwind/Vite processes `app.css` at build time; it cannot know the runtime base. Static assets in `static/` are not processed through Vite's asset pipeline.

**The solution:** In `+layout.svelte`, use Svelte's `style:` directive to set CSS custom properties that carry the correct base-prefixed URL. This is explicitly allowed by the architecture: _"No `style=` attributes except for genuinely dynamic computed values"_ — `base` IS a dynamic computed value (empty in dev, `/PiratesWeb` in CI).

**`+layout.svelte` pattern:**

```svelte
<script lang="ts">
	import '../app.css';
	import { base } from '$app/paths';
	import AppHeader from '$lib/components/layout/AppHeader.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}
	let { children }: Props = $props();
</script>

<div
	class="flex min-h-screen flex-col bg-neutral-950 text-neutral-100"
	style:--bg-texture-spanish-main="url('{base}/images/backgrounds/TanBG.jpg')"
	style:--bg-texture-crimson-coast="url('{base}/images/backgrounds/RedBG.jpg')"
	style:--bg-texture-revolution="url('{base}/images/backgrounds/BlueBG.jpg')"
>
	<AppHeader />
	{@render children()}
</div>
```

Note: `style:--varname="value"` is Svelte's CSS custom property binding syntax — not a raw `style=` attribute string. This is the idiomatic Svelte approach.

**`app.css` updated `.bg-set-*` pattern:**

```css
.bg-set-spanish-main {
	background-color: var(--color-set-spanish-main);
	background-image: var(--bg-texture-spanish-main, none);
	background-size: cover;
	background-blend-mode: multiply;
	color: var(--color-set-spanish-main-text);
}
/* Same pattern for .bg-set-crimson-coast and .bg-set-revolution */
```

The `var(--bg-texture-spanish-main, none)` fallback means: if the CSS variable is not set (e.g., in Vitest tests that don't render the layout), the class still works with just the flat color — no broken styles.

### Svelte 5 Component Patterns (Mandatory)

**SidebarLayout snippet pattern:**

```svelte
<!-- SidebarLayout.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	interface Props {
		sidebar: Snippet;
		children: Snippet;
	}
	let { sidebar, children }: Props = $props();
</script>

<div class="flex flex-1 overflow-hidden">
	<aside class="w-72 shrink-0 overflow-y-auto border-r border-neutral-800">
		{@render sidebar()}
	</aside>
	<main class="flex-1 overflow-y-auto">
		{@render children()}
	</main>
</div>
```

**Usage in +page.svelte:**

```svelte
<SidebarLayout>
	{#snippet sidebar()}
		<!-- FilterSidebar (Story 2.3) -->
		<div class="p-4 text-sm opacity-40">Filters coming in Story 2.3</div>
	{/snippet}
	<!-- CardTable (Story 2.2) -->
	<p class="p-4">Loaded {data.cards.length} cards</p>
</SidebarLayout>
```

**AppHeader pattern:**

```svelte
<!-- AppHeader.svelte -->
<header class="flex shrink-0 items-center border-b border-neutral-700 bg-neutral-900 px-6 py-3">
	<h1 class="text-xl font-bold tracking-wide text-neutral-100">
		Pirates of the Spanish Main Card Catalog
	</h1>
</header>
```

No props needed on AppHeader for this story.

### DaisyUI v5 Theme Note

DaisyUI v5 defaults to a light theme. To ensure the dark neutral background is applied globally (not just to DaisyUI-themed components), set the Tailwind background on the root layout div (as shown above with `bg-neutral-950`) rather than relying on DaisyUI's `data-theme`. The design system uses custom dark colors that aren't DaisyUI themes. If DaisyUI components render with light backgrounds, add `data-theme="dark"` to the root div.

### Styling Patterns (Mandatory — from Architecture)

- **Tailwind utilities first** — use `bg-neutral-950`, `text-neutral-100`, `border-neutral-800`, `flex`, `flex-col`, `shrink-0`, `overflow-y-auto`, etc.
- **No hardcoded hex or inline `style=` for static values** — all colors via Tailwind utilities or CSS design tokens
- **No `createEventDispatcher`** — callback props only (AppHeader has no events in this story)
- **No Svelte 4 `writable`/`readable` stores**
- **`$props()` with explicit TypeScript interface** for every component

### File Structure (from Architecture)

```
src/lib/components/layout/   ← target folder for this story
  AppHeader.svelte            (CREATE)
  SidebarLayout.svelte        (CREATE)

src/routes/
  +layout.svelte              (MODIFY — add AppHeader, dark wrapper, CSS vars)
  +page.svelte                (MODIFY — add SidebarLayout structure)

src/
  app.css                     (MODIFY — add dark body bg, texture image wiring)
```

Do NOT create files outside this structure. Do NOT create a `layout/` folder under `src/routes/` — layout components belong in `src/lib/components/layout/`.

### Mobile Behavior (AC 4)

"Functional, not optimized" per architecture NFR8. At ≤768px:

- The two-column flex layout should stack vertically (sidebar above main content)
- No `overflow-x: hidden` hacks — just ensure the flex layout doesn't force horizontal scroll
- Simple Tailwind approach: SidebarLayout uses `flex-col xl:flex-row` (stacked by default, side-by-side at xl)
- Sidebar at mobile: full-width, no fixed height (scrolls with content)

### What This Story Explicitly Does NOT Do

- Does NOT create `FilterSidebar.svelte` (Story 2.3)
- Does NOT create `CardTable.svelte` or `CardRow.svelte` (Story 2.2)
- Does NOT add `ModeToggle.svelte` or fleet builder tabs (Story 4.1)
- Does NOT create Playwright e2e tests (the app doesn't have browseable content yet)
- Does NOT add a DaisyUI navbar/drawer component — keep it simple Tailwind
- Does NOT add `StatBar.svelte` or `CannonDisplay.svelte` (Story 2.2)
- Does NOT modify any files in `src/lib/components/icons/` (those are from icon pre-work)
- Does NOT add any npm packages — all needed libraries are already installed

### Project Structure Notes

#### Files to Create

```
src/lib/components/layout/AppHeader.svelte         (NEW)
src/lib/components/layout/SidebarLayout.svelte     (NEW)
```

#### Files to Modify

```
src/routes/+layout.svelte      MODIFY: add AppHeader import + dark wrapper + CSS variable injection
src/routes/+page.svelte        MODIFY: add SidebarLayout structural wrapper
src/app.css                    MODIFY: add dark body background + texture image CSS var + update .bg-set-* classes
```

#### Files NOT to Modify

```
src/routes/+layout.ts          (prerender = true — do not touch)
src/routes/+page.ts            (load function — do not touch)
src/lib/state/cardData.svelte.ts
src/lib/types/cardTypes.ts
src/lib/utils/cardUtils.ts
src/lib/components/icons/**    (icon pre-work — do not touch)
static/images/**               (images already committed — do not touch)
```

### References

- [Source: epics.md#Story 2.1] — User story + acceptance criteria
- [Source: epics.md#UX Requirements UX1, UX4] — Dark neutral theme, WCAG AA contrast
- [Source: architecture.md#Frontend Architecture — State Management] — Svelte 5 runes, class-based stores
- [Source: architecture.md#Implementation Patterns — Component Patterns] — $props() with TypeScript, callback props, no createEventDispatcher
- [Source: architecture.md#Implementation Patterns — Naming Patterns] — PascalCase .svelte, camelCase .svelte.ts
- [Source: architecture.md#Implementation Patterns — Styling Patterns] — Tailwind → DaisyUI → custom CSS hierarchy
- [Source: architecture.md#Project Structure — Component Organization] — layout/ subfolder under components/
- [Source: architecture.md#Project Structure — Architectural Boundaries] — +page.svelte owns top-level layout
- [Source: 1-5-github-actions-cicd-deployment-pipeline.md#Dev Notes] — base path pattern (`import { base } from '$app/paths'`)
- [Source: app.css] — Existing design tokens (already in place, DO NOT duplicate)
- [Source: src/routes/+layout.svelte] — Current minimal shell (replace with full shell)
- [Source: src/routes/+page.svelte] — Current card-count placeholder (extend with SidebarLayout)

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

_None — clean implementation, no debugging required._

### Completion Notes List

- Created `src/lib/components/layout/` directory with `AppHeader.svelte` and `SidebarLayout.svelte`
- `AppHeader.svelte`: stateless dark header bar, no props, all styling via Tailwind utilities (no hardcoded hex)
- `SidebarLayout.svelte`: two-snippet layout (`sidebar` + `children`), `flex-col xl:flex-row` for responsive stacking, no `style=` attributes
- `+layout.svelte`: injects base-path-aware texture URL CSS custom properties via Svelte `style:` directives (required because static CSS cannot resolve `base` at build time); adds `AppHeader`
- `+page.svelte`: wrapped in `SidebarLayout` with placeholder sidebar stub and existing card count preserved
- `src/app.css`: added dark `html`/`body` base, `:root` texture URL slots defaulting to `none`, updated `.bg-set-*` classes with `background-image`, `background-size: cover`, `background-blend-mode: multiply`
- All 12 existing unit tests pass; `npm run check` reports 0 errors; `npm run build` clean
- ✅ Resolved review finding [HIGH]: Fixed `.prettierrc` `tailwindStylesheet` path from non-existent `./src/routes/layout.css` to `./src/app.css`; ran `npm run format` to normalize all files
- ✅ Resolved review finding [MEDIUM]: Changed `overflow-hidden` to `xl:overflow-hidden` on SidebarLayout wrapper — mobile now scrolls naturally
- ✅ Resolved review finding [MEDIUM]: Added `data-theme="dark"` to root layout div in `+layout.svelte`
- ✅ Resolved review finding [MEDIUM]: Extracted `--color-base-bg` and `--color-base-text` as `@theme` tokens; `html, body` rule now uses `var()` references instead of raw oklch values
- ✅ Resolved review finding [LOW]: `+layout.svelte` indentation normalized to tabs by Prettier after toolchain fix
- ✅ Resolved review finding [LOW]: Refactored `+page.svelte` to use named `interface Props { data: PageData }` pattern
- ✅ Resolved review finding [LOW]: Added `aria-label="Filters"` to SidebarLayout `<aside>` element

### File List

- `src/app.css` (modified)
- `src/routes/+layout.svelte` (modified)
- `src/routes/+page.svelte` (modified)
- `src/lib/components/layout/AppHeader.svelte` (created)
- `src/lib/components/layout/SidebarLayout.svelte` (modified)
- `.prettierrc` (modified)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified — status updated)
- `_bmad-output/implementation-artifacts/2-1-app-shell-layout-and-design-system.md` (modified — story file)

## Change Log

| Date       | Change                                                                                                                                                                                          |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-02-28 | Implemented Story 2.1: App Shell, Layout, and Design System — dark body background, texture CSS vars, AppHeader, SidebarLayout, layout + page route updates. All ACs satisfied, all tests pass. |
| 2026-02-28 | Code review completed: 1 HIGH, 3 MEDIUM, 3 LOW findings. 7 follow-up action items created. Status → in-progress pending follow-ups.                                                             |
| 2026-02-28 | Addressed code review findings — 7 items resolved (Date: 2026-02-28): fixed Prettier toolchain, mobile scroll trap, data-theme dark, @theme tokens, layout indentation, Props interface, aria-label. |
