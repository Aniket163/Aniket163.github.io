"""
OPTIONAL helper: rebuild the three portrait images from a new photo.

You only need this if you want to change your photo later.
It creates, in assets/img/:
  aniket.webp         - colour cut-out (background removed)
  aniket-ink.webp     - red comic-print "mask" version used for hover-to-reveal
  aniket-avatar.webp  - square crop for the About circle

Setup (once, in the VS Code terminal):
    pip install rembg onnxruntime pillow numpy scipy

Run (from the project folder):
    python tools/make_portrait_assets.py path\\to\\your-photo.jpg

Tips: use a front-facing photo on a plain, light background, roughly 3:4 (portrait).
The first run downloads a background-removal model (~180 MB).
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

OUT = Path(__file__).resolve().parent.parent / "assets" / "img"


def cut_out(photo: Image.Image) -> Image.Image:
    from rembg import new_session, remove

    session = new_session("isnet-general-use")
    cut = np.asarray(remove(photo, session=session)).astype(np.float32)
    src = np.asarray(photo).astype(np.float32)
    alpha = cut[..., 3:4] / 255.0
    bg_pixels = src[cut[..., 3] < 5]
    bg = bg_pixels.mean(0) if len(bg_pixels) else np.array([240, 240, 240], np.float32)
    # remove the light halo left on hair edges
    edge = (alpha > 0.02) & (alpha < 0.98)
    fg = np.clip((src - (1 - alpha) * bg) / np.maximum(alpha, 0.02), 0, 255)
    rgb = np.where(edge, fg, src)
    return Image.fromarray(np.concatenate([rgb, cut[..., 3:4]], -1).astype(np.uint8), "RGBA")


def comic_ink(cutout: Image.Image, cell: float = 7.0) -> Image.Image:
    W, H = cutout.size
    rgb = np.asarray(cutout.convert("RGB")).astype(np.float32) / 255.0
    alpha = np.asarray(cutout)[..., 3].astype(np.float32) / 255.0
    lum = 0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]
    blur = ndimage.gaussian_filter(lum, 18)
    lum2 = np.clip((lum - blur) * 1.6 + blur, 0, 1)
    lum2 = np.clip((lum2 - 0.08) / 0.82, 0, 1) ** 0.9

    g1 = ndimage.gaussian_filter(lum2, 1.1)
    g2 = ndimage.gaussian_filter(lum2, 1.1 * 1.6)
    d = 23 * g1 - 22 * g2
    lines = np.clip(np.where(d >= -0.02, 1.0, 1 + np.tanh(12 * (d + 0.02))), 0, 1)

    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    a = np.deg2rad(45)
    u = (xx * np.cos(a) + yy * np.sin(a)) / cell
    v = (-xx * np.sin(a) + yy * np.cos(a)) / cell
    dist = np.sqrt((u - np.round(u)) ** 2 + (v - np.round(v)) ** 2)
    radius = np.sqrt(np.clip(1 - ndimage.gaussian_filter(lum2, 1.2), 0, 1)) * 0.62
    dots = 1 - np.clip((dist - radius) * cell * 1.2 + 0.5, 0, 1)

    paper = np.array([0.97, 0.94, 0.90]); red = np.array([0.80, 0.07, 0.15])
    deep = np.array([0.45, 0.02, 0.07]); ink = np.array([0.07, 0.05, 0.06])
    t_light = np.clip((lum2 - 0.62) / 0.25, 0, 1)[..., None]
    img = red * (1 - t_light) + paper * t_light
    img = img * (1 - dots[..., None] * 0.85) + deep * (dots[..., None] * 0.85)
    shadow = np.clip((0.27 - lum2) / 0.12, 0, 1)[..., None]
    img = img * (1 - shadow) + ink * shadow
    img = img * lines[..., None] + ink * (1 - lines[..., None])
    out = np.dstack([np.clip(img, 0, 1), alpha])
    return Image.fromarray((out * 255).astype(np.uint8), "RGBA")


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    photo = Image.open(sys.argv[1]).convert("RGB")
    # fit to a 3:4 canvas
    w, h = photo.size
    target = 3 / 4
    if w / h > target:
        nw = int(h * target); photo = photo.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = int(w / target); photo = photo.crop((0, 0, w, nh))
    photo = photo.resize((720, 960), Image.LANCZOS)

    print("Removing background...")
    cut = cut_out(photo)
    cut.save(OUT / "aniket.webp", "WEBP", quality=86, method=6)
    print("Drawing comic-print mask...")
    comic_ink(cut).save(OUT / "aniket-ink.webp", "WEBP", quality=84, method=6)
    side = int(720 * 0.69)
    left = (720 - side) // 2; top = int(960 * 0.12)
    photo.crop((left, top, left + side, top + side)).resize((520, 520), Image.LANCZOS).save(
        OUT / "aniket-avatar.webp", "WEBP", quality=86, method=6)
    print("Done. Images written to", OUT)


if __name__ == "__main__":
    main()
