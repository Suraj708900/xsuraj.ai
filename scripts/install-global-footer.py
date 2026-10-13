#!/usr/bin/env python3
"""Install shared footer CSS/JS across the 100 existing static blog article pages.
   Safe to rerun; never edits article body or featured photo markup."""
from pathlib import Path

root = Path(__file__).resolve().parents[1]
pages = sorted((root / "blog").glob("*/index.html"))
if len(pages) != 100:
    raise SystemExit(f"Expected 100 blog article pages, got {len(pages)}")

css = '<link rel="stylesheet" href="/site-footer.css">'
rss = '<link rel="alternate" type="application/rss+xml" title="AI Suraj Teach Blog" href="/feed.xml">'
js = '<script src="/site-footer.js" defer></script>'
updated = 0
for path in pages:
    html = path.read_text(encoding="utf-8")
    if "</head>" not in html or "</body>" not in html:
        raise SystemExit(f"Missing closing HTML elements: {path}")
    if css not in html:
        html = html.replace("</head>", css + rss + "</head>", 1)
    if js not in html:
        html = html.replace("</body>", js + "</body>", 1)
    assert html.count(css) == 1 and html.count(js) == 1, str(path)
    path.write_text(html, encoding="utf-8")
    updated += 1

assert all(css in p.read_text(encoding="utf-8") and js in p.read_text(encoding="utf-8") for p in pages)
print(f"PASS: shared premium footer installed on {updated} of 100 blog article pages.")
