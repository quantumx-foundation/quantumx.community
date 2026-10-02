"""Turn speaker photos into two-tone dithered portraits (Select-style).

Usage: python3 scripts/dither.py
Reads public/images/{speakers,crew}/*.webp, writes <folder>/dither/<name>.png
"""

from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps

FOLDERS = [Path("public/images/speakers"), Path("public/images/crew")]
DARK = (12, 10, 15)
LIGHT = (214, 204, 218)
W, H, SCALE = 160, 200, 2  # 4:5 portrait, upscaled 2x so dots stay crisp

for path in sorted(p for src in FOLDERS for p in src.glob("*.webp")):
    out = path.parent / "dither"
    out.mkdir(exist_ok=True)
    im = Image.open(path).convert("L")
    im = ImageOps.fit(im, (W, H), centering=(0.5, 0.3))
    im = ImageOps.autocontrast(im, cutoff=1)
    im = ImageEnhance.Contrast(im).enhance(1.15)
    bits = im.convert("1", dither=Image.Dither.FLOYDSTEINBERG)
    duo = ImageOps.colorize(bits.convert("L"), DARK, LIGHT)
    duo = duo.resize((W * SCALE, H * SCALE), Image.Resampling.NEAREST)
    duo = duo.quantize(colors=2)
    duo.save(out / f"{path.stem}.png", optimize=True)
    print("wrote", path.stem)
