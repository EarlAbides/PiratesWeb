# SVG Icon Set Specification — PiratesWeb StatBar

**Author:** Sally (UX Designer, Party Mode)
**Date:** 2026-02-27
**Source Reference:** `reference/deck-card.jpeg` (La Repulsa, PPSM 072)
**Status:** Ready for Implementation

---

## Overview

This document specifies all SVG icons required for the `StatBar` and `CannonDisplay` components. Every icon is derived directly from the reference photograph of the physical Pirates CSG card — confirmed to be high enough fidelity for faithful SVG recreation.

Icons are organized into two families:
- **Stat Icons** (4): Mast, Cargo, Move, Cannon — used as stat category labels in the StatBar
- **Cannon Pip Icons** (12): S1–S6, L1–L6 — used in CannonDisplay for individual cannon rendering

---

## Source Reference Analysis

The `reference/deck-card.jpeg` (La Repulsa) shows the complete stats bar at sufficient resolution. Each icon is clearly legible:

```
[14 POINTS]  [ship-masts icon] 1  [ship-cargo icon] 2  [ship-arrow icon] S+L  [cannon icon] [die pip]
```

Color palette observed from source:
- Stats bar background: **black** (`#000000`)
- Ship silhouette base: **white** (`#FFFFFF`)
- Stat highlight element: **warm gold/amber** (`~#C8960C`)
- Cannon icon fill: **warm gold/amber** (`~#C8960C`) — entirely gold, no white ship form
- Short cannon pip background: **white/cream** (`#FFFFFF` or `#F5F0E8`)
- Long cannon pip background: **deep red** (`~#C0272D`)
- Cannon pip dots: **black** (`#000000`) on short, **white** (`#FFFFFF`) on long

---

## Stat Icons (4 icons)

These are the category-label icons that precede each numeric stat value in the StatBar.

### Coordinate System

All stat icons share a common coordinate system:
- **ViewBox:** `0 0 24 24`
- **Canonical export size:** 24×24px (scales to 16–18px in row, 24px in detail view)
- **Background:** Black (`#000000`) — included in the SVG so icons are self-contained and render correctly in any context

### Three-Layer Design (Icons 1–3)

**Icons 1–3 (Mast, Cargo, Move) all use the exact same base ship silhouette.** Each icon is a three-layer composition:

1. **Background layer:** Black filled rectangle covering the full viewBox (`#000000`)
2. **White silhouette layer:** The complete ship form rendered in white (`#FFFFFF`) — hull, masts, and sails all white
3. **Gold highlight layer:** Only the stat-relevant element re-drawn in warm gold (`#C8960C`) on top of the white silhouette

The gold highlight sits over the white ship, creating a clear focal point — the white base provides contrast against the black background, while the gold element draws the eye to exactly what the stat measures.

**Color tokens for three-layer icons:**
- Background: `#000000` (black)
- Base ship silhouette: `#FFFFFF` (white)
- Highlight element: `#C8960C` (warm gold — the stat being measured)

The CannonIcon (icon 4) does **not** follow this pattern — it has a black background with the cannon rendered entirely in warm gold, no white ship form.

---

### Shared Base Ship Silhouette

All three ship icons are built from this common ship form (described in the 24×24 viewBox). This path is defined once and reused across all three icons:

- **Hull:** A shallow, wide-bottomed boat shape. Curves upward at bow (right) and stern (left). Occupies approximately y:14–22, x:2–22. The keel is the lowest point; the deck rail is a roughly flat or gently curved top edge.
- **Masts:** Two vertical elements rising from the deck — a taller main mast (~center-right, y:4–14) and a shorter foremast (~center-left, y:7–14).
- **Sails:** Triangular or trapezoidal filled areas attached to the masts.
- **Bowsprit:** Optional diagonal spar at the bow — adds visual distinction if space allows.

The entire ship (hull + masts + sails) is rendered in white (`#FFFFFF`) as the silhouette layer. The gold highlight is then drawn on top of specific elements, making them appear gold while the rest of the ship remains white against the black background.

---

### 1. MastIcon (`icon-mast.svg`)

