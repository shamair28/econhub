"""Upgrade lesson pages to the shared Study Hub shell, and keep site asset versions in sync.

    python site/tools/migrate_lesson.py                 # every <CODE>/<CODE>-chN.html under website/
    python site/tools/migrate_lesson.py 1BA3/1BA3-ch7.html

What it does to an old-format page (one that still links <CODE>.css / next-chapter.js):
  * <head>: swaps the per-course stylesheet for /site/site.css + /site/lesson.css (+ fonts, and a
    tiny script that applies the saved theme before first paint)
  * <body>: adds class="lesson" + data-course / data-chapter
  * wraps the page in the shell: top bar, sidebar <aside>, <main class="page" id="main">
  * wraps course-tag + title + subtitle(s) in <header class="lesson-hero">
  * replaces the old "Next Chapter" footer with <nav class="pager"> (filled by site/site.js)
  * wraps every <table> in <div class="table-wrap"> so wide tables scroll on phones
  * swaps hard-coded light-mode inline styles for classes (they were unreadable in dark mode)
Content, figures and ids are untouched; the script verifies figure payloads, section ids and table
counts are identical before writing. Already-migrated pages are skipped (only their ?v= is synced).

Every run also adds the tab-icon links (site/icon.svg, favicon.ico, apple-touch-icon — built by
make_icons.py) to any shell page missing them, and rewrites `/site/<asset>?v=N` in all lesson pages,
index.html and 404.html to ASSET_VERSION — bump it after editing anything in site/ so browsers and Cloudflare refetch.
It then warns about chapter pages missing from site/courses.js or _redirects.
"""
import hashlib
import pathlib
import re
import sys

ASSET_VERSION = 5

WEB = pathlib.Path(__file__).resolve().parents[2]
PAGE_RE = re.compile(r"^(?P<code>[0-9A-Z]{4})-ch(?P<n>\d+)\.html$")

HEAD_BLOCK = """<meta name="color-scheme" content="light dark">
<script>try{var d=document.documentElement,t=localStorage.getItem('hub:theme');if(t)d.setAttribute('data-theme',t);if(localStorage.getItem('hub:nav')==='closed')d.classList.add('nav-collapsed')}catch(e){}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/site/site.css?v=1">
<link rel="stylesheet" href="/site/lesson.css?v=1">"""

SHELL_OPEN = """<a class="skip-link" href="#main">Skip to lesson</a>
<header class="topbar" id="topbar"></header>
<div class="shell">
<aside class="sidenav" id="sidenav" aria-label="Chapters and course menu"></aside>
<main class="page" id="main">"""

SHELL_CLOSE = """</main>
</div>
<div class="scrim" id="scrim" hidden></div>
<script src="/site/courses.js?v=1"></script>
<script src="/site/site.js?v=1"></script>
</body>"""

ICON_LINKS = """<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/site/icon.svg?v=1" type="image/svg+xml">
<link rel="apple-touch-icon" href="/site/apple-touch-icon.png?v=1">"""

PAGER = '<nav class="pager" id="pager" aria-label="Chapter navigation"></nav>'

# hard-coded light colours → classes styled for both themes in site/lesson.css
INLINE_FIXES = [
    (' style="max-width:100%;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,0.10);"', ''),
    ('<pre style="background:#ECFDF5;color:#065F46;padding:8px;border-radius:4px;font-size:0.85rem;">', '<pre class="answer-pre">'),
    ('<div style="margin-top:28px;padding:16px 20px;background:#F9FAFB;border-radius:10px;border:1px solid #E5E7EB;">', '<div class="self-check">'),
    ('<div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;padding:18px 22px;margin-top:24px;">', '<div class="self-check">'),
    ('<strong style="font-family:Arial,sans-serif;font-size:0.85rem;letter-spacing:0.5px;">', '<strong>'),
    ("<strong style=\"font-family:'Arial',sans-serif;font-size:0.85rem;letter-spacing:0.8px;text-transform:uppercase;color:#6B7280;\">", '<strong>'),
    ('<p style="margin:4px 0 0;font-size:0.9rem;color:#374151;">', '<p class="rule-example">'),
    ('<p class="footer-note" style="font-size:0.85em; opacity:0.75; margin-top:1.5rem;">', '<p class="footer-note">'),
]

B64_RE = re.compile(r"base64,([A-Za-z0-9+/=]+)")


def fingerprint(html):
    return (
        sorted(hashlib.sha1(m.encode()).hexdigest() for m in B64_RE.findall(html)),
        re.findall(r'<section id="([^"]+)"', html),
        html.count("<table"),
        html.count("<figure"),
    )


