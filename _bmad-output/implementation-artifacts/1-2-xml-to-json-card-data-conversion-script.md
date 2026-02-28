# Story 1.2: XML-to-JSON Card Data Conversion Script

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **developer**,
I want a `scripts/convert.ts` script that reads `reference/PiratesCards.xml` and produces a typed `static/data/cards.json` with camelCase field names,
So that all 5000+ card records are available as a committed, version-controlled static asset with zero runtime conversion and no data loss.

## Acceptance Criteria

1. **Given** `reference/PiratesCards.xml` exists
   **When** I run `npx tsx scripts/convert.ts`
   **Then** `static/data/cards.json` is generated with every card as an object in a JSON array
   **And** all field names are camelCase (e.g., `cardId`, `cardSet`, `pointValue`) — not PascalCase from the source XML

2. **Given** the generated `cards.json`
   **When** I inspect a Ship card entry
   **Then** it has a `details` object with `masts`, `cargo`, `baseMove`, and `cannons` (array)
   **And** when I inspect a Crew card, it has `details` with `buildBonus`, `costReduction`, `cargoBonus`, `limitCards`
   **And** when I inspect a Treasure or Event card, it has no `details` key at all

3. **Given** the generated `cards.json`
   **When** I count the total card entries
   **Then** the count matches the total record count in the source XML (zero data loss)

4. **Given** the generated `cards.json`
   **When** I inspect any card entry
   **Then** `imageFilename` correctly reflects the naming convention (e.g., `PPSM_EC-001.jpg`) matching the source image files

## Tasks / Subtasks

- [x] Install `tsx` and `fast-xml-parser` dev dependencies (AC: all)
  - [x] Run `npm install -D tsx fast-xml-parser`
  - [x] Verify `tsx` and `fast-xml-parser` appear in `package.json` devDependencies
- [x] Create `static/data/` directory (AC: 1)
  - [x] `mkdir -p static/data` (or let the script create it)
- [x] Create `scripts/convert.ts` (AC: 1, 2, 3, 4)
  - [x] Import and configure `fast-xml-parser` to parse `reference/PiratesCards.xml`
  - [x] Map `CardSet` full names → short codes (`PPSM`, `PPCC`, `PPRV`)
  - [x] For each `<Card>` element, build the base card JSON object with all camelCase fields
  - [x] For Ship cards: build `details` with `masts`, `cargo`, `baseMove`, and `cannons` array
  - [x] For Crew cards: build `details` with `buildBonus`, `costReduction`, `cargoBonus`, `limitCards`
  - [x] For Fort cards: build `details` with `cannons` array and `goldCost`
  - [x] For Treasure/Event cards: omit `details` entirely
  - [x] Build `modifiers` object from `<Modifiers>` attributes (omit empty)
  - [x] Format cannon entries from `<Cannon Range="S" Accuracy="3" />` → `"3S"` strings
  - [x] Write output JSON array to `static/data/cards.json`
  - [x] Print summary line: total cards written
- [x] Run script and verify output (AC: 1, 2, 3, 4)
  - [x] `npx tsx scripts/convert.ts` exits 0 and prints count
  - [x] Open `static/data/cards.json` and spot-check: one Ship, one Crew, one Treasure, one Fort, one Event
  - [x] Verify total count matches 550 (count of `<Card` elements in source XML)
  - [x] Verify all field names are camelCase (no `CardID`, `PointValue`, etc.)
  - [x] Verify Ship `details` has `masts`, `cargo`, `baseMove`, and `cannons` array
  - [x] Verify Crew `details` has `buildBonus`, `costReduction`, `cargoBonus`, `limitCards`
  - [x] Verify a Treasure card has no `details` key
  - [x] Verify `imageFilename` matches source convention (e.g., `PPSM_EC-001.jpg`)
- [x] Commit `static/data/cards.json` to the repository (AC: 1)
  - [x] This is a committed artifact, not gitignored — verify it's tracked

### Review Follow-ups (AI)

