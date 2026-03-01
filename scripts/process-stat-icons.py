#!/usr/bin/env python3
"""
Clean up stat icon source images to exactly 3 design-token colors + anti-aliased edges.

Strategy:
  1. Flatten RGBA onto black background
  2. Scale UP 2× with LANCZOS (smooths compression artifacts before remapping)
  3. Hard-remap every pixel to nearest palette color (clean color regions)
  4. Scale DOWN to 2× retina output height (44px) with LANCZOS (anti-aliases boundaries)

Output: static/images/icons/{name}.png  (2× retina, black bg, proportional width)
"""

from PIL import Image
import numpy as np
from pathlib import Path

# ── Design tokens ─────────────────────────────────────────────────────────────
PALETTE = np.array([
    [  0,   0,   0],  # #000000 — background (black)
    [255, 255, 255],  # #ffffff — hull / highlighted region (white)
    [200, 150,  12],  # #c8960c — sails / accents (gold)
], dtype=np.float32)

# ── Paths ──────────────────────────────────────────────────────────────────────
SRC_DIR = Path("reference")
OUT_DIR = Path("static/images/icons")
OUT_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_HEIGHT = 44  # 2× of the ~22px display target

# ── Process each icon ──────────────────────────────────────────────────────────
for name in ["masts", "cargo", "move", "cannon"]:
    src = SRC_DIR / f"{name}.png"
    img = Image.open(src).convert("RGBA")
    w, h = img.size

    # 1. Flatten alpha onto solid black background
    bg = Image.new("RGB", (w, h), (0, 0, 0))
    bg.paste(img.convert("RGB"), mask=img.split()[3])
    img_rgb = bg

    # 2. Scale UP 2× — LANCZOS softens compression artifacts before the hard remap
    img_up = img_rgb.resize((w * 2, h * 2), Image.LANCZOS)

    # 3. Hard nearest-color remap in RGB space
    pixels = np.array(img_up, dtype=np.float32)          # (H, W, 3)
    flat = pixels.reshape(-1, 3)                          # (N, 3)
    dists = np.sum((flat[:, None, :] - PALETTE[None, :, :]) ** 2, axis=2)  # (N, 3)
    nearest = np.argmin(dists, axis=1)                    # (N,)
    remapped = PALETTE[nearest].reshape(img_up.size[1], img_up.size[0], 3).astype(np.uint8)
    img_remapped = Image.fromarray(remapped, "RGB")

    # 4. Tight crop — remove black border so ship fills the frame
    #    getbbox() on grayscale finds the bounding box of non-zero (non-black) pixels
    bbox = img_remapped.convert("L").getbbox()
    img_remapped = img_remapped.crop(bbox)
    cw, ch = img_remapped.size

    # 5. Scale DOWN to target height — LANCZOS anti-aliases the hard color boundaries
    out_w = round(OUTPUT_HEIGHT * cw / ch)
    img_out = img_remapped.resize((out_w, OUTPUT_HEIGHT), Image.LANCZOS)

    out_path = OUT_DIR / f"{name}.png"
    img_out.save(out_path, "PNG")
    print(f"  {name}.png  {w}×{h} → {out_w}×{OUTPUT_HEIGHT}  ✓")

print("\nDone. Output in", OUT_DIR)
