---
title: 'Icon Pre-Work — Nationality Flags, Stat Icons, and Cannon Pips'
slug: 'icon-prework-flags-stat-cannon'
created: '2026-02-28'
status: 'completed'
stepsCompleted: [1, 2, 3, 4]
tech_stack:
  [
    'SvelteKit 2 / Svelte 5',
    'TypeScript strict',
    'Tailwind CSS v4 CSS-first',
    'DaisyUI v5',
    'Vitest'
  ]
files_to_modify:
  - 'src/app.css'
  - 'src/lib/utils/cardUtils.ts'
  - 'src/lib/utils/cardUtils.test.ts'
  - 'src/lib/components/icons/stat/MastIcon.svelte (CREATE)'
  - 'src/lib/components/icons/stat/CargoIcon.svelte (CREATE)'
  - 'src/lib/components/icons/stat/MoveIcon.svelte (CREATE)'
  - 'src/lib/components/icons/stat/CannonIcon.svelte (CREATE)'
  - 'src/lib/components/icons/cannons/CannonPip.svelte (CREATE)'
  - 'src/lib/components/icons/cannons/index.ts (CREATE)'
  - 'src/lib/components/icons/cannons/index.test.ts (CREATE)'
  - 'static/images/flags/english.svg (CREATE)'
  - 'static/images/flags/spanish.svg (CREATE)'
  - 'static/images/flags/pirates.svg (CREATE)'
  - 'static/images/flags/french.svg (CREATE)'
  - 'static/images/flags/american.svg (CREATE)'
  - 'static/images/flags/barbary.svg (CREATE)'
code_patterns:
  - 'Svelte 5 $props() with explicit TypeScript interface Props'
  - 'Tailwind v4 @theme block in app.css for design tokens'
  - 'ES module imports throughout'
  - 'No tailwind.config.js — CSS-first only'
  - 'No vite-plugin-svgr — inline SVG in .svelte files'
test_patterns:
  - 'Vitest co-located .test.ts files'
  - 'describe/it/expect pattern'
  - 'Pure TS utility functions unit tested; Svelte components verified via npm run check'
---

# Tech-Spec: Icon Pre-Work — Nationality Flags, Stat Icons, and Cannon Pips

**Created:** 2026-02-28

## Overview

### Problem Statement

Epic 2 (Card Discovery — Browse & Filter) requires two visual asset sets that do not yet exist: period-accurate nationality flag images for the `NationalityFlag` component (Story 2.2), and stat/cannon pip icons for the `StatBar` and `CannonDisplay` components (Story 2.2). The existing reference GIFs in `reference/icons/` are low resolution and not suitable for production use. The full SVG icon design is already specified in `svg-icon-spec.md` but has not been implemented. Without these assets, Story 2.2 cannot be implemented.

### Solution

Create 6 period-accurate SVG nationality flags as static files in `static/images/flags/`, and implement all 16 stat/cannon pip icons as Svelte 5 components in `src/lib/components/icons/` — following the existing svg-icon-spec.md design exactly, with no new npm packages required.

### Scope

**In Scope:**

- 6 nationality flag SVGs (period-accurate) → `static/images/flags/`
- 4 stat icon Svelte components (Mast, Cargo, Move, Cannon) → `src/lib/components/icons/stat/`
- 1 `CannonPip.svelte` component (covers all 12 pip variants via props) → `src/lib/components/icons/cannons/`
- `cannons/index.ts` module with `parseCannonPip()` utility → `src/lib/components/icons/cannons/`
- Icon color token additions to `src/app.css` `@theme` block
- `flagUrl(nationality)` helper added to `src/lib/utils/cardUtils.ts`
- Unit tests for `flagUrl()` and `parseCannonPip()`

**Out of Scope:**

- `StatBar` component — Epic 2, Story 2.2
- `CannonDisplay` component — Epic 2, Story 2.2
- `NationalityFlag` component — Epic 2, Story 2.2
- PPSMU dataset removal — separate prep task
- Any card browse UI — Epic 2

## Context for Development

### Codebase Patterns