- [x] [AI-Review][HIGH] Add `'Pirates of the Spanish Main (Unlimited)': 'PPSMU'` to `CARD_SET_MAP` — 119 cards (21.6%) currently get the full name string instead of a short code. Decision: use `PPSMU` as distinct code. [scripts/convert.ts:5-9]
- [x] [AI-Review][MEDIUM] Make output paths absolute using `resolve()` — `mkdirSync` and `writeFileSync` use relative paths while `xmlPath` uses `resolve()`. All paths should be consistent. [scripts/convert.ts:104-105]
- [x] [AI-Review][MEDIUM] Reduce `eslint-disable` / `any` usage — 5 eslint-disable comments and 4 `: any` annotations in 107 lines. Use `Record<string, unknown>` or more specific types where possible. [scripts/convert.ts:22,25,27,37,51]
- [x] [AI-Review][MEDIUM] Remove `scripts/.gitkeep` — placeholder is unnecessary now that `convert.ts` exists. Dev Notes said to remove it. [scripts/.gitkeep]
- [x] [AI-Review][MEDIUM] Document architecture spec discrepancies in Dev Agent Record — Ship `crewSlots` in arch but not in XML/implementation; Fort `goldCost` in implementation but not in arch. Note for downstream story authors.
- [x] [AI-Review][LOW] Remove redundant `Array.isArray` guard in `parseCannons` — the `isArray` parser config already forces `Cannon` to be an array, making the fallback dead code. [scripts/convert.ts:28-29]
- [x] [AI-Review][LOW] Note: XML Rarity has 8 values (not 3 as documented in CLAUDE.md) — Common, Uncommon, Rare, Limited Edition, Super Rare, Common Treasure, Treasure, Super Rare Treasure. Affects Story 1.4 type definitions.

## Dev Notes

### Critical Context: Source XML Structure

**File:** `reference/PiratesCards.xml`
**Encoding:** UTF-8 with BOM (handle BOM when reading — `fast-xml-parser` handles this automatically)
**Total records:** 550 `<Card>` elements

#### XML Structure

```xml
<Cards>
  <Card CardID="5758" CardSet="Pirates of the Spanish Main" Type="Crew"
        Rarity="Rare" Nationality="English" TournamentStatus="Active">
    <Identification CardNumber="EC-001" Name="Admiral Morgan" />
    <!-- Crew with link: -->
    <!-- <Identification CardNumber="016" Name="Don Pedro" Link="Panda" LinkCardIDs="7909" /> -->
    <Stats PointValue="5" />
    <!-- Ship Stats: <Stats PointValue="9" Masts="3" Cargo="5" Movement="L" /> -->
    <!-- Fort Stats: <Stats PointValue="0" NumCannons="4" GoldCost="3" /> -->
    <Image URL="/images/..." Filename="PPSM_EC-001.jpg" />
    <Ability>Once per turn, roll a d6...</Ability>
    <Description>Henry Morgan was once...</Description>
    <Modifiers />
    <!-- Modifiers with values: <Modifiers Limit="True" BuildBonus="5" /> -->
    <!-- Ship/Fort cannons: -->
    <!-- <Cannons>
           <Cannon Number="1" Range="S" Accuracy="3" />
           <Cannon Number="2" Range="L" Accuracy="2" />
         </Cannons> -->
  </Card>
</Cards>
```

### XML Field → JSON Field Mapping

#### Base Card Fields (all card types)

