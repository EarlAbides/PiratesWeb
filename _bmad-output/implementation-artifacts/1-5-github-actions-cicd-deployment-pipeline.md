# Story 1.5: GitHub Actions CI/CD Deployment Pipeline

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **developer**,
I want a GitHub Actions workflow at `.github/workflows/deploy.yml` that runs `npm run build` and deploys the `/build` output to GitHub Pages on every push to `main`,
so that every merge to main automatically results in an updated live site with zero manual deployment steps.

## Acceptance Criteria

1. **Given** I push a commit to the `main` branch
   **When** the GitHub Actions workflow triggers
   **Then** it installs dependencies, runs `npm run build`, and deploys the `/build` directory to GitHub Pages
   **And** the live site at the GitHub Pages URL reflects the pushed changes

2. **Given** the workflow runs
   **When** `npm run build` fails (e.g., TypeScript error)
   **Then** the deploy step does not run and the live site is not updated

3. **Given** the GitHub Pages deployment
   **When** a user navigates directly to any SvelteKit client-side route
   **Then** the `fallback: 'index.html'` config ensures the app loads correctly (no 404 on deep links)

## Tasks / Subtasks

- [x] Configure `paths.base` in `svelte.config.js` for GitHub Pages project page deployment (AC: 3)
  - [x] Add `paths: { base: process.env.BASE_PATH ?? '' }` to the `kit` config object in `svelte.config.js`
  - [x] Verify `npm run build` still works locally without `BASE_PATH` set (defaults to `''` = root)

- [x] Update `src/routes/+page.ts` to use base-relative URL for `cards.json` fetch (AC: 3)
  - [x] Add `import { base } from '$app/paths';` at the top
  - [x] Change `fetch('/data/cards.json')` → `fetch(`${base}/data/cards.json`)`

- [x] Update `src/lib/utils/cardUtils.ts` to prefix image URLs with `base` (AC: 3)
  - [x] Add `import { base } from '$app/paths';` at the top
  - [x] Change `thumbUrl`: return `${base}/images/thumbs/${webpName}`
  - [x] Change `imageUrl`: return `${base}/images/cards/${card.imageFilename}`
  - [x] Run `npm run test:unit` — Vitest stubs `$app/paths` with `base = ''`, so existing tests should pass unchanged

- [x] Create `.github/workflows/deploy.yml` (AC: 1, 2)
  - [x] Set trigger: `on: push: branches: [main]`
  - [x] Configure top-level permissions: `contents: read`, `pages: write`, `id-token: write`
  - [x] Configure concurrency: `group: pages`, `cancel-in-progress: false`
  - [x] `build` job: `actions/checkout@v4` → `actions/setup-node@v4` (node-version: 24, cache: npm) → `npm ci` → `actions/configure-pages@v5` (capture `id: pages`) → `npm run build` with `env: BASE_PATH: ${{ steps.pages.outputs.base_path }}` → `actions/upload-pages-artifact@v3` (path: build)
  - [x] `deploy` job: `needs: build`, `environment: name: github-pages`, `url: ${{ steps.deployment.outputs.page_url }}`, `actions/deploy-pages@v4`

- [x] Configure GitHub Pages in repository settings — **manual step, cannot be automated** (AC: 1)
  - [x] Go to `https://github.com/EarlAbides/PiratesWeb` → Settings → Pages → Source → select **"GitHub Actions"** (not "Deploy from a branch")
  - [x] Note: the `github-pages` environment is auto-created after the first successful workflow run

- [ ] Validate deployment end-to-end (AC: 1, 2, 3)
  - [ ] Push workflow file to `main` and confirm Actions tab shows the workflow triggered
  - [ ] Confirm `build` job runs `npm ci` + `npm run build` successfully
  - [ ] Confirm `deploy` job runs after `build` and the live GitHub Pages URL is updated
  - [ ] Verify live site at `https://earlabides.github.io/PiratesWeb/` loads with card count displayed
  - [ ] Simulate build failure: introduce a TypeScript error, push, confirm `deploy` job is skipped, revert
  - [ ] Navigate directly to a deep client-side route on the live site — confirm no 404 (SPA fallback working)