- **Svelte 5** throughout — `<script lang="ts">`, explicit `interface Props`, `$props()`, no Svelte 4 patterns
- **Tailwind CSS v4 CSS-first** — color tokens go in `src/app.css` `@theme` block. `tailwind.config.js` does NOT exist in this project.
- **ES module imports** — `import`, never `require`; `"type": "module"` in package.json
- **TypeScript strict mode** — no implicit `any`, explicit types everywhere, no eslint-disable
- **No `vite-plugin-svgr`** — icons are Svelte `.svelte` components containing inline SVG markup
- **`npm run check`** must pass with 0 errors; `npm run test:unit` must pass with 0 failures
- **`src/lib/components/` does not exist yet** — this task creates it
- **Co-located tests** — `.test.ts` files sit alongside the file they test (see `cardUtils.test.ts`)
- **`Nationality` type** is `'English' | 'Spanish' | 'Pirates' | 'French' | 'American' | 'Barbary'` — flag filenames must match these exact strings (lowercase)

### Files to Reference

| File                                               | Purpose                                                                       |
| -------------------------------------------------- | ----------------------------------------------------------------------------- |
| `_bmad-output/planning-artifacts/svg-icon-spec.md` | Full SVG design spec — shapes, colors, viewBox, dot patterns for all 16 icons |
| `src/app.css`                                      | Add icon color tokens to existing `@theme` block (after set color tokens)     |
| `src/lib/types/cardTypes.ts`                       | `Nationality` type — the 6 values dictate flag filenames                      |
| `src/lib/utils/cardUtils.ts`                       | Add `flagUrl(nationality)` helper alongside existing `thumbUrl`/`imageUrl`    |
| `src/lib/utils/cardUtils.test.ts`                  | Test pattern reference — co-located Vitest, describe/it/expect                |
| `src/routes/+layout.svelte`                        | Svelte 5 component pattern reference (`$props()`, explicit interface)         |
| `reference/icons/`                                 | 6 low-res GIFs — shape reference only, NOT the output                         |
| `static/images/flags/`                             | Output for flag SVGs (directory exists, empty)                                |

### Technical Decisions

- **Single `CannonPip.svelte` component** (not 12 individual files): Accepts `type: 'S' | 'L'` and `roll: 1 | 2 | 3 | 4 | 5 | 6` props, renders the correct shape and dot pattern internally. Cleaner than 12 separate `.svelte` files.
- **`parseCannonPip(cannon: string)`** utility exported from `src/lib/components/icons/cannons/index.ts` — parses `"S3"` → `{ type: 'S', roll: 3 }` for use in `CannonDisplay` (Epic 2).
- **`flagUrl(nationality: Nationality)`** added to `cardUtils.ts` — returns `${base}/images/flags/${nationality.toLowerCase()}.svg`. Consistent with existing `thumbUrl`/`imageUrl` helpers, respects `base` path for GitHub Pages.
- **Svelte components over SVG files for stat icons/pips**: Inline SVG in `.svelte` files — no additional npm packages, full TypeScript props, CSS themeable.
- **Static SVG files for flags**: Used via `<img>` in `NationalityFlag` component (Epic 2) — static files in `static/images/flags/`, served by adapter-static.
- **svg-icon-spec.md color tokens correction**: The spec references `tailwind.config.js` — this is wrong for this project. All color tokens go in `src/app.css @theme` as CSS custom properties.

## Implementation Plan

### Tasks

- [x] Task 1: Add icon color tokens to `src/app.css`
  - File: `src/app.css`
  - Action: Append 7 CSS custom properties inside the existing `@theme {}` block, after the last set color token. Use this exact block:
    ```css
    /* Icon colors */
    --color-icon-bg: #000000;
    --color-icon-ship: #ffffff;
    --color-icon-gold: #c8960c;
    --color-pip-short-bg: #ffffff;
    --color-pip-short-dot: #000000;
    --color-pip-long-bg: #c0272d;
    --color-pip-long-dot: #ffffff;
    ```
  - Notes: Read `src/app.css` first to confirm exact location and indentation style of existing `@theme` tokens.

- [x] Task 2: Add `flagUrl()` helper to `src/lib/utils/cardUtils.ts`
  - File: `src/lib/utils/cardUtils.ts`
  - Action: Import `Nationality` from `'$lib/types/cardTypes'` (if not already imported). Add the following export after the existing `imageUrl` function:
    ```ts
    export function flagUrl(nationality: Nationality): string {
    	return `${base}/images/flags/${nationality.toLowerCase()}.svg`;
    }
    ```
  - Notes: `base` is already imported from `'$app/paths'` in this file. `Nationality` is in `cardTypes.ts`. Follow the exact same pattern as `thumbUrl` and `imageUrl`.