| XML Source                         | JSON Field         | Notes                                                         |
| ---------------------------------- | ------------------ | ------------------------------------------------------------- |
| `Card.CardID` (attr)               | `cardId`           | String — keep as string, not number                           |
| `Card.CardSet` (attr)              | `cardSet`          | Map full name → code (see below)                              |
| `Identification.CardNumber` (attr) | `cardNumber`       | e.g. `"EC-001"`, `"094"`                                      |
| `Identification.Name` (attr)       | `name`             | Card display name                                             |
| `Card.Type` (attr)                 | `type`             | `"Ship"` \| `"Crew"` \| `"Treasure"` \| `"Fort"` \| `"Event"` |
| `Card.Rarity` (attr)               | `rarity`           | `"Common"` \| `"Uncommon"` \| `"Rare"`                        |
| `Card.Nationality` (attr)          | `nationality`      | `"English"`, `"Spanish"`, `"Pirates"`, etc.                   |
| `Card.TournamentStatus` (attr)     | `tournamentStatus` | `"Active"` (primary value in data)                            |
| `Stats.PointValue` (attr)          | `pointValue`       | Integer                                                       |
| `Image.Filename` (attr)            | `imageFilename`    | e.g. `"PPSM_EC-001.jpg"` — use directly                       |
| `Ability` (text content)           | `ability`          | May be empty string — include as `""`                         |
| `Description` (text content)       | `description`      | May be empty string — include as `""`                         |

#### CardSet Name → Code Mapping (CRITICAL)

```typescript
const CARD_SET_MAP: Record<string, string> = {
	'Pirates of the Spanish Main': 'PPSM',
	'Pirates of the Crimson Coast': 'PPCC',
	'Pirates of the Revolution': 'PPRV'
};
```

#### Ship `details` (type === 'Ship')

| XML Source              | JSON Field         | Notes                                 |
| ----------------------- | ------------------ | ------------------------------------- |
| `Stats.Masts` (attr)    | `details.masts`    | Integer                               |
| `Stats.Cargo` (attr)    | `details.cargo`    | Integer                               |
| `Stats.Movement` (attr) | `details.baseMove` | String e.g. `"S+L"`, `"L"`, `"S+S+S"` |
| `Cannons` children      | `details.cannons`  | Array — see cannon format below       |

#### Crew `details` (type === 'Crew')

| XML Source                           | JSON Field              | Notes                                                                                |
| ------------------------------------ | ----------------------- | ------------------------------------------------------------------------------------ |
| `Modifiers.BuildBonus` (attr)        | `details.buildBonus`    | Integer, default `0` if absent                                                       |
| `Modifiers.CrewCostReduction` (attr) | `details.costReduction` | Integer, default `0` if absent                                                       |
| `Modifiers.CargoBonus` (attr)        | `details.cargoBonus`    | Integer, default `0` if absent                                                       |
| `Identification.LinkCardIDs` (attr)  | `details.limitCards`    | String `"7909"` or `"5802,7848"` → split on `,` → string array. Empty `[]` if absent |

**Note:** `limitCards` captures the "Link" crew mechanic — crew assigned to their linked ship
cost fewer points. The card IDs are strings to match `cardId` type.

#### Fort `details` (type === 'Fort')

| XML Source              | JSON Field         | Notes                           |
| ----------------------- | ------------------ | ------------------------------- |
| `Cannons` children      | `details.cannons`  | Array — see cannon format below |
| `Stats.GoldCost` (attr) | `details.goldCost` | Integer — fort purchase cost    |

#### Treasure / Event

**No `details` key.** Omit entirely. Do NOT set `details: null` or `details: {}`.

#### `modifiers` field (all card types — always present)

Include a `modifiers` object at the top level. If `<Modifiers />` is empty, output `"modifiers": {}`.
If attributes are present, include only those that are set:

```json
// Empty modifiers:
"modifiers": {}

// Limit card (rules engine uses this):
"modifiers": { "limit": true, "buildBonus": 5 }
```

| XML Source                                | JSON Field                    |
| ----------------------------------------- | ----------------------------- |
| `Modifiers.Limit` (attr, boolean)         | `modifiers.limit`             |
| `Modifiers.BuildBonus` (attr, int)        | `modifiers.buildBonus`        |
| `Modifiers.CrewCostReduction` (attr, int) | `modifiers.crewCostReduction` |
| `Modifiers.CargoBonus` (attr, int)        | `modifiers.cargoBonus`        |

