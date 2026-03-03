"""
Clean up jolly-roger-orig.png for use as a header logo.
- Remove black background → transparent
- Threshold whites to pure #fff (kill JPEG artifacts)
- Sharpen
- Output at 2× display size (96px tall) for retina
"""

from PIL import Image, ImageFilter, ImageEnhance
import sys

SRC = "jolly-roger-orig.png"
DST = "jolly-roger.png"
TARGET_H = 96  # 2× a 48px display height

img = Image.open(SRC).convert("RGBA")
w, h = img.size
print(f"Source: {w}×{h} {img.mode}")

# --- Step 1: Threshold each pixel ---
# Pixels brighter than threshold → pure white, keep opaque
# Pixels darker than threshold → fully transparent
pixels = img.load()
LOW  = 40   # below this → fully transparent
HIGH = 140  # above this → pure white, fully opaque

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        brightness = (r + g + b) / 3
        if brightness <= LOW:
            pixels[x, y] = (255, 255, 255, 0)
        elif brightness >= HIGH:
            pixels[x, y] = (255, 255, 255, 255)
        else:
            # Smooth transition zone for clean anti-aliased edges
            alpha = int(255 * (brightness - LOW) / (HIGH - LOW))
            pixels[x, y] = (255, 255, 255, alpha)

# --- Step 2: Sharpen ---
img = img.filter(ImageFilter.SHARPEN)
img = img.filter(ImageFilter.SHARPEN)

# --- Step 3: Resize to target height (maintain aspect ratio) ---
aspect = w / h
target_w = int(TARGET_H * aspect)
img = img.resize((target_w, TARGET_H), Image.LANCZOS)
print(f"Output: {target_w}×{TARGET_H}")

img.save(DST, "PNG", optimize=True)
print(f"Saved → {DST}")