- [x] Task 3: Add `flagUrl()` unit tests to `src/lib/utils/cardUtils.test.ts`
  - File: `src/lib/utils/cardUtils.test.ts`
  - Action: Add a new `describe('flagUrl', ...)` block to the existing test file. Test all 6 Nationality values, confirming each returns a path ending in `/{nationality-lowercase}.svg`. Example:
    ```ts
    describe('flagUrl', () => {
    	it('returns lowercase svg path for each nationality', () => {
    		expect(flagUrl('English')).toContain('english.svg');
    		expect(flagUrl('Spanish')).toContain('spanish.svg');
    		expect(flagUrl('Pirates')).toContain('pirates.svg');
    		expect(flagUrl('French')).toContain('french.svg');
    		expect(flagUrl('American')).toContain('american.svg');
    		expect(flagUrl('Barbary')).toContain('barbary.svg');
    	});
    });
    ```
  - Notes: Import `flagUrl` alongside existing imports. The `base` prefix will be empty string in test environment — use `toContain` not `toBe` to avoid coupling to base path.

- [x] Task 4: Create `src/lib/components/icons/stat/MastIcon.svelte`
  - File: `src/lib/components/icons/stat/MastIcon.svelte` (new file, new directory)
  - Action: Create Svelte 5 component. No props needed (static icon). Inline SVG, `viewBox="0 0 24 24"`, three layers:
    1. Black background rect `fill="#000000"`
    2. Full ship silhouette in white `fill="#FFFFFF"` — hull (y:14–22), two masts, sails
    3. Masts and sails re-drawn in gold `fill="#C8960C"` (same geometry as layer 2 masts/sails)
  - Include `aria-hidden="true"` on the `<svg>` element.
  - Notes: This establishes the canonical ship silhouette geometry. Record the exact hull/mast/sail path data here — CargoIcon reuses it pixel-identical.

- [x] Task 5: Create `src/lib/components/icons/stat/CargoIcon.svelte`
  - File: `src/lib/components/icons/stat/CargoIcon.svelte` (new file)
  - Action: Create Svelte 5 component. Inline SVG, `viewBox="0 0 24 24"`, three layers:
    1. Black background rect `fill="#000000"`
    2. Full ship silhouette in white `fill="#FFFFFF"` — **exact same hull/mast/sail path geometry as MastIcon**
    3. Cargo hold area in gold `fill="#C8960C"` — oval or rect in center-lower hull region, approximately `x:6–18, y:15–20`
  - Include `aria-hidden="true"` on the `<svg>` element.
  - Notes: Copy hull/mast/sail paths verbatim from MastIcon — pixel-identical geometry is required. Only layer 3 differs.

- [x] Task 6: Create `src/lib/components/icons/stat/MoveIcon.svelte`
  - File: `src/lib/components/icons/stat/MoveIcon.svelte` (new file)
  - Action: Create Svelte 5 component. Inline SVG, `viewBox="0 0 24 24"`, three layers:
    1. Black background rect `fill="#000000"`
    2. Ship silhouette in white `fill="#FFFFFF"` — same base ship form, horizontally compressed to ~80% width, left-aligned, to leave room for arrow
    3. Rightward arrow in gold `fill="#C8960C"` — shaft rect approximately `x:14–19, y:11–13`, triangular arrowhead with tip at `x:22, y:12`
  - Include `aria-hidden="true"` on the `<svg>` element.
  - Notes: The ship is context only; the gold arrow is the focal point. Arrow tip should align with approximately horizontal center (y:12).

- [x] Task 7: Create `src/lib/components/icons/stat/CannonIcon.svelte`
  - File: `src/lib/components/icons/stat/CannonIcon.svelte` (new file)
  - Action: Create Svelte 5 component. Inline SVG, `viewBox="0 0 24 24"`, two layers only:
    1. Black background rect `fill="#000000"`
    2. Cannon shape in gold `fill="#C8960C"` (no white layer): tapered barrel pointing left (~60% of width), rectangular carriage body, two circle wheels below carriage. Horizontal orientation. No stroke needed.
  - Include `aria-hidden="true"` on the `<svg>` element.
  - Notes: This is the only stat icon without a white ship form. Barrel tapers from carriage (~x:12) toward muzzle (~x:3). Wheels sit below carriage (y:16–20), circles with r≈2.5.