**Why `modifiers` duplicates some Crew `details` fields:** `details` gives the dev agent
type-narrowed access for display. `modifiers` (top-level) is for the rules engine — it can
check `card.modifiers.limit` without narrowing to Crew type. Both serve different consumers.

#### Cannon Format

```
XML: <Cannon Number="1" Range="S" Accuracy="3" />
JSON: "3S"   ← "{Accuracy}{Range}"

XML: <Cannon Number="2" Range="L" Accuracy="2" />
JSON: "2L"
```

Sort cannons by `Number` attribute to preserve physical card order.

**Example output:**

```json
"cannons": ["3S", "3L", "3L", "2L"]
```

### Complete Example JSON Records

#### Ship Card

```json
{
	"cardId": "6931",
	"cardSet": "PPCC",
	"cardNumber": "011",
	"name": "Adventure",
	"type": "Ship",
	"rarity": "Common",
	"nationality": "Pirates",
	"tournamentStatus": "Active",
	"pointValue": 9,
	"imageFilename": "PPCC_011.jpg",
	"ability": "Schooner. This ship gets +1 to her boarding rolls.",
	"description": "Captain Devereaux is so obsessed with finding an artifact...",
	"modifiers": {},
	"details": {
		"masts": 3,
		"cargo": 5,
		"baseMove": "L",
		"cannons": ["3S", "3L", "3S"]
	}
}
```

#### Crew Card (with link)

```json
{
	"cardId": "7791",
	"cardSet": "PPRV",
	"cardNumber": "016",
	"name": "'Don' Pedro Gilbert",
	"type": "Crew",
	"rarity": "Rare",
	"nationality": "Pirates",
	"tournamentStatus": "Active",
	"pointValue": 5,
	"imageFilename": "PPRV_016.jpg",
	"ability": "Once per turn, you may eliminate...",
	"description": "Woodes Rogers openly scoffs...",
	"modifiers": {},
	"details": {
		"buildBonus": 0,
		"costReduction": 0,
		"cargoBonus": 0,
		"limitCards": ["7909"]
	}
}
```

#### Crew Card (with modifiers)

```json
{
	"cardId": "6930",
	"cardSet": "PPCC",
	"cardNumber": "046_2",
	"name": "Administrator Scott Bratley",
	"type": "Crew",
	"rarity": "Common",
	"nationality": "English",
	"tournamentStatus": "Active",
	"pointValue": 0,
	"imageFilename": "PPCC_046_2.jpg",
	"ability": "Limit. Ransom. Place this crew face up during setup...",
	"description": "Scott Bratley is Governor Lynch's secret...",
	"modifiers": { "limit": true, "buildBonus": 5 },
	"details": {
		"buildBonus": 5,
		"costReduction": 0,
		"cargoBonus": 0,
		"limitCards": []
	}
}
```

#### Fort Card

```json
{
	"cardId": "6965",
	"cardSet": "PPCC",
	"cardNumber": "031",
	"name": "Dead Man's Point",
	"type": "Fort",
	"rarity": "Common",
	"nationality": "Pirates",
	"tournamentStatus": "Active",
	"pointValue": 0,
	"imageFilename": "PPCC_031.jpg",
	"ability": "When this fort hits a ship, you may also eliminate one cargo from that ship.",
	"description": "The fort at Dead Man's Point...",
	"modifiers": {},
	"details": {
		"cannons": ["3L", "3L", "3L", "3L"],
		"goldCost": 3
	}
}
```

#### Treasure Card (no details)

```json
{
	"cardId": "6929",
	"cardSet": "PPCC",
	"cardNumber": "098",
	"name": "Abandoned Crew",
	"type": "Treasure",
	"rarity": "Rare",
	"nationality": "Pirates",
	"tournamentStatus": "Active",
	"pointValue": 0,
	"imageFilename": "PPCC_098.jpg",
	"ability": "When placing treasure, you may place one or more of these crew...",
	"description": "",
	"modifiers": {}
}
```

### Implementation Approach: fast-xml-parser

**Install:**

```bash
npm install -D tsx fast-xml-parser
```

