# Story 1.1: Initialize SvelteKit Project with Full Toolchain

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **developer**,
I want the SvelteKit project initialized using the official Svelte CLI with TypeScript, Tailwind CSS v4, DaisyUI v5, adapter-static, ESLint, Prettier, Vitest, and Playwright configured,
So that the foundational development environment is production-ready and every subsequent story has a consistent, fully-typed, style-capable base to build on.

## Acceptance Criteria

1. **Given** I clone the repository and run `npm install`
   **When** I run `npm run dev`
   **Then** the dev server starts and serves a working SvelteKit app at localhost
   **And** TypeScript strict mode is enabled and `svelte-check` reports no errors

2. **Given** the project is initialized
   **When** I inspect `src/app.css`
   **Then** it contains `@plugin "daisyui"` and a `@theme` block with placeholder design token slots for set colors
   **And** `svelte.config.js` uses `adapter-static` with `fallback: 'index.html'`
   **And** `src/routes/+layout.ts` exports `export const prerender = true`

3. **Given** the project is initialized
   **When** I run `npm run build`
   **Then** the build succeeds and outputs a fully static site to `/build`

4. **Given** the project is initialized
   **When** I run `npm run test:unit`
   **Then** Vitest runs (with zero test files, zero failures)
   **And** when I run `npm run test:e2e`, Playwright is installed and ready

## Tasks / Subtasks

- [x] Initialize SvelteKit project using the sv CLI (AC: 1, 2, 3, 4)
  - [x] Run the official `npx sv create` command (see Dev Notes for exact command)
  - [x] Verify dev server starts at localhost with `npm run dev`
- [x] Install and configure DaisyUI v5 (AC: 2)
  - [x] Run `npm install -D daisyui@latest`
  - [x] Confirm `@plugin "daisyui"` is present in `src/app.css`
- [x] Configure adapter-static for SPA mode (AC: 2, 3)
  - [x] Verify `svelte.config.js` uses `adapter-static` with `fallback: 'index.html'`
  - [x] Run `npm run build` — confirm output lands in `/build`
- [x] Configure prerender in root layout (AC: 2)
  - [x] Ensure `src/routes/+layout.ts` exports `export const prerender = true`
- [x] Add design token stubs in `src/app.css` (AC: 2)
  - [x] Add `@theme` block with CSS custom properties for all three set colors (Spanish Main, Crimson Coast, Revolution)
  - [x] Add utility classes `bg-set-spanish-main`, `bg-set-crimson-coast`, `bg-set-revolution`
- [x] Create `src/routes/+layout.svelte` (AC: 1)
  - [x] Minimal shell layout — renders children/slot passthrough; AppHeader component stub or placeholder text acceptable here
- [x] Create `src/routes/+error.svelte` stub (referenced in Story 1.4 acceptance criteria)
  - [x] Basic SvelteKit error boundary page displaying the error status and message
- [x] Create `static/images/` directory structure (AC: none, but unblocks later stories)
  - [x] Create empty subdirectories: `static/images/cards/`, `static/images/thumbs/`, `static/images/flags/`, `static/images/backgrounds/`
  - [x] Copy `reference/TanBG.jpg`, `reference/RedBG.jpg`, `reference/BlueBG.jpg` to `static/images/backgrounds/`
- [x] Verify full testing infrastructure (AC: 4)
  - [x] `npm run test:unit` — Vitest reports 0 failures (0 test files is correct)
  - [x] `npm run test:e2e` — Playwright is installed (run `npx playwright install` if needed)
- [x] Verify TypeScript integrity (AC: 1)
  - [x] `npm run check` (or `npx svelte-check`) — 0 errors

## Dev Notes

### Critical Context: This Is Story Zero

This story creates the **entire project foundation**. The repository currently contains ONLY:
- `_bmad/` — BMAD planning tooling (do not touch)
- `_bmad-output/` — Planning artifacts (do not touch)
- `docs/` — Reference documentation
- `reference/` — Source data files (PiratesCards.xml, background images, icons)
- `CLAUDE.md`, `.gitignore`

**There is NO SvelteKit project yet.** The developer must scaffold from scratch using `npx sv create`.

### Exact Initialization Command