- [x] Task 8: Create `src/lib/components/icons/cannons/CannonPip.svelte`
  - File: `src/lib/components/icons/cannons/CannonPip.svelte` (new file, new directory)
  - Action: Create Svelte 5 component with typed props:
    ```ts
    interface Props {
    	type: 'S' | 'L';
    	roll: 1 | 2 | 3 | 4 | 5 | 6;
    }
    const { type, roll }: Props = $props();
    ```
  - Inline SVG, `viewBox="0 0 16 16"`, `aria-hidden="true"`.
  - **Short pip (type='S'):** Rounded square `<rect x="1" y="1" width="14" height="14" rx="2" ry="2" fill="#FFFFFF" stroke="#CCCCCC" stroke-width="0.5"/>`. Black dots `r="1.2"` at standard die-face positions.
  - **Long pip (type='L'):** Diamond `<polygon points="8,1 15,8 8,15 1,8" fill="#C0272D"/>`. White dots `r="1.2"` at same positions but corner dots pulled ~2px toward center.
  - **Dot positions by roll value:**
    - 1: center `(8,8)`
    - 2: top-right `(11,4)`, bottom-left `(5,12)` — for L: `(11,5.5)`, `(5,10.5)`
    - 3: top-right, center `(8,8)`, bottom-left — same adjustment for L
    - 4: four corners `(5,4),(11,4),(5,12),(11,12)` — for L: `(6,5.5),(10,5.5),(6,10.5),(10,10.5)`
    - 5: four corners + center — same L adjustments
    - 6: two columns of three `(5,4),(5,8),(5,12),(11,4),(11,8),(11,12)` — for L: `(6,5.5),(6,8),(6,10.5),(10,5.5),(10,8),(10,10.5)`
  - Use `{#if}` / `{:else if}` blocks per roll value. Use `{#if type === 'S'}` to choose shape and dot color.
  - Notes: The `roll` prop determines dot count/pattern; `type` determines shape+colors. Keep SVG markup clean — one `{#if}` block for shape, one for dots.

- [x] Task 9: Create `src/lib/components/icons/cannons/index.ts`
  - File: `src/lib/components/icons/cannons/index.ts` (new file)
  - Action: Export the `parseCannonPip` utility function and supporting types:

    ```ts
    export type CannonType = 'S' | 'L';
    export type CannonRoll = 1 | 2 | 3 | 4 | 5 | 6;

    export interface CannonPipData {
    	type: CannonType;
    	roll: CannonRoll;
    }

    const VALID_TYPES = new Set<string>(['S', 'L']);
    const VALID_ROLLS = new Set<number>([1, 2, 3, 4, 5, 6]);

    export function parseCannonPip(cannon: string): CannonPipData {
    	const type = cannon[0];
    	const roll = parseInt(cannon.slice(1), 10);
    	if (!VALID_TYPES.has(type) || !VALID_ROLLS.has(roll)) {
    		throw new TypeError(
    			`Invalid cannon pip string: "${cannon}". Expected format: S1–S6 or L1–L6.`
    		);
    	}
    	return { type: type as CannonType, roll: roll as CannonRoll };
    }
    ```

  - Notes: Throw `TypeError` (not generic `Error`) for invalid inputs — this aids downstream error handling in CannonDisplay. No default export — named exports only.

- [x] Task 10: Create `src/lib/components/icons/cannons/index.test.ts`
  - File: `src/lib/components/icons/cannons/index.test.ts` (new file)
  - Action: Co-located Vitest unit tests for `parseCannonPip`. Test all 12 valid inputs, invalid type, invalid roll, and empty string:

    ```ts
    import { describe, it, expect } from 'vitest';
    import { parseCannonPip } from './index';

    describe('parseCannonPip', () => {
    	it('parses all valid short cannon strings', () => {
    		for (let roll = 1; roll <= 6; roll++) {
    			const result = parseCannonPip(`S${roll}`);
    			expect(result).toEqual({ type: 'S', roll });
    		}
    	});

    	it('parses all valid long cannon strings', () => {
    		for (let roll = 1; roll <= 6; roll++) {
    			const result = parseCannonPip(`L${roll}`);
    			expect(result).toEqual({ type: 'L', roll });
    		}
    	});

    	it('throws TypeError for invalid type', () => {
    		expect(() => parseCannonPip('X3')).toThrow(TypeError);
    	});

    	it('throws TypeError for invalid roll', () => {
    		expect(() => parseCannonPip('S7')).toThrow(TypeError);
    	});

    	it('throws TypeError for empty string', () => {
    		expect(() => parseCannonPip('')).toThrow(TypeError);
    	});
    });
    ```