**Why `fast-xml-parser` v4:**

- Actively maintained, TypeScript-first
- Handles attribute parsing cleanly with `ignoreAttributes: false`
- Well-documented, ~3M weekly downloads

**CRITICAL: ES Module Syntax Required**

`package.json` has `"type": "module"` — use `import`, NOT `require`:

```typescript
// ✅ Correct
import { XMLParser } from 'fast-xml-parser';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

// ❌ Wrong — CommonJS, will fail with "type": "module"
const { XMLParser } = require('fast-xml-parser');
```

**Key parser configuration:**

```typescript
import { XMLParser } from 'fast-xml-parser';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const parser = new XMLParser({
	ignoreAttributes: false,
	attributeNamePrefix: '', // No prefix on attribute names
	textNodeName: '_text', // Name for text content nodes
	isArray: (name) => name === 'Card' || name === 'Cannon' // Force always-array
});

const xml = readFileSync('reference/PiratesCards.xml', 'utf-8');
const parsed = parser.parse(xml);
const cards = parsed.Cards.Card; // Always an array due to isArray config
```

**Text content extraction:**
`<Ability>` and `<Description>` have NO attributes, so fast-xml-parser returns them as
simple strings (not nested under `_text`). Guard for undefined (empty elements):

```typescript
const ability = typeof card.Ability === 'string' ? card.Ability : '';
const description = typeof card.Description === 'string' ? card.Description : '';
```

**CRITICAL: XML Attribute Type Coercion**

All XML attributes are strings. Must convert to correct types:

```typescript
// Boolean: "True" → true
const limit = card.Modifiers?.Limit === 'True';

// Integer: "5" → 5
const buildBonus = parseInt(card.Modifiers?.BuildBonus ?? '0', 10);
const masts = parseInt(card.Stats?.Masts ?? '0', 10);
const pointValue = parseInt(card.Stats?.PointValue ?? '0', 10);

// Cannon accuracy: "3" → 3 (then combined with range)
const cannon = `${accuracy}${range}`; // e.g. "3S", "2L"
```

**JSON Output Format:**
Write minified JSON (no indentation) for production file size. Use 2-space indent
during development/debugging if desired, but final committed file should be compact:

```typescript
writeFileSync('static/data/cards.json', JSON.stringify(cards));
// NOT: JSON.stringify(cards, null, 2)  ← pretty-print only for dev debugging
```

### Handling XML Edge Cases

1. **BOM (Byte Order Mark):** The XML file starts with a UTF-8 BOM (`\uFEFF`). `readFileSync`
   with `'utf-8'` encoding preserves it. Either strip it or use `fast-xml-parser` directly
   on the buffer. The parser handles BOM-prefixed XML gracefully.

2. **Empty text nodes:** Some cards have `<Ability></Ability>` or `<Description></Description>`.
   fast-xml-parser may return `undefined` for empty tags. Default to `''`.

3. **Empty `<Modifiers />`:** Self-closing with no attributes. fast-xml-parser returns `{}` or
   the element may be missing. Always default to `{}`.

4. **Missing `<Cannons>` on Crew/Treasure/Event:** Only Ship and Fort cards have `<Cannons>`.
   Guard with `if (card.Cannons)`.

5. **CardNumber with underscores:** `"046_2"` is valid. Do not sanitize card numbers.

6. **Multiple `LinkCardIDs`:** Some crew link to multiple ships: `LinkCardIDs="5802,7848"`.
   Always split on comma and trim: `linkCardIds.split(',').map(s => s.trim())`.

7. **`Stats.TreasureValues` on Treasure cards:** Some Treasure cards have an extra
   `TreasureValues` attribute on `<Stats>`. This is not in the target JSON schema — skip it.

### Project Structure Notes

#### Files to Create/Modify

```
scripts/
  convert.ts          ← CREATE: the XML-to-JSON conversion script
static/
  data/
    cards.json        ← CREATE: output of the script (committed to git)
```