**Represents:** Number of masts (ship's combat points)

**Two-tone composition:**
- **Dark base layer:** Full ship silhouette (hull + masts + sails) in `#3A2800`
- **Gold highlight layer:** Masts and sails only, re-drawn in `#C8960C` on top — the mast verticals and sail shapes glow gold while the hull stays dark

**Effect:** White ship on black. Masts and sails glow gold — everything else stays white. Immediately reads as "this icon is about the sails/masts."

**SVG Structure:**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <!-- Layer 1: Black background -->
  <rect width="24" height="24" fill="#000000"/>
  <!-- Layer 2: Full ship silhouette in white -->
  <g fill="#FFFFFF">
    <!-- hull path -->
    <!-- mast paths (both masts) -->
    <!-- sail paths (all sails) -->
  </g>
  <!-- Layer 3: Masts and sails re-drawn in gold on top -->
  <g fill="#C8960C">
    <!-- mast paths (same geometry as layer 2) -->
    <!-- sail paths (same geometry as layer 2) -->
  </g>
</svg>
```

**Sizing notes:**
- Hull occupies bottom ~40% of viewBox (y: 14–22)
- Masts extend from y:4 to y:14 approximately
- Leave 1px visual padding on all sides

---

### 2. CargoIcon (`icon-cargo.svg`)

**Represents:** Cargo capacity (how many crew/treasure a ship can carry)

**Two-tone composition:**
- **Dark base layer:** Full ship silhouette (hull + masts + sails) in `#3A2800` — identical geometry to MastIcon
- **Gold highlight layer:** The cargo hold area only, re-drawn in `#C8960C` — the central lower hull region, representing the hold where cargo is stored

**Hold shape:** A roughly rectangular or oval area centered in the lower hull — the widest, deepest part of the ship body. This is where physical cargo would sit below deck.

**Effect:** White ship on black. Masts and sails stay white; the hold glows gold. Immediately reads as "this icon is about the interior capacity of the hull."

**SVG Structure:**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <!-- Layer 1: Black background -->
  <rect width="24" height="24" fill="#000000"/>
  <!-- Layer 2: Full ship silhouette in white (identical path to MastIcon) -->
  <g fill="#FFFFFF">
    <!-- hull path -->
    <!-- mast paths -->
    <!-- sail paths -->
  </g>
  <!-- Layer 3: Cargo hold area highlighted in gold -->
  <g fill="#C8960C">
    <!-- hold path: oval or rect in center-lower hull region -->
    <!-- approx x:6–18, y:15–20 — the belly of the ship -->
  </g>
</svg>
```

**Key implementation note:** The shared base ship geometry between MastIcon and CargoIcon must be **pixel-identical** — these are the same path reused. Only the highlight layer differs.

---

### 3. MoveIcon (`icon-move.svg`)

**Represents:** Base move distance (expressed as S, L, S+L, etc.)

**Two-tone composition:**
- **Dark base layer:** Full ship silhouette in `#3A2800` — same geometry as MastIcon/CargoIcon, but scaled slightly smaller (~80% width) to leave room for the arrow to the right
- **Gold highlight layer:** A rightward-pointing arrow in `#C8960C` positioned to the right of/emerging from the ship's bow

**Arrow design:** A simple rightward arrow — horizontal shaft with a triangular arrowhead pointing right. The arrow is the same gold as the highlight in the other icons, making it visually consistent as "the stat being measured." The ship itself stays dark.

**Effect:** White ship on black with a gold arrow. The ship is context; the gold arrow is the stat. Reads as "this icon is about where the ship goes."

**SVG Structure:**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <!-- Layer 1: Black background -->
  <rect width="24" height="24" fill="#000000"/>
  <!-- Layer 2: Ship silhouette in white (same base path, scaled ~80% width, left-aligned) -->
  <g fill="#FFFFFF">
    <!-- hull path (compressed horizontally to leave room for arrow) -->
    <!-- mast paths -->
    <!-- sail paths -->
  </g>
  <!-- Layer 3: Rightward arrow in gold (right side of viewBox) -->
  <g fill="#C8960C">
    <!-- arrow shaft: rect ~x:14–19, y:11–13 -->
    <!-- arrowhead: triangle polygon pointing right, tip at x:22 -->
  </g>
</svg>
```

**Note on S/L value rendering:** The MoveIcon is just the category label. The actual movement value (`S+L`, `S`, `L`, `S+S`) is rendered as a text string adjacent to the icon, in the same typographic style as mast/cargo numeric values.

---

### 4. CannonIcon (`icon-cannon.svg`)

**Represents:** Cannon category label (precedes the cannon pip sequence)
**Shape description:** A side-view of a naval cannon on a wheeled carriage. This is the most detailed of the four stat icons. The reference shows:
- A cylindrical cannon barrel extending left from a boxy breach/back
- Two visible wheels (circles) below the carriage
- The barrel tapers slightly toward the muzzle
- Warm gold/amber fill with dark details

**Visual characteristics from reference:**
- Horizontal orientation (barrel points left, wheels on right)
- Cannon barrel: elongated cylinder, ~60% of total width
- Carriage: rectangular body with two circle-wheels visible below
- Clearly identifiable as a cannon even at 16px — this icon has the most distinctive shape of the four

**SVG Structure:**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <!-- Layer 1: Black background -->
  <rect width="24" height="24" fill="#000000"/>
  <!-- Layer 2: Cannon in warm gold — no white ship form, entirely gold -->
  <g fill="#C8960C">
    <!-- barrel path: tapered rect pointing left -->
    <!-- carriage rect -->
    <!-- wheel left: circle -->
    <!-- wheel right: circle -->
  </g>
</svg>
```

**Note:** No stroke needed — gold on black provides sufficient contrast. The CannonIcon is the only stat icon without a white silhouette layer; its entire form is rendered in gold.

---

## Cannon Pip Icons (12 icons)

Cannon pips are individual indicators in the `CannonDisplay` component. Each pip represents one cannon on a ship, showing its type (Short or Long range) and the roll needed to hit.

### Coordinate System

All cannon pip icons share:
- **ViewBox:** `0 0 16 16`
- **Canonical export size:** 16×16px (scales to 14–16px in row, 20–24px in detail)
- **Shape:** Rounded square (Short) or rotated square/diamond (Long)

---

### Short Range Pips (S1–S6, `icon-S1.svg` through `icon-S6.svg`)

**Shape:** Rounded square, white/cream background with black dots
**Background color:** `#FFFFFF` (or `#F5F0E8` for slight warmth)
**Dot color:** `#000000`
**Corner radius:** 2px at 16px viewBox scale

**Dot patterns** follow standard Western die-face conventions:

| Icon | Dots | Arrangement |
|------|------|-------------|
| S1 | 1 dot | Center |
| S2 | 2 dots | Top-right, bottom-left (diagonal) |
| S3 | 3 dots | Top-right, center, bottom-left |
| S4 | 4 dots | Four corners |
| S5 | 5 dots | Four corners + center |
| S6 | 6 dots | Three left, three right (2 columns) |

**Dot size:** `r="1.2"` at 16px viewBox scale (scales naturally)
**Dot margin from edge:** 3px at 16px viewBox scale

**SVG Structure (example S3):**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
  <!-- Background square -->
  <rect x="1" y="1" width="14" height="14" rx="2" ry="2" fill="#FFFFFF" stroke="#CCCCCC" stroke-width="0.5"/>
  <!-- Dots for S3 -->
  <circle cx="11" cy="4" r="1.2" fill="#000000"/>  <!-- top-right -->
  <circle cx="8"  cy="8" r="1.2" fill="#000000"/>  <!-- center -->
  <circle cx="5"  cy="12" r="1.2" fill="#000000"/> <!-- bottom-left -->
</svg>
```

---

### Long Range Pips (L1–L6, `icon-L1.svg` through `icon-L6.svg`)

**Shape:** Diamond (square rotated 45°), deep red background with white dots
**Background color:** `#C0272D` (deep red, matching reference card)
**Dot color:** `#FFFFFF`
**The diamond is inscribed within the 16×16 viewBox** — points touch the midpoints of each side

**Dot patterns:** Same die-face conventions as Short range
**Dot size:** `r="1.2"` at 16px viewBox scale
**Dot positioning:** Adjusted for diamond rotation — use the same center points as Short, the diamond shape contextualizes them

**SVG Structure (example L3):**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
  <!-- Diamond background: polygon through midpoints of sides -->
  <polygon points="8,1 15,8 8,15 1,8" fill="#C0272D"/>
  <!-- Dots for L3 (same positions as S3, white fill) -->
  <circle cx="11" cy="5.5" r="1.2" fill="#FFFFFF"/>  <!-- top-right (adjusted for diamond) -->
  <circle cx="8"  cy="8"   r="1.2" fill="#FFFFFF"/>  <!-- center -->
  <circle cx="5"  cy="10.5" r="1.2" fill="#FFFFFF"/> <!-- bottom-left (adjusted for diamond) -->
</svg>
```

**Dot positioning adjustment for diamond:** Because the diamond clips corners, dots in corner positions (S4, S5, S6) must be pulled ~2px toward center relative to their square-pip equivalents, so they remain visually within the diamond shape.

---

## File Naming & Organization

```
src/lib/assets/icons/
├── stat/
│   ├── icon-mast.svg
│   ├── icon-cargo.svg
│   ├── icon-move.svg
│   └── icon-cannon.svg
└── cannon-pips/
    ├── icon-S1.svg
    ├── icon-S2.svg
    ├── icon-S3.svg
    ├── icon-S4.svg
    ├── icon-S5.svg
    ├── icon-S6.svg
    ├── icon-L1.svg
    ├── icon-L2.svg
    ├── icon-L3.svg
    ├── icon-L4.svg
    ├── icon-L5.svg
    └── icon-L6.svg
```

**Total icons:** 16 SVG files

---

## Color Tokens (Tailwind Config)

These should be added to `tailwind.config.js` as named design tokens:

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      'icon-bg':         '#000000',  // Stat icon background (black bar)
      'icon-ship':       '#FFFFFF',  // White ship silhouette (Mast, Cargo, Move icons)
      'icon-gold':       '#C8960C',  // Warm gold highlight / Cannon icon fill
      'pip-short-bg':    '#FFFFFF',  // Short cannon pip background
      'pip-short-dot':   '#000000',  // Short cannon pip dots
      'pip-long-bg':     '#C0272D',  // Long cannon pip background
      'pip-long-dot':    '#FFFFFF',  // Long cannon pip dots
    }
  }
}
```

---

## Svelte Component Usage

### StatBar icon usage pattern:
```svelte
<!-- Inline SVG import pattern (recommended for CSS theming) -->
import MastIcon   from '$lib/assets/icons/stat/icon-mast.svg?component';
import CargoIcon  from '$lib/assets/icons/stat/icon-cargo.svg?component';
import MoveIcon   from '$lib/assets/icons/stat/icon-move.svg?component';
import CannonIcon from '$lib/assets/icons/stat/icon-cannon.svg?component';
```

### CannonDisplay pip lookup pattern:
```svelte
<!-- Dynamic pip selection based on cannon data -->
<!-- Cannon data format: "S3" = Short range, needs 3 to hit -->
<!-- Parse: type = data[0] ('S'|'L'), roll = parseInt(data[1]) -->
import { CANNON_PIPS } from '$lib/assets/icons/cannon-pips';
// CANNON_PIPS['S3'] → icon-S3.svg component
// CANNON_PIPS['L4'] → icon-L4.svg component
```

---

## Sizing Reference

| Context | Stat Icon Size | Cannon Pip Size | Pip Gap |
|---------|---------------|-----------------|---------|
| Card row (compact) | 16px | 14px | 2px |
| Card row (default) | 18px | 16px | 2px |
| Detail view (expanded) | 24px | 20px | 3px |
| Build panel (compact) | 14px | 12px | 2px |

---

## Accessibility

- All stat icons: `aria-hidden="true"` (decorative; numeric value is the accessible label)
- CannonDisplay wrapper: `aria-label="Cannons: {cannons}"` (e.g., `"Cannons: S3 L4 S2"`)
- Tooltip on hover for each stat icon segment: `"3 masts"`, `"2 cargo"`, `"Move: S+L"`, `"Cannons: ..."`
- Tooltips use DaisyUI tooltip component

---

## Implementation Notes

1. **Stat icons are best as inline SVG** in Svelte (via `?component` import with vite-plugin-svgr or similar) so they inherit CSS `color` and can be themed via `currentColor`.
2. **Cannon pip icons are referenced dynamically** — a lookup map from cannon string (e.g., `"S3"`) to the corresponding component is cleaner than 12 individual imports per usage.
3. **CannonIcon** is the stat category header before the pip sequence — do not confuse it with the pip icons themselves.
4. **Short pip border:** A `0.5px` gray stroke on the white short-range pips helps them read against the Spanish Main tan/parchment background. Omit on dark backgrounds.
5. **SVG optimization:** Run all final SVGs through SVGO before committing. Target < 1KB per icon.