- [x] Task 11: Create 6 nationality flag SVGs in `static/images/flags/`
  - Files: `english.svg`, `spanish.svg`, `pirates.svg`, `french.svg`, `american.svg`, `barbary.svg`
  - Action: Create one SVG file per nationality. All flags use `viewBox="0 0 60 40"` (3:2 aspect ratio standard). Period-accurate, stylized (not photorealistic), target <4KB each.
  - **english.svg** — Red Ensign: red background (`#CF142B`), Union Flag canton in top-left (1/4 width). Union Flag = white diagonal cross + red diagonal cross + white horizontal/vertical cross on blue.
  - **spanish.svg** — Castle and León: horizontal triband red/gold/red (`#AA151B` / `#F1BF00`). Quarterly coat of arms in center on gold band — castle on red fields, lion on white fields.
  - **pirates.svg** — Jolly Roger: black background (`#000000`), white skull centered (circle head + two eye sockets + teeth row), two crossed white bones below skull.
  - **french.svg** — Royal French standard: blue background (`#003189`) with gold fleur-de-lis pattern (3 fleurs arranged 2-over-1, centered in flag).
  - **american.svg** — Betsy Ross: 13 red and white horizontal stripes (7 red, 6 white). Blue canton top-left (1/4 width) with 13 white five-pointed stars arranged in a circle.
  - **barbary.svg** — Ottoman-influenced Barbary: red background (`#C8102E`) with white crescent moon (left-facing, open-right orientation) and single white five-pointed star inside the crescent arc.
  - Notes: Keep geometry simple — SVG shapes only (rect, circle, polygon, path). No embedded raster images. All flags must render clearly at 24×16px (the size NationalityFlag component will use).

- [x] Task 12: Verify all checks pass
  - Action: Run `npm run check` — must exit 0 errors. Run `npm run test:unit` — must exit 0 failures.
  - Notes: Fix any TypeScript type errors before marking this spec done. Svelte component props must match their `interface Props` exactly.

---

## Review Notes

- Adversarial review completed
- Findings: 13 total, 5 fixed, 5 skipped (noise/intentional), 1 deferred, 2 combined (F1+F2)
- Resolution approach: walk-through
- Post-review changes: Union Jack corrected, Betsy Ross circle fixed, barbary.svg removed, Svelte components use CSS tokens, parseCannonPip length guard added, SVG titles added

### Acceptance Criteria

- [x] AC 1: Given `src/app.css`, when the `@theme {}` block is read, then 7 icon color custom properties are present: `--color-icon-bg`, `--color-icon-ship`, `--color-icon-gold`, `--color-pip-short-bg`, `--color-pip-short-dot`, `--color-pip-long-bg`, `--color-pip-long-dot`, with the correct hex values from the spec.

- [x] AC 2: Given `cardUtils.ts` and a valid `Nationality` value, when `flagUrl('English')` is called, then it returns a string containing `english.svg` and using the same `base` prefix as `thumbUrl` and `imageUrl`.

- [x] AC 3: Given all 6 `Nationality` values, when `flagUrl` is called with each, then the result always ends in `{nationality-lowercase}.svg` — confirming the lowercase convention for all 6 flag filenames.

- [x] AC 4: Given `MastIcon.svelte`, when rendered, then the SVG has `viewBox="0 0 24 24"`, `aria-hidden="true"`, a black background, a white ship silhouette, and masts/sails rendered in gold (`#C8960C`).

- [x] AC 5: Given `CargoIcon.svelte`, when rendered, then the SVG has `viewBox="0 0 24 24"`, `aria-hidden="true"`, and the hull/mast/sail paths in layer 2 are pixel-identical geometry to `MastIcon.svelte`'s layer 2, with a gold hold area in layer 3.

- [x] AC 6: Given `MoveIcon.svelte`, when rendered, then the SVG has `viewBox="0 0 24 24"`, `aria-hidden="true"`, a horizontally compressed white ship, and a visible gold rightward arrow on the right side of the viewBox.

- [x] AC 7: Given `CannonIcon.svelte`, when rendered, then the SVG has `viewBox="0 0 24 24"`, `aria-hidden="true"`, a black background, and a gold cannon-on-carriage shape with no white layer.

- [x] AC 8: Given `CannonPip.svelte` with `type='S'` and `roll=3`, when rendered, then the SVG shows a white rounded square with 3 black dots in diagonal (top-right, center, bottom-left) die-face pattern.