## Dev Notes

### Architecture Requirements for This Story

This story implements **AR6** and part of **AR10** from the architecture:

- **AR6:** GitHub Pages deployment via GitHub Actions CI/CD (push to `main` triggers build and deploy)
- **AR10:** `fallback: 'index.html'` set in `svelte.config.js` for SPA mode — already configured in Story 1.1. This causes adapter-static to emit a `404.html` (copy of `index.html`) in the `/build` output. GitHub Pages serves `404.html` for unmatched routes — this is the mechanism that makes client-side routing work on a static host.

[Source: architecture.md#Infrastructure & Deployment]
[Source: architecture.md#Starter Template Evaluation — Architectural Decisions Provided by Starter]

### Exact Workflow File to Create

**File:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm

      - name: Install dependencies
        run: npm ci

      - id: pages
        uses: actions/configure-pages@v5

      - name: Build
        run: npm run build
        env:
          BASE_PATH: ${{ steps.pages.outputs.base_path }}

      - uses: actions/upload-pages-artifact@v3
        with:
          path: build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

**Key design decisions in this workflow:**

- **Two-job structure** (`build` then `deploy`): The `deploy` job has `needs: build` — if the `build` job fails, GitHub Actions never runs `deploy`. This satisfies AC #2 (failed build does not update live site).
- **`cancel-in-progress: false`**: Concurrent deploys are serialized, not cancelled. If two pushes happen close together, the second waits for the first deploy to complete rather than interrupting it. This prevents half-deployed states.
- **`npm ci` not `npm install`**: `npm ci` uses the lockfile exactly, is faster in CI, and fails loudly if `package-lock.json` is out of sync — appropriate for production deployments.
- **Node 24**: Matches `@types/node: ^24` in `package.json` and is compatible with Vite 7 (requires Node 22+).
- **`actions/configure-pages@v5` runs BEFORE build** (with `id: pages`): Its `outputs.base_path` (e.g., `/PiratesWeb`) is passed as `BASE_PATH` env var to the build step. This is how SvelteKit's `paths.base` gets the correct value — automatically, without hardcoding.
- **`path: build`**: Matches SvelteKit adapter-static default output directory (`build/`) as configured in `svelte.config.js`.

### GitHub Pages Repository Configuration (Manual Prerequisite)

The GitHub repository **must** be configured to deploy from GitHub Actions (not from a branch) before the workflow will work. This is a one-time manual setup:

1. Navigate to `https://github.com/EarlAbides/PiratesWeb`
2. Go to **Settings** → **Pages** (left sidebar)
3. Under **Source**, select **"GitHub Actions"**
4. Save

The `github-pages` deployment environment is automatically created by GitHub after the first successful workflow run that uses `environment: github-pages`.

### SPA Mode and Deep Links (AC #3)

The `fallback: 'index.html'` in `svelte.config.js` (already set in Story 1.1) causes SvelteKit adapter-static to generate a `404.html` in `/build` that is a copy of `index.html`. GitHub Pages serves `404.html` for any path that doesn't match a file — so navigating directly to any client-side route loads the SvelteKit app correctly, which then handles routing client-side.

### CRITICAL: GitHub Pages Base Path — Absolute URLs Will Break Without This Fix

**The problem:** This repo is `EarlAbides/PiratesWeb` — not a GitHub user page (`EarlAbides.github.io`). GitHub Pages deploys it at `https://earlabides.github.io/PiratesWeb/`, NOT at the root.

All current absolute URL paths (`/data/cards.json`, `/images/thumbs/...`, `/images/cards/...`) resolve against the host root (`https://earlabides.github.io/...`), NOT the deployment base. Without the fix below, every card image will 404 and every `fetch('/data/cards.json')` will return 404.

**The fix: three files must be updated.**

**1. `svelte.config.js` — add `paths.base`:**

```javascript
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      fallback: 'index.html'
    }),
    paths: {
      base: process.env.BASE_PATH ?? ''  // '' in dev, '/PiratesWeb' in CI
    }
  }
};

export default config;
```

**2. `src/routes/+page.ts` — use `base` in fetch URL (MODIFY from Story 1.4):**

```typescript
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { base } from '$app/paths';
import type { Card } from '$lib/types/cardTypes';

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch(`${base}/data/cards.json`);
  if (!res.ok) {
    throw error(500, 'Failed to load card data');
  }
  const data: unknown = await res.json();
  if (!Array.isArray(data) || data.length === 0 || typeof (data[0] as Record<string, unknown>).cardId !== 'string') {
    throw error(500, 'Card data validation failed');
  }
  const cards = data as Card[];
  return { cards };
};
```

**3. `src/lib/utils/cardUtils.ts` — use `base` in image URLs (MODIFY from Story 1.4):**

```typescript
import type { Card } from '$lib/types/cardTypes';
import { base } from '$app/paths';

export function thumbUrl(card: Card): string {
  const webpName = card.imageFilename.replace(/\.[^.]+$/, '.webp');
  return `${base}/images/thumbs/${webpName}`;
}

export function imageUrl(card: Card): string {
  return `${base}/images/cards/${card.imageFilename}`;
}
```

**Vitest and `$app/paths`:** Vitest with SvelteKit's Vite plugin stubs `$app/paths` — `base` defaults to `''` in tests. Existing `cardUtils.test.ts` should pass unchanged (URLs will be `/images/thumbs/...` in tests, which is correct for the empty-base test environment).

**Local dev:** With no `BASE_PATH` env var, `paths.base` is `''` — app works identically to current behavior at `http://localhost:5173/`.

[Source: architecture.md#Starter Template Evaluation — Build Tooling]
[Source: epics.md#Story 1.5 Acceptance Criteria #3]
[Source: 1-4-card-typescript-types-and-data-loading-infrastructure.md#Dev Notes / +page.ts Load Function Pattern]
[Source: 1-4-card-typescript-types-and-data-loading-infrastructure.md#Dev Notes / cardUtils.ts Helpers]

### Project Structure Notes

#### Files to Create

```
.github/
  workflows/
    deploy.yml    ← CREATE (GitHub Actions CI/CD workflow)
```

#### Files to Modify (from previous stories)

```
svelte.config.js                  ← ADD paths.base config (Story 1.1 base, extending)
src/routes/+page.ts               ← MODIFY fetch URL to use ${base} (Story 1.4 created)
src/lib/utils/cardUtils.ts        ← MODIFY URL helpers to use ${base} (Story 1.4 created)
```

#### Files NOT to Modify

```
src/routes/+layout.ts             ← prerender = true — do not touch
package.json                      ← no new packages needed
src/lib/utils/cardUtils.test.ts   ← tests will pass unchanged (base = '' in Vitest)
```

### Previous Story Intelligence (Stories 1.1–1.4)

Confirmed project state from Story 1.4 completion notes:

- `npm run build` succeeds cleanly — the static build pipeline is verified working
- `npm run check` passes with 0 TypeScript errors
- Build output directory: `/build` (adapter-static default)
- `type: "module"` in `package.json` — ES modules throughout
- `tsx v4.21.0` installed (relevant to scripts, not this story)
- `@types/node: ^24` — Node 24 is the correct version to pin in the workflow

**File system state:**
- `.github/` directory does NOT exist yet — create it
- No GitHub Actions workflows exist

**From Story 1.1 (SvelteKit init):**
- `svelte.config.js` uses `adapter-static` with `fallback: 'index.html'` ✓
- `src/routes/+layout.ts` exports `export const prerender = true` ✓

### Git Intelligence

**Repository:** `git@github.com:EarlAbides/PiratesWeb.git`

**Recent commits (all on `main`):**
- `2c8d152` — Card TypeScript Types and Data Loading Infrastructure [1-4] (Story 1.4)
- `80e49dd` — Story 1-3: WebP thumbnail generation script (Story 1.3)
- `36ba090` — Story 1-2: XML-to-JSON card data conversion script (Story 1.2)
- `da58153` — Story 1-1: Initialize SvelteKit project with full toolchain (Story 1.1)

**Branch pattern:** Dev story workflow creates `story/1-5-github-actions-cicd-deployment-pipeline` and opens a PR on completion. Merge that PR to `main` to trigger the first deployment.

**Note:** The first time the deploy workflow runs (after merging story PR to `main`), you must have the GitHub Pages source already set to "GitHub Actions" — otherwise the deploy job will fail with a permissions error.

### What This Story Explicitly Does NOT Do

- Does NOT add any new npm packages
- Does NOT create a staging environment (solo project, not needed per architecture)
- Does NOT configure branch protection rules or required checks (optional, out of scope)
- Does NOT run `npm run lint` or `npm run check` as part of the CI workflow — build-only per the architecture decision ("Simple GitHub Actions workflow on push to `main`: install → build → deploy")
- Does NOT set up Playwright e2e tests in CI — not specified in acceptance criteria
- Does NOT modify `src/routes/+layout.ts`, `+page.svelte`, `+error.svelte`, or any component files
- Does NOT modify `cardData.svelte.ts`, `cardTypes.ts`, or any types/state files

### References

- [Source: epics.md#Story 1.5] — User story + acceptance criteria
- [Source: architecture.md#Infrastructure & Deployment] — AR6: GitHub Pages + GitHub Actions decision
- [Source: architecture.md#Starter Template Evaluation — Build Tooling] — adapter-static, SPA mode
- [Source: architecture.md#Development Workflow] — "Build & deploy: Push to `main` → GitHub Actions → `npm run build` → deploy `/build` to GitHub Pages"
- [Source: svelte.config.js] — `fallback: 'index.html'` already set
- [Source: package.json] — `npm run build = vite build`, Node 24 (`@types/node: ^24`)
- [Source: 1-4-card-typescript-types-and-data-loading-infrastructure.md#Completion Notes] — `npm run build` confirmed working
- [Source: git remote] — Repository: `EarlAbides/PiratesWeb`

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

- ✅ `svelte.config.js` — added `paths: { base: process.env.BASE_PATH ?? '' }` to kit config. Build verified locally with no `BASE_PATH` set.
- ✅ `src/routes/+page.ts` — imported `base` from `$app/paths`; fetch URL changed to `${base}/data/cards.json`.
- ✅ `src/lib/utils/cardUtils.ts` — imported `base` from `$app/paths`; `thumbUrl` and `imageUrl` helpers now prefix `${base}` to all image paths.
- ✅ `.github/workflows/deploy.yml` — created with two-job structure (`build` → `deploy`), Node 24, `npm ci`, `actions/configure-pages@v5` for dynamic `BASE_PATH`, `cancel-in-progress: false` concurrency.
- ✅ All 5 unit tests pass (`npm run test:unit`) — Vitest stubs `$app/paths` with `base = ''` so existing `cardUtils.test.ts` requires no changes.
- ✅ `npm run check` — 0 TypeScript errors, 0 warnings.
- ✅ `npm run build` — clean build, output to `/build` directory.
- ⚠️ Task 5 (Configure GitHub Pages in repo settings) — **manual step** requiring GitHub UI. Must be done by Captain before first deployment will succeed: Settings → Pages → Source → "GitHub Actions".
- ⚠️ Task 6 (Validate deployment end-to-end) — post-merge verification. Will be completed by Captain after PR is merged and first workflow run completes.

### File List

- `.github/workflows/deploy.yml` (created)
- `svelte.config.js` (modified)
- `src/routes/+page.ts` (modified)
- `src/lib/utils/cardUtils.ts` (modified)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified — status updated)
- `_bmad-output/implementation-artifacts/1-5-github-actions-cicd-deployment-pipeline.md` (modified — this file)

## Change Log

- 2026-02-28: Implemented GitHub Actions CI/CD pipeline (deploy.yml), added `paths.base` to svelte.config.js, updated +page.ts and cardUtils.ts to use `${base}` prefix for all URLs. All automated tasks complete; Tasks 5–6 are manual/post-deploy verification steps for Captain.