#### Alignment with Architecture

[Source: _bmad-output/planning-artifacts/architecture.md#Data Architecture]

- Script lives at `scripts/convert.ts` — matches architecture "scripts/" convention
- Output at `static/data/cards.json` — canonical location per AR3, AR4
- `static/data/` directory does NOT exist from Story 1.1 — must be created
- Script is run once and output committed — **do not add a `convert` npm script**
  (run manually with `npx tsx scripts/convert.ts`)
- `static/data/cards.json` must NOT be gitignored (it is a committed artifact)

#### scripts/ Directory

Story 1.1 created `scripts/.gitkeep` as a placeholder. Remove or ignore it when creating
`scripts/convert.ts`.

### Previous Story Intelligence (Story 1.1)

**From Story 1.1 Dev Agent Record:** [Source: _bmad-output/implementation-artifacts/1-1-initialize-sveltekit-project-with-full-toolchain.md]

- Project uses `"type": "module"` in `package.json` — ES module syntax required in scripts
- TypeScript is strict mode — no implicit `any`, explicit types required
- `@types/node` v24 is already installed — Node.js built-ins (`fs`, `path`) are typed
- `tsx` is NOT currently installed (not in devDependencies) — must be added
- `npm run build` output goes to `/build`, not `/dist`
- Script runs at dev time only — not part of the build pipeline
- Dev server runs fine — all Story 1.1 checks pass

**Git context from last commit (da58153):**

- `scripts/.gitkeep` exists — placeholder from Story 1.1
- `static/images/cards/`, `thumbs/`, `flags/`, `backgrounds/` exist with `.gitkeep` files
- `static/data/` does NOT exist yet

### Testing Requirements for This Story

No Vitest unit tests required. Verification is manual inspection of the output file:

1. `npx tsx scripts/convert.ts` → exits 0, prints total card count
2. Check total count = 550
3. Spot-check one of each type (Ship, Crew, Treasure, Fort, Event)
4. Verify camelCase field names throughout
5. Verify `imageFilename` matches expected convention
6. Verify Ship has `details.cannons` array, Crew has `details.limitCards`, Treasure has no `details`

**Count verification:**

```bash
# Count Card elements in source:
grep -c "<Card " reference/PiratesCards.xml
# Expected: 550

# Count entries in generated JSON (after running convert.ts):
node -e "const d = JSON.parse(require('fs').readFileSync('static/data/cards.json', 'utf8')); console.log(d.length)"
```

### What This Story Explicitly Does NOT Do

- Does NOT create TypeScript card type definitions (`src/lib/types/cardTypes.ts`) — that is Story 1.4
- Does NOT generate thumbnail images — that is Story 1.3
- Does NOT create any SvelteKit data loading infrastructure — that is Story 1.4
- Does NOT add any npm scripts (no `"convert"` in package.json) — script is run manually
- Does NOT modify any existing files except `package.json` (adding tsx + fast-xml-parser)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2] — User story + acceptance criteria
- [Source: _bmad-output/planning-artifacts/architecture.md#JSON Card Schema] — Canonical schema definition
- [Source: _bmad-output/planning-artifacts/architecture.md#Data Architecture] — Decision rationale
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns] — camelCase field names
- [Source: _bmad-output/planning-artifacts/epics.md#FR22, FR23] — Data pipeline requirements
- [Source: reference/CardData.xsd] — XML schema definition
- [Source: reference/PiratesCards.xml] — Source data (550 card records)

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

No issues encountered. Implementation was straightforward following the detailed Dev Notes.

### Completion Notes List

- Installed `tsx` v4.21.0 and `fast-xml-parser` v5.4.1 as devDependencies (v5 confirmed backward-compatible API for `XMLParser` and `isArray` option)
- Created `scripts/convert.ts` using ES module imports (`import`, not `require`) as required by `"type": "module"` in package.json
- Parser configured with `ignoreAttributes: false`, `attributeNamePrefix: ''`, `textNodeName: '_text'`, `isArray` forced for `Card` and `Cannon` elements
- All 550 cards converted successfully with zero data loss
- All field names verified camelCase (0 PascalCase keys)
- All 5 card types spot-checked and match story example JSON exactly (including `Adventure` Ship and `Administrator Scott Bratley` Crew with modifiers)
- `imageFilename` uses existing `Filename` attribute from `<Image>` tag directly — no transformation needed
- Treasure and Event cards correctly have no `details` key
- Crew `limitCards` correctly parses comma-separated `LinkCardIDs` into string arrays
- `modifiers` top-level object includes only present attributes (empty `{}` for cards with no modifier attributes)
- Output written as minified JSON (no indentation) per story spec
- `static/data/cards.json` is tracked by git (not gitignored)
- ✅ Resolved review finding [HIGH]: Added `'Pirates of the Spanish Main (Unlimited)': 'PPSMU'` to CARD_SET_MAP — all 119 PPSMU cards now map to short code, verified in output
- ✅ Resolved review finding [MEDIUM]: Output paths made absolute via `resolve()` — `outputDir` and `outputPath` both now use `resolve()` consistent with `xmlPath`
- ✅ Resolved review finding [MEDIUM]: Eliminated all 5 `eslint-disable` comments and all `any` annotations — introduced `type RawNode = Record<string, unknown>` alias used throughout; ESLint and `svelte-check` both pass clean
- ✅ Resolved review finding [MEDIUM]: Deleted `scripts/.gitkeep` from disk and git index (`git rm`)
- ✅ Resolved review finding [MEDIUM]: Architecture discrepancies documented — (1) Ship `crewSlots` appears in architecture.md but is absent from XML and was not implemented; Story 1.4 type author should note this field may need future consideration or removal from arch spec. (2) Fort `goldCost` is present in XML (`Stats.GoldCost`) and correctly implemented in `details.goldCost`, but was missing from the architecture.md schema — implementation is correct, arch doc lags behind XML reality.
- ✅ Resolved review finding [LOW]: Removed redundant `Array.isArray` guard in `parseCannons` — `isArray` config guarantees `Cannon` is always an array; direct cast used instead
- ✅ Resolved review finding [LOW]: Rarity values documented — XML contains 8 distinct rarity values: Common (239), Uncommon (108), Rare (121), Limited Edition (11), Super Rare (4), Common Treasure (59), Treasure (7), Super Rare Treasure (1). CLAUDE.md only documents 3; Story 1.4 TypeScript types must use the full 8-value union.

### File List

- `package.json` — added `tsx` and `fast-xml-parser` to devDependencies
- `package-lock.json` — updated by npm install
- `scripts/convert.ts` — XML-to-JSON conversion script (updated: PPSMU mapping, absolute paths, RawNode type, removed eslint-disable/any)
- `scripts/.gitkeep` — deleted (placeholder removed)
- `static/data/cards.json` — generated card data (550 cards, committed artifact; regenerated with PPSMU fix)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — status updated
- `_bmad-output/implementation-artifacts/1-2-xml-to-json-card-data-conversion-script.md` — story updated

## Change Log

- 2026-02-27: Story 1.2 implemented — created `scripts/convert.ts` that converts 550 cards from `reference/PiratesCards.xml` to `static/data/cards.json` with full camelCase field mapping, type-specific `details` objects, and correct `modifiers` structure
- 2026-02-27: Code review (claude-opus-4-6) — 1 HIGH, 4 MEDIUM, 2 LOW issues found. All ACs verified as implemented. Critical finding: 119 cards with unmapped CardSet "Pirates of the Spanish Main (Unlimited)". 7 action items created. Status set to in-progress pending fixes.
- 2026-02-27: Addressed code review findings — 7 items resolved (claude-sonnet-4-6). PPSMU mapping added (119 cards fixed), absolute output paths, zero any/eslint-disable, .gitkeep removed, arch discrepancies documented, redundant Array.isArray guard removed, 8 rarity values noted for Story 1.4.
