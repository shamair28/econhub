"""Build the site icons from the header brand mark (.brand-mark in site/site.css).

    python site/tools/make_icons.py

The mark is a CSS conic gradient through the four course colours with a diamond on top.
SVG has no conic gradient, so it is drawn as thin overlapping wedges clipped to the rounded
square; an inner media query switches to the dark palette like the site does.

Writes:
  site/icon.svg                 browser-tab icon (light + dark), linked from every shell page
  favicon.ico                   16/32/48 px fallback; also what browsers fetch by default for
                                pages without icon links (the practice-test and SME pages)
  site/apple-touch-icon.png     180 px, full-bleed (iOS rounds the corners itself)
The PNG/ICO are rasterised with headless Chrome (needs Chrome installed) + Pillow.
Colours are read from the --c-<CODE> tokens in site/site.css, so re-run this if they change,
then bump ASSET_VERSION in migrate_lesson.py and run it.
"""
import math
import os
import pathlib
import re
import subprocess
import tempfile

from PIL import Image

WEB = pathlib.Path(__file__).resolve().parents[2]
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
ORDER = ["1B03", "1BB3", "1BA3", "1ME3", "1B03"]  # same stop order as .brand-mark
START_DEG = 200                                   # conic-gradient(from 200deg, …)
SIZE, RADIUS, DIAMOND = 26, 8, 6.6                # px in the CSS; DIAMOND = half-diagonal of the ◆
WEDGES = 72


def palettes():
    css = (WEB / "site" / "site.css").read_text(encoding="utf-8")
    rows = re.findall(r"--c-1B03: (#\w+); --c-1BB3: (#\w+); --c-1BA3: (#\w+); --c-1ME3: (#\w+);", css)
    light, dark = rows[0], rows[1]
    return [dict(zip(["1B03", "1BB3", "1BA3", "1ME3"], p)) for p in (light, dark)]


def rgb(h):
    h = h.lstrip("#")
    return [int(h[i:i + 2], 16) for i in (0, 2, 4)]


def colour_at(t, pal):
    stops = [rgb(pal[c]) for c in ORDER]
    seg = min(int(t * 4), 3)
    f = t * 4 - seg
    a, b = stops[seg], stops[seg + 1]
    return "#%02x%02x%02x" % tuple(round(a[i] + (b[i] - a[i]) * f) for i in range(3))


def wedges(pal):
    c, r, step = SIZE / 2, SIZE, 360 / WEDGES
    out = []
    for i in range(WEDGES):
        a0 = START_DEG + i * step - 0.6            # small overlap hides antialiasing seams
        a1 = START_DEG + (i + 1) * step + 0.6
        pt = lambda a: (c + r * math.sin(math.radians(a)), c - r * math.cos(math.radians(a)))
        (x0, y0), (x1, y1) = pt(a0), pt(a1)
        out.append(f'<path fill="{colour_at((i + 0.5) / WEDGES, pal)}" d="M13 13L{x0:.2f} {y0:.2f}L{x1:.2f} {y1:.2f}Z"/>')
    return "".join(out)


def svg(rounded=True, themed=True):
    light, dark = palettes()
    c, d = SIZE / 2, DIAMOND
    diamond = f"M{c} {c - d}L{c + d} {c}L{c} {c + d}L{c - d} {c}Z"
    clip = f'<clipPath id="r"><rect width="{SIZE}" height="{SIZE}" rx="{RADIUS if rounded else 0}"/></clipPath>'
    style = ('<style>.d{display:none}@media (prefers-color-scheme:dark){.l{display:none}.d{display:inline}}</style>'
             if themed else "")
    body = f'<g clip-path="url(#r)"><g class="l">{wedges(light)}</g>'
    body += f'<g class="d">{wedges(dark)}</g></g>' if themed else "</g>"
    body += f'<path class="l" fill="#fff" d="{diamond}"/>'
    if themed:
        body += f'<path class="d" fill="#0b0f17" d="{diamond}"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {SIZE} {SIZE}">{style}{clip}{body}</svg>\n'


def rasterise(svg_text, px, out_png):
    with tempfile.TemporaryDirectory() as tmp:
        src = pathlib.Path(tmp, "icon.svg")
        src.write_text(svg_text, encoding="utf-8")
        page = pathlib.Path(tmp, "icon.html")
        page.write_text(f'<html><body style="margin:0;background:transparent"><img src="icon.svg" width="{px}" height="{px}"></body></html>')
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
                        f"--user-data-dir={pathlib.Path(tmp, 'profile')}", "--default-background-color=00000000",
                        f"--window-size={px},{px}", f"--screenshot={out_png}", page.as_uri()],
                       check=True, capture_output=True, timeout=90)


def main():
    (WEB / "site" / "icon.svg").write_text(svg(), encoding="utf-8")
    with tempfile.TemporaryDirectory() as tmp:
        big = os.path.join(tmp, "big.png")
        rasterise(svg(themed=False), 256, big)          # light palette reads well on light and dark tabs
        Image.open(big).convert("RGBA").save(WEB / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
        touch = os.path.join(tmp, "touch.png")
        rasterise(svg(rounded=False, themed=False), 180, touch)
        Image.open(touch).convert("RGB").save(WEB / "site" / "apple-touch-icon.png", optimize=True)
    for f in ("site/icon.svg", "favicon.ico", "site/apple-touch-icon.png"):
        print(f, (WEB / f).stat().st_size, "bytes")


if __name__ == "__main__":
    main()