- [x] AC 9: Given `CannonPip.svelte` with `type='L'` and `roll=3`, when rendered, then the SVG shows a red diamond with 3 white dots in diagonal die-face pattern, with corner dots pulled toward center to remain within the diamond.

- [x] AC 10: Given `parseCannonPip('S3')`, when called, then it returns `{ type: 'S', roll: 3 }`.

- [x] AC 11: Given `parseCannonPip('L6')`, when called, then it returns `{ type: 'L', roll: 6 }`.

- [x] AC 12: Given an invalid cannon string (e.g., `'X7'`, `'S7'`, `''`), when `parseCannonPip` is called, then it throws a `TypeError` with a descriptive message including the invalid input.

- [x] AC 13: Given `static/images/flags/` directory, when listing files, then exactly 6 SVG files exist: `english.svg`, `spanish.svg`, `pirates.svg`, `french.svg`, `american.svg`, `barbary.svg` — and each renders a recognizable, period-accurate flag design at 24×16px.

- [x] AC 14: Given all files created/modified per this spec, when `npm run check` is executed, then it exits with 0 errors.

- [x] AC 15: Given all files created/modified per this spec, when `npm run test:unit` is executed, then all tests pass with 0 failures (including new `flagUrl` and `parseCannonPip` tests).

## Additional Context

### Dependencies

- Depends on Story 1.1 (SvelteKit project initialized) ✅
- Must be complete before Epic 2 Story 2.2 is implemented
- PPSMU removal (separate task) has no dependency on this work
- No new npm packages required — all implementation uses existing toolchain

### Testing Strategy

**Unit Tests (Vitest):**

- `src/lib/utils/cardUtils.test.ts` — extend existing file with `describe('flagUrl', ...)` block covering all 6 Nationality values
- `src/lib/components/icons/cannons/index.test.ts` — new co-located file covering `parseCannonPip`: all 12 valid inputs (S1–S6, L1–L6), invalid type, invalid roll out of range, empty string

**Type Checking:**

- `npm run check` validates all Svelte 5 TypeScript props compile correctly, all `$props()` destructuring matches their `interface Props`, and all imports resolve

**Manual Verification (after implementation):**

- Visually inspect all 4 stat icon components match `svg-icon-spec.md` shapes at 24px and 16px sizes
- Visually inspect CannonPip at all 12 type/roll combinations — confirm correct dot count and die-face pattern
- Visually inspect all 6 flag SVGs at small sizes (24×16px) — confirm they are recognizable
- Confirm `flagUrl` outputs resolve to actual files in `static/images/flags/`

### Notes

**Known risks (pre-mortem):**

1. **Ship silhouette geometry consistency** — MastIcon and CargoIcon must share pixel-identical hull/mast/sail paths. Risk: slight drift during implementation. Mitigation: document the exact path data once (in MastIcon) and copy verbatim to CargoIcon.

2. **Diamond dot positioning for Long pips** — corner dots on L4, L5, L6 must be pulled ~2px toward center to stay within the diamond shape. Risk: dots appear clipped or outside the visible diamond at small sizes. Mitigation: use the exact adjusted coordinates from the spec, test at 14–16px rendered size.

3. **Flag SVG complexity vs. file size** — Period-accurate flags (Betsy Ross 13 stars, Spanish coat of arms) can grow complex. Target <4KB per file. Mitigation: use simplified geometric approximations — the flags are rendered at 24×16px, so photorealistic detail is neither visible nor required.

4. **Tailwind v4 `@theme` token naming** — Tokens must use `--color-{name}` format to be available as Tailwind utility classes (e.g., `bg-icon-bg`). If the wrong prefix is used, the tokens won't generate utilities. Mitigation: read existing `src/app.css` set color tokens to confirm exact format before writing new ones.

5. **`parseCannonPip` called with multi-digit roll** — Canon string `"S10"` would parse roll as 10, which is invalid. The `VALID_ROLLS` set guard catches this. Ensure `parseInt` is used (not `Number()`) and the set check runs before returning.

**svg-icon-spec.md errors corrected in this spec:**

- Spec references `tailwind.config.js` for color tokens → corrected to `src/app.css @theme`
- Spec references `src/lib/assets/icons/` path → corrected to `src/lib/components/icons/`
- Spec references `?component` import (requires vite-plugin-svgr) → corrected to inline SVG in `.svelte` components
- Spec references `CANNON_PIPS` import map → corrected to `parseCannonPip()` function in `cannons/index.ts`
