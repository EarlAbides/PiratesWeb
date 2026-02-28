# Story 1.3: WebP Thumbnail Generation Script

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **developer**,
I want a `scripts/generate-thumbnails.ts` script that generates WebP thumbnails (~200px wide) from all 424 source JPGs and commits them to `static/images/thumbs/`,
So that the card browse view has lightweight, browser-cache-friendly thumbnail images served with stable URLs and ~30–50% smaller file sizes than the originals.

## Acceptance Criteria

1. **Given** the 424 source JPGs exist in `static/images/cards/`
   **When** I run `npx tsx scripts/generate-thumbnails.ts`
   **Then** a corresponding `.webp` thumbnail is generated in `static/images/thumbs/` for every source JPG
   **And** each thumbnail filename matches the source filename convention with `.webp` extension (e.g., `PPSM_EC-001.webp`)

2. **Given** a generated WebP thumbnail
   **When** I check its dimensions
   **Then** its width is approximately 200px and aspect ratio matches the original card image

3. **Given** the thumbnails are generated
   **When** I run `npm run build`
   **Then** the thumbnails are included in the static build output under `/build/images/thumbs/`

## Tasks / Subtasks

- [x] Copy source JPGs from legacy project to `static/images/cards/` (pre-req)
  - [x] Copy all 424 JPGs from `/Users/jearl/Projects/Legacy/Pirates!/Pirates!/Images/` to `static/images/cards/`
  - [x] Remove or replace the `static/images/cards/.gitkeep` placeholder
  - [x] Confirm count: `ls static/images/cards/*.jpg | wc -l` should be 424
- [x] Install `sharp` dev dependency (AC: all)
  - [x] Run `npm install -D sharp`
  - [x] Verify `sharp` appears in `package.json` devDependencies
- [x] Create `scripts/generate-thumbnails.ts` (AC: 1, 2)
  - [x] Import `sharp` and Node.js `fs`/`path` built-ins using ES module syntax
  - [x] Read all `.jpg` files from `static/images/cards/`
  - [x] For each JPG, resize to 200px wide (preserving aspect ratio) and convert to WebP
  - [x] Write output to `static/images/thumbs/` with `.webp` extension
  - [x] Print summary: total thumbnails generated
- [x] Run script and verify output (AC: 1, 2)
  - [x] `npx tsx scripts/generate-thumbnails.ts` exits 0 and prints count
  - [x] Verify 424 WebP files in `static/images/thumbs/`
  - [x] Spot-check filenames match convention (e.g., `PPSM_EC-001.webp`, `PPCC_011.webp`)
  - [x] Verify thumbnail width is ~200px (use sharp metadata or browser inspection)
  - [x] Verify aspect ratio preserved (not square-cropped)
- [x] Commit `static/images/thumbs/` to the repository (AC: 3)
  - [x] These are committed artifacts — verify they are tracked by git
  - [x] Remove or replace `static/images/thumbs/.gitkeep` if it exists
  - [x] Confirm `npm run build` includes them under `/build/images/thumbs/`

## Dev Notes

### Critical Pre-Requisite: Source Images Location

**The 424 source JPGs are NOT yet in the repository.** They must be copied from the legacy project first.

**Source location (local machine):**
```
/Users/jearl/Projects/Legacy/Pirates!/Pirates!/Images/
```

**Destination:**
```
static/images/cards/
```

**Copy command:**
```bash
cp "/Users/jearl/Projects/Legacy/Pirates!/Pirates!/Images/"*.jpg static/images/cards/
```

**Verify count:**
```bash
ls static/images/cards/*.jpg | wc -l
# Expected: 424
```

The `.gitkeep` placeholder in `static/images/cards/` can be removed after the JPGs are copied:
```bash
rm static/images/cards/.gitkeep
```

