"""Turn speaker photos into two-tone dithered portraits (Select-style).

Usage: python3 scripts/dither.py
Reads public/images/speakers/*.webp, writes public/images/speakers/dither/<name>.png
"""

from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps

SRC = Path("public/images/speakers")
OUT = SRC / "dither"
DARK = (12, 10, 15)
LIGHT = (214, 204, 218)
W, H, SCALE = 160, 200, 2  # 4:5 portrait, upscaled 2x so dots stay crisp

OUT.mkdir(exist_ok=True)
for path in sorted(SRC.glob("*.webp")):
    im = Image.open(path).convert("L")
    im = ImageOps.fit(im, (W, H), centering=(0.5, 0.3))
    im = ImageOps.autocontrast(im, cutoff=1)
    im = ImageEnhance.Contrast(im).enhance(1.15)
    bits = im.convert("1", dither=Image.Dither.FLOYDSTEINBERG)
    duo = ImageOps.colorize(bits.convert("L"), DARK, LIGHT)
    duo = duo.resize((W * SCALE, H * SCALE), Image.Resampling.NEAREST)
    duo = duo.quantize(colors=2)
    duo.save(OUT / f"{path.stem}.png", optimize=True)
    print("wrote", path.stem)