def migrate(html, code, n):
    nl = "\r\n" if "\r\n" in html else "\n"
    L = lambda block: block.replace("\n", nl)
    before = fingerprint(html)

    def sub1(pattern, repl, s, flags=0, what=""):
        out, k = re.subn(pattern, repl, s, count=1, flags=flags)
        if k != 1:
            raise ValueError(f"could not find {what or pattern!r}")
        return out

    html = sub1(r'<link rel="stylesheet" href="[0-9A-Z]{4}\.css">', lambda m: L(HEAD_BLOCK), html, what="course stylesheet link")

    def body_tag(m):
        classes = " ".join(["lesson"] + ([m.group(1)] if m.group(1) else []))
        return f'<body class="{classes}" data-course="{code}" data-chapter="{n}">'
    html = sub1(r'<body(?: class="([^"]*)")?>', body_tag, html, what="<body>")
    html = sub1(r'<div class="page">', lambda m: L(SHELL_OPEN), html, what='<div class="page">')
    html = sub1(
        r'(<div class="course-tag">.*?</div>\s*<h1 class="lesson-title">.*?</h1>(?:\s*<p class="subtitle"[^>]*>.*?</p>)*)',
        lambda m: L('<header class="lesson-hero">\n  ') + m.group(1) + L("\n  </header>"),
        html, flags=re.S, what="course-tag/title/subtitle hero")
    html = sub1(r'(?:<!--[^>]*Footer[^>]*-->\s*)?<section id="footer">.*?</section>', lambda m: PAGER, html, flags=re.S, what="footer section")
    html = sub1(r'</div>(?:\s*<!--[^>]*-->)?\s*<script src="next-chapter\.js"></script>\s*</body>', lambda m: L(SHELL_CLOSE), html, flags=re.S, what="page close + next-chapter.js")
    html = re.sub(r"(<table\b.*?</table>)", r'<div class="table-wrap">\1</div>', html, flags=re.S)
    for old, new in INLINE_FIXES:
        html = html.replace(old, new)

    after = fingerprint(html)
    if before[0] != after[0]:
        raise ValueError("figure payloads changed")
    if [s for s in before[1] if s != "footer"] != after[1]:
        raise ValueError(f"section ids changed: {before[1]} -> {after[1]}")
    if before[2:] != after[2:]:
        raise ValueError("table/figure counts changed")
    return html


def sync_versions(path, icons=True):
    text = path.read_bytes().decode("utf-8")
    new = text
    anchor = '<meta name="color-scheme" content="light dark">'
    if icons and 'rel="icon"' not in new and anchor in new:
        nl = "\r\n" if "\r\n" in new else "\n"
        new = new.replace(anchor, anchor + nl + ICON_LINKS.replace("\n", nl), 1)
    new = re.sub(r'(/site/[\w.-]+\.(?:css|js|svg|png))\?v=\d+', rf"\g<1>?v={ASSET_VERSION}", new)
    if new != text:
        path.write_bytes(new.encode("utf-8"))
        return True
    return False


def check_registration(pages):
    courses_js = (WEB / "site" / "courses.js").read_text(encoding="utf-8")
    redirects = (WEB / "_redirects").read_text(encoding="utf-8")
    for p in pages:
        m = PAGE_RE.match(p.name)
        code, n = m["code"], int(m["n"])
        block = re.search(rf"code: '{code}'.*?chapters: \[(.*?)\]", courses_js, re.S)
        if not block or not re.search(rf"\{{ n: {n},", block.group(1)):
            print(f"  ! {code} ch{n}: not in site/courses.js — it won't appear on the hub or in side menus")
        if not re.search(rf"^/{code}/ch{n}\s+/{code}/{p.name}\s+200", redirects, re.M):
            print(f"  ! {code} ch{n}: no _redirects line (/{code}/ch{n}  /{code}/{p.name}  200)")


def main(argv):
    if argv:
        pages = [(WEB / a).resolve() for a in argv]
    else:
        pages = sorted(p for p in WEB.glob("*/*-ch*.html") if PAGE_RE.match(p.name))
    for p in pages:
        m = PAGE_RE.match(p.name)
        if not m:
            print(f"skip {p.name}: not a <CODE>-chN.html lesson page")
            continue
        html = p.read_bytes().decode("utf-8")
        rel = p.relative_to(WEB).as_posix()
        if "/site/lesson.css" in html:
            print(f"ok   {rel} (already migrated)")
        else:
            try:
                html = migrate(html, m["code"], int(m["n"]))
            except ValueError as e:
                print(f"FAIL {rel}: {e}")
                continue
            p.write_bytes(html.encode("utf-8"))
            print(f"done {rel}")
        sync_versions(p)
    for extra in ("index.html", "404.html"):
        sync_versions(WEB / extra)
    sync_versions(WEB / "1BA3" / "1BA3-sme.html", icons=False)  # loads /site/explain.js; its own UI is untouched
    check_registration([p for p in pages if PAGE_RE.match(p.name)])


if __name__ == "__main__":
    main(sys.argv[1:])