**Note on committing JPGs:** The 424 source JPGs are large binary assets. Decide whether to commit them directly or gitignore them (since they're available from the legacy project locally). The architecture treats them as the input to the thumbnail generation process. The **WebP thumbnails** in `static/images/thumbs/` MUST be committed (they are the committed artifact per AR5). The source JPGs may or may not be committed — check with the project owner. If gitignored, add a note in the README about re-generating from the legacy source.

### Library: sharp

**Architecture specifies `sharp` as the image processing library.** [Source: architecture.md#Development Workflow]

**Install:**
```bash
npm install -D sharp
```

**Why sharp:**
- Industry standard for Node.js image processing
- Excellent WebP conversion quality and speed
- Native bindings for performance
- Supports resize with aspect ratio preservation

**TypeScript types:** `sharp` ships its own types — no `@types/sharp` needed.

**CRITICAL: ES Module Syntax Required**

`package.json` has `"type": "module"` — use `import`, NOT `require`:
```typescript
// ✅ Correct
import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, join, basename, extname } from 'node:path';

// ❌ Wrong — CommonJS, will fail
const sharp = require('sharp');
```

### Implementation Approach

**Core logic:**
```typescript
import sharp from 'sharp';
import { readdirSync, mkdirSync } from 'node:fs';
import { resolve, join, basename, extname } from 'node:path';

const inputDir = resolve('static/images/cards');
const outputDir = resolve('static/images/thumbs');
const THUMB_WIDTH = 200;

mkdirSync(outputDir, { recursive: true });

const jpgFiles = readdirSync(inputDir).filter(f => extname(f).toLowerCase() === '.jpg');

let count = 0;
for (const file of jpgFiles) {
  const inputPath = join(inputDir, file);
  const outputName = basename(file, extname(file)) + '.webp';
  const outputPath = join(outputDir, outputName);

  await sharp(inputPath)
    .resize({ width: THUMB_WIDTH })   // preserves aspect ratio by default
    .webp({ quality: 80 })
    .toFile(outputPath);

  count++;
}

console.log(`Generated ${count} WebP thumbnails in ${outputDir}`);
```

**Key `sharp` options:**
- `resize({ width: 200 })` — resize to 200px wide, preserving aspect ratio (no crop)
- `.webp({ quality: 80 })` — 80% quality is a good balance for card thumbnails
- No `height` constraint needed — let the aspect ratio determine the height

### Filename Convention

Architecture specifies: **"match source filename convention with `.webp` extension"**
[Source: architecture.md#Naming Patterns]

```
Source:    static/images/cards/PPSM_EC-001.jpg
Thumbnail: static/images/thumbs/PPSM_EC-001.webp

Source:    static/images/cards/PPCC_011.jpg
Thumbnail: static/images/thumbs/PPCC_011.webp

Source:    static/images/cards/PPRV_016.jpg
Thumbnail: static/images/thumbs/PPRV_016.webp
```

This convention is critical because:
- The card data's `imageFilename` field (e.g., `"PPSM_EC-001.jpg"`) is the reference
- Components will derive thumbnail URL by replacing `.jpg` with `.webp` and prepending `/images/thumbs/`
- `cardUtils.ts` (Story 1.4) will have a `thumbUrl(card)` helper using this convention

### URL Mapping for Components (Story 1.4 context)

The thumbnail URL pattern that Story 1.4's `cardUtils.ts` will implement:
```typescript
// Future: src/lib/utils/cardUtils.ts
function thumbUrl(card: Card): string {
  const webpName = card.imageFilename.replace(/\.jpg$/i, '.webp');
  return `/images/thumbs/${webpName}`;
}
```

This story's thumbnails must conform to this convention.

### Image Naming Edge Cases

From `static/data/cards.json` (produced by Story 1.2):
- Standard PPSM format: `PPSM_EC-001.jpg`, `PPSM_GS-001.jpg`, `PPSM_SS-001.jpg`
- PPCC numbered format: `PPCC_001.jpg`, `PPCC_046_2.jpg` (note: underscore in card number)
- PPRV numbered format: `PPRV_001.jpg`, `PPRV_144.jpg`
- PPSMU (Unlimited): `PPSMU_*` if such files exist in the legacy directory

**Note on card numbers with underscores:** `PPCC_046_2.jpg` is a valid filename — do NOT sanitize or strip underscores. The basename substitution handles this correctly.

### Project Structure Notes

#### Files to Create/Modify

```
scripts/
  generate-thumbnails.ts    ← CREATE: the thumbnail generation script
static/
  images/
    cards/
      *.jpg                 ← COPY from legacy project (424 files)
      .gitkeep              ← REMOVE after copying
    thumbs/
      *.webp                ← CREATE: generated thumbnails (committed artifact)
      .gitkeep              ← REMOVE after generating
package.json               ← ADD sharp to devDependencies
```

#### Alignment with Architecture

[Source: architecture.md#Image Optimization — Pre-generated WebP Thumbnails]

- Script lives at `scripts/generate-thumbnails.ts` — matches architecture "scripts/" convention
- Output at `static/images/thumbs/` — canonical location per AR5
- Script is run once, output committed — **do NOT add a `generate-thumbnails` npm script**
  (run manually with `npx tsx scripts/generate-thumbnails.ts`)
- `static/images/thumbs/*.webp` must NOT be gitignored (committed artifact)
- `static/images/cards/` — the source JPGs directory (gitkeep existed from Story 1.1)

### Previous Story Intelligence (Story 1.2)

**From Story 1.2 Dev Agent Record:**
[Source: _bmad-output/implementation-artifacts/1-2-xml-to-json-card-data-conversion-script.md]

- `package.json` has `"type": "module"` — confirmed ES module imports required throughout
- TypeScript strict mode — no implicit `any`, explicit types required
- `@types/node` v24 is installed — Node.js built-ins (`fs`, `path`) are typed
- `tsx` v4.21.0 is installed — script is run with `npx tsx`
- `fast-xml-parser` v5 was used in Story 1.2 (backward-compatible API for `XMLParser`)
- All output paths should use `resolve()` for absolute paths (learned from Story 1.2 code review)
- Avoid `eslint-disable` comments and `any` annotations — use specific types throughout
- `scripts/.gitkeep` was removed in Story 1.2 — scripts/ directory already clean

**Key architecture discrepancy documented in Story 1.2:**
- Ship `crewSlots` appears in architecture.md but is absent from the source XML — Story 1.3 is unaffected (no card data processing in this story)
- Fort `goldCost` is correctly in the JSON data — Story 1.3 is unaffected

### Git Intelligence Summary

**Recent commits (last 5):**
- `8a7e507` — Mark stories done (sprint-status.yaml updated)
- `36ba090` — Story 1-2: XML-to-JSON card data conversion script (#2)
- `f7589af` — Story 1-2: Create story file for XML-to-JSON card data conversion script
- `da58153` — Story 1-1: Initialize SvelteKit project with full toolchain (#1)
- `292f81e` — Add SVG icon spec for StatBar and CannonDisplay components

**Current state of `static/images/`:**
- `static/images/cards/` — exists, contains only `.gitkeep` (JPGs NOT yet copied)
- `static/images/thumbs/` — exists, contains only `.gitkeep` (no WebPs yet)
- `static/images/backgrounds/` — exists, contains `.gitkeep`
- `static/images/flags/` — exists, contains `.gitkeep`

**Current state of `scripts/`:**
- `scripts/convert.ts` — exists (Story 1.2)
- `scripts/.gitkeep` was deleted in Story 1.2

### Testing Requirements for This Story

No Vitest unit tests required. Verification is inspection of the output:

1. `npx tsx scripts/generate-thumbnails.ts` → exits 0, prints count (should be 424)
2. Verify 424 `.webp` files in `static/images/thumbs/`
3. Spot-check filenames: `PPSM_EC-001.webp`, `PPCC_011.webp`, `PPRV_016.webp`
4. Verify no source `.jpg` extension remains in `static/images/thumbs/`
5. Confirm dimensions with a quick check:
   ```bash
   # Using sharp in a one-liner to check one thumbnail:
   node --input-type=module <<'EOF'
   import sharp from 'sharp';
   const meta = await sharp('static/images/thumbs/PPCC_011.webp').metadata();
   console.log(meta.width, meta.height, meta.format);
   EOF
   # Expected: 200 <some_height> webp
   ```
6. Confirm `npm run build` succeeds and `/build/images/thumbs/` contains the WebPs

### What This Story Explicitly Does NOT Do

- Does NOT create TypeScript card type definitions — that is Story 1.4
- Does NOT create any SvelteKit components or routes — that is Epic 2
- Does NOT add any npm scripts to `package.json` (no `"generate-thumbnails"` key) — script is run manually
- Does NOT create `cardUtils.ts` with `thumbUrl()` helper — that is Story 1.4
- Does NOT process nationality flags or background images — only card image JPGs

### References

- [Source: epics.md#Story 1.3] — User story + acceptance criteria
- [Source: architecture.md#Image Optimization — Pre-generated WebP Thumbnails] — Decision rationale + sharp
- [Source: architecture.md#Naming Patterns] — Thumbnail filename convention (`PPSM_EC-001.webp`)
- [Source: architecture.md#Development Workflow] — `npm install -D daisyui@latest sharp`
- [Source: architecture.md#Requirements to Structure Mapping (FR22-24)] — Data pipeline context
- [Source: 1-2-xml-to-json-card-data-conversion-script.md#Dev Notes] — ES module + path patterns
- [Source: Legacy: /Users/jearl/Projects/Legacy/Pirates!/Pirates!/Images/] — 424 source JPG files

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

None — implementation proceeded cleanly with no blockers.

### Completion Notes List

- Copied 423 source JPGs from legacy project to `static/images/cards/` (story expected 424; actual source directory contains 423 files — one-off discrepancy in story estimate).
- Source JPGs stored as a committed zip archive (`static/images/cards/source-cards.zip`, ~15MB) per project-owner decision; individual `.jpg` files are gitignored to avoid 423 binary blobs in history.
- `sharp@0.34.5` installed as devDependency; ships its own TypeScript types.
- `scripts/generate-thumbnails.ts` created with ES module syntax (`import`, not `require`) per `"type": "module"` in `package.json`.
- Script: reads all `.jpg` files from `static/images/cards/`, resizes to 200px wide (aspect ratio preserved), converts to WebP at quality 80, writes to `static/images/thumbs/`.
- Generated 423 WebP thumbnails; script exits 0.
- Spot-checked: `PPSM_EC-001.webp`, `PPCC_011.webp`, `PPRV_016.webp` — all present.
- Dimension verified via sharp metadata: 200×179px (aspect ratio preserved, not square-cropped).
- `static/images/thumbs/.gitkeep` removed; `static/images/cards/.gitkeep` removed.
- `npm run build` succeeds; thumbnails present under `/build/images/thumbs/`.
- ESLint passes on `scripts/generate-thumbnails.ts` (pre-existing prettier/tailwind issues in repo are unrelated to this story).
- `.gitignore` updated: `static/images/cards/*.jpg` excluded.

### File List

- `scripts/generate-thumbnails.ts` — CREATED
- `static/images/cards/source-cards.zip` — CREATED (423 source JPGs as zip archive)
- `static/images/cards/*.jpg` — COPIED (423 files, gitignored)
- `static/images/cards/.gitkeep` — DELETED
- `static/images/thumbs/*.webp` — CREATED (423 WebP thumbnails)
- `static/images/thumbs/.gitkeep` — DELETED
- `package.json` — MODIFIED (added `sharp@^0.34.5` to devDependencies)
- `package-lock.json` — MODIFIED (updated by npm)
- `.gitignore` — MODIFIED (added `static/images/cards/*.jpg` exclusion)

## Change Log

- 2026-02-27: Story 1.3 implemented — WebP thumbnail generation script created, 423 thumbnails generated and committed to `static/images/thumbs/`, source JPGs archived as zip.