[Source: _bmad-output/planning-artifacts/architecture.md#Selected Starter]

```bash
npx sv create pirates-web \
  --template minimal \
  --types ts \
  --add tailwindcss eslint prettier vitest playwright \
  --add sveltekit-adapter="adapter:static"
```

**IMPORTANT — CLI behavior:** The `sv` CLI is interactive. If running interactively, it prompts for project name and add-ons. The flags above are the non-interactive form. If the CLI has changed its flag syntax since the architecture doc was written (check with `npx sv create --help`), the goal is: minimal template + TypeScript + Tailwind CSS v4 + ESLint + Prettier + Vitest + Playwright + adapter-static.

**Scaffolding location:** The CLI will create a `pirates-web/` subdirectory. Either:
- Scaffold into `pirates-web/` and move all files up to the repo root, OR
- Point the CLI at `.` (current directory) if it supports it

**Post-initialization — DaisyUI v5:**

```bash
npm install -D daisyui@latest
```

### Key Configuration Files

#### `svelte.config.js` — adapter-static with SPA fallback

```javascript
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      fallback: 'index.html'  // SPA mode — all routes served by index.html on GitHub Pages
    })
  }
};

export default config;
```

**Why `fallback: 'index.html'` is critical:** Without it, GitHub Pages returns 404 for any SvelteKit client-side route navigated to directly. This is non-negotiable. [Source: architecture.md#AR10]

#### `src/routes/+layout.ts` — Enable static prerendering

```typescript
export const prerender = true;
```

This single export enables full static prerendering for the entire app. Required by AR10. [Source: epics.md#AR10]

#### `src/app.css` — Tailwind v4 + DaisyUI + design token stubs

```css
@import 'tailwindcss';
@plugin "daisyui";

@theme {
  /* =====================================================
     Set-specific background color tokens
     Texture images: static/images/backgrounds/TanBG.jpg,
     RedBG.jpg, BlueBG.jpg (used in full design system — Story 2.1)
     ===================================================== */

  /* Spanish Main: tan/parchment */
  --color-set-spanish-main: oklch(76% 0.05 80);
  --color-set-spanish-main-text: oklch(15% 0.02 80);

  /* Crimson Coast: burgundy/red */
  --color-set-crimson-coast: oklch(35% 0.12 15);
  --color-set-crimson-coast-text: oklch(95% 0.01 80);

  /* Revolution: royal blue */
  --color-set-revolution: oklch(30% 0.12 255);
  --color-set-revolution-text: oklch(95% 0.01 80);
}

/* Set-colored row background utility classes */
/* Story 2.1 will wire in texture background images */
.bg-set-spanish-main {
  background-color: var(--color-set-spanish-main);
  color: var(--color-set-spanish-main-text);
}

.bg-set-crimson-coast {
  background-color: var(--color-set-crimson-coast);
  color: var(--color-set-crimson-coast-text);
}

.bg-set-revolution {
  background-color: var(--color-set-revolution);
  color: var(--color-set-revolution-text);
}
```

**Why CSS-only `@theme` (not `tailwind.config.js`):** Tailwind CSS v4 uses CSS-first configuration. There is no `tailwind.config.js`. All tokens are in `app.css`. Do NOT create `tailwind.config.js`. [Source: architecture.md#Styling Solution]

**Why `@plugin "daisyui"` (not plugins array):** DaisyUI v5 integrates via Tailwind v4's `@plugin` directive in CSS, not via a plugins array in any config file.

#### `src/routes/+layout.svelte` — Minimal app shell

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

Note: This is a minimal passthrough. Story 2.1 replaces this with the full `AppHeader + SidebarLayout` shell. Do NOT build the full UI here.

#### `src/routes/+error.svelte` — SvelteKit error boundary

```svelte
<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="flex flex-col items-center justify-center min-h-screen p-8">
  <h1 class="text-4xl font-bold mb-4">{$page.status}</h1>
  <p class="text-lg">{$page.error?.message ?? 'An unexpected error occurred.'}</p>
</div>
```

This satisfies the error boundary requirement from Story 1.4's acceptance criteria. [Source: epics.md#Story 1.4]

### Project Structure Notes

#### Expected Directory Layout After This Story

```
/                              ← repo root
├── .github/                   ← create empty dir (Story 1.5 adds deploy.yml)
├── _bmad/                     ← DO NOT TOUCH
├── _bmad-output/              ← DO NOT TOUCH
├── docs/                      ← DO NOT TOUCH
├── reference/                 ← DO NOT TOUCH (source data)
│   ├── PiratesCards.xml       ← stays here
│   ├── CardData.xsd           ← stays here
│   ├── TanBG.jpg              ← copy to static/images/backgrounds/
│   ├── RedBG.jpg              ← copy to static/images/backgrounds/
│   ├── BlueBG.jpg             ← copy to static/images/backgrounds/
│   └── icons/                 ← stays here (nationality flags used later)
├── scripts/                   ← create empty dir (Stories 1.2–1.3 add scripts)
├── src/
│   ├── app.css                ← Tailwind + DaisyUI + @theme stubs (see above)
│   ├── app.d.ts               ← SvelteKit ambient types (generated)
│   ├── routes/
│   │   ├── +layout.ts         ← export const prerender = true
│   │   ├── +layout.svelte     ← Minimal children passthrough
│   │   ├── +page.svelte       ← Placeholder (hello world — replaced in Epic 2)
│   │   └── +error.svelte      ← SvelteKit error boundary
│   └── lib/                   ← Empty (populated by Stories 1.2–1.4, Epic 2+)
│       └── .gitkeep           ← Optional: keep dir in git
├── static/
│   ├── favicon.png            ← from scaffold
│   └── images/
│       ├── cards/             ← Empty (card JPGs go here — sourced separately)
│       ├── thumbs/            ← Empty (WebP thumbnails go here — Story 1.3)
│       ├── flags/             ← Empty (nationality flag SVGs/PNGs — Story 2.2)
│       └── backgrounds/       ← TanBG.jpg, RedBG.jpg, BlueBG.jpg (copied from reference/)
├── tests/                     ← Playwright e2e (empty — populated in Stories 2–5)
│   └── .gitkeep               ← Optional
├── svelte.config.js           ← adapter-static + fallback: 'index.html'
├── vite.config.ts             ← (generated — do not modify)
├── package.json               ← Verify all required scripts exist
├── tsconfig.json              ← (generated — verify strict: true)
├── eslint.config.js           ← (generated)
├── .prettierrc                ← (generated)
├── CLAUDE.md                  ← Already exists — DO NOT MODIFY
└── .gitignore                 ← Update to include build/, node_modules/, .svelte-kit/
```

#### Alignment with Architecture

[Source: _bmad-output/planning-artifacts/architecture.md#Complete Project Directory Structure]

The architecture defines the canonical file tree. This story creates the skeleton. Note:
- `src/lib/types/`, `src/lib/state/`, `src/lib/utils/`, `src/lib/components/` are empty until subsequent stories
- `scripts/` is empty until Stories 1.2–1.3
- No card images are expected in `static/images/cards/` yet

### Svelte 5 Runes — No Svelte 4 Patterns

[Source: architecture.md#Enforcement Guidelines]

Even in this minimal story, establish correct patterns from the start:

- **Props:** Always use `$props()` with explicit TypeScript interface
- **Events:** Use callback props — NOT `createEventDispatcher`
- **State:** Use `$state`, `$derived`, `$effect` — NOT `writable`/`readable` from svelte/store
- **Layout:** Use `{@render children()}` — NOT `<slot />`

The `+layout.svelte` example above uses the Svelte 5 `Snippet` pattern for children.

### npm Script Names

Verify these exist in `package.json` after scaffolding:

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `vite dev` | Dev server with HMR |
| `build` | `vite build` | Static build → `/build` |
| `preview` | `vite preview` | Preview static build |
| `check` | `svelte-check --tsconfig ./tsconfig.json` | TS + Svelte type checking |
| `test:unit` | `vitest` | Vitest unit tests |
| `test:e2e` | `playwright test` | Playwright e2e tests |
| `lint` | `eslint .` | ESLint |
| `format` | `prettier --write .` | Prettier format |

The script names may vary slightly (e.g., `check` vs `svelte-check`) based on the CLI version — adapt as needed but ensure all test/build/check scripts are runnable.

### Testing Requirements for This Story

No Vitest unit tests to write. No Playwright e2e tests to write. This story's "testing" is verification:

1. `npm run dev` → dev server starts, page renders in browser
2. `npm run build` → exits 0, `/build` directory exists
3. `npm run check` → exits 0, 0 errors, 0 warnings
4. `npm run test:unit` → Vitest reports "0 tests passed" (not a failure — no test files exist yet)
5. `npm run test:e2e` → Playwright is installed and can find the config

If `npm run test:e2e` fails due to missing browser binaries, run:
```bash
npx playwright install
```

### What This Story Explicitly Does NOT Do

- Does NOT create the XML-to-JSON conversion script (`scripts/convert.ts`) — that is Story 1.2
- Does NOT generate thumbnail images — that is Story 1.3
- Does NOT create TypeScript card types or data loading infrastructure — that is Story 1.4
- Does NOT set up the GitHub Actions workflow — that is Story 1.5
- Does NOT create any real UI components (AppHeader, SidebarLayout, CardRow, etc.) — that is Epic 2
- Does NOT fetch, parse, or use card data in any form

### .gitignore

The scaffold generates a `.gitignore`. Verify or add these entries:

```
node_modules/
.svelte-kit/
build/
dist/
.env
.env.*
!.env.example
```

Note: The `reference/` directory (437 KB XML + background images) should already be committed to git. The `.gitignore` MUST NOT exclude `reference/`.

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Selected Starter] — Exact initialization command
- [Source: _bmad-output/planning-artifacts/architecture.md#Styling Solution] — Tailwind v4 CSS-first config
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture] — adapter-static, prerender config
- [Source: _bmad-output/planning-artifacts/architecture.md#Complete Project Directory Structure] — Full file tree
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Patterns] — Svelte 5 `$props()`, callback props
- [Source: _bmad-output/planning-artifacts/architecture.md#Enforcement Guidelines] — Anti-patterns to avoid
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.1] — User story + acceptance criteria
- [Source: _bmad-output/planning-artifacts/epics.md#Additional Requirements] — AR1, AR2, AR10, UX1

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- sv CLI (v0.12.2) is interactive — `--add tailwindcss` prompts for plugins sub-option; user ran scaffold manually selecting no plugins for tailwindcss
- Scaffold placed CSS in `src/routes/layout.css`; migrated to `src/app.css` (canonical location per story spec) and updated `+layout.svelte` import accordingly
- `@sveltejs/adapter-auto` replaced with `@sveltejs/adapter-static@3.0.10` in package.json; `svelte.config.js` rewritten with `vitePreprocess()` and `fallback: 'index.html'`
- `daisyui@5.5.19` installed; `@plugin "daisyui"` directive confirmed working in Tailwind v4 CSS-first setup
- Build warning `Unknown output options: codeSplitting` is cosmetic (vite/rollup version mismatch in DaisyUI plugin), does not affect output
- `npm run build` produces correct static site in `/build` with `index.html` SPA fallback confirmed

### Completion Notes List

- Scaffolded SvelteKit 2 / Svelte 5 project with TypeScript strict mode, Tailwind CSS v4, ESLint, Prettier, Vitest, Playwright
- Configured `@sveltejs/adapter-static` with `fallback: 'index.html'` for GitHub Pages SPA mode
- Created `src/app.css` with `@import 'tailwindcss'`, `@plugin "daisyui"`, and `@theme` block with all three set color tokens and utility classes
- Created `src/routes/+layout.ts` with `export const prerender = true`
- Created minimal Svelte 5 `+layout.svelte` (uses `$props()` + `{@render children()}` pattern)
- Created `src/routes/+error.svelte` SvelteKit error boundary
- Created `static/images/{cards,thumbs,flags,backgrounds}/` directory structure; copied TanBG.jpg, RedBG.jpg, BlueBG.jpg to backgrounds/
- `npm run check` → 0 errors, 0 warnings (317 files checked)
- `npm run build` → exits 0, static site in `/build`
- `npm run test:unit` → Vitest 1 test passed (scaffold demo.spec.ts), 0 failures
- `npm run test:e2e` → Playwright installed, 1 test found in e2e/demo.test.ts

### File List

- `package.json` (modified — adapter-auto → adapter-static, added daisyui)
- `svelte.config.js` (modified — adapter-static with fallback: 'index.html', added vitePreprocess)
- `src/app.css` (new — Tailwind v4 + DaisyUI plugin + @theme color tokens + utility classes)
- `src/routes/+layout.svelte` (modified — import app.css, Svelte 5 $props pattern, removed scaffold extras)
- `src/routes/+layout.ts` (new — export const prerender = true)
- `src/routes/+error.svelte` (new — SvelteKit error boundary)
- `src/routes/layout.css` (deleted — replaced by src/app.css)
- `static/images/cards/.gitkeep` (new)
- `static/images/thumbs/.gitkeep` (new)
- `static/images/flags/.gitkeep` (new)
- `static/images/backgrounds/TanBG.jpg` (new — copied from reference/)
- `static/images/backgrounds/RedBG.jpg` (new — copied from reference/)
- `static/images/backgrounds/BlueBG.jpg` (new — copied from reference/)
- `src/lib/.gitkeep` (new)
- `scripts/.gitkeep` (new)
- `.gitignore` (modified — scaffold expanded with node_modules, .svelte-kit, build, etc.)
- `vite.config.ts` (scaffold-generated — tailwindcss() + sveltekit() plugins)
- `tsconfig.json` (scaffold-generated — strict: true confirmed)
- `eslint.config.js` (scaffold-generated)
- `playwright.config.ts` (scaffold-generated)
- `src/app.d.ts` (scaffold-generated)
- `src/app.html` (scaffold-generated)
- `src/routes/+page.svelte` (scaffold-generated — placeholder)
- `e2e/demo.test.ts` (scaffold-generated)

## Change Log

- 2026-02-27: Story implemented — SvelteKit project scaffolded and fully configured with Tailwind v4, DaisyUI v5, adapter-static, prerender, error boundary, image directories, and all toolchain verification passing. Status → review.
