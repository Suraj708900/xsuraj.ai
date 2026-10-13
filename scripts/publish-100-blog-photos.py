#!/usr/bin/env python3
"""Download 100 unique topic-grouped Unsplash covers and update every static blog page.
No external Python libraries. This operation is idempotent.
"""
from concurrent.futures import ThreadPoolExecutor, as_completed
from hashlib import sha256
from html import escape, unescape
from pathlib import Path
import json, os, re, time, urllib.request, urllib.error

ROOT = Path(__file__).resolve().parents[1]
BLOG = ROOT / "blog"
BASE = "https://xsurajteach.netlify.app"
MANIFEST = json.loads((BLOG / "photo-manifest.json").read_text(encoding="utf8"))
CATEGORIES = MANIFEST["categories"]
IDS = [id for cat in CATEGORIES for id in cat["photoIds"]]
assert len(CATEGORIES) == 10 and all(len(c["photoIds"]) == 10 for c in CATEGORIES)
assert len(IDS) == len(set(IDS)) == 100, "The 100 images must all have distinct source IDs"

idxpath = BLOG / "index.html"
idx = idxpath.read_text(encoding="utf8")
slugs = re.findall(r'<a class="card" href="/blog/([a-z0-9-]+)/">', idx)
assert len(slugs) == len(set(slugs)) == 100, f"Expected 100 unique blog posts, found {len(slugs)}"
for n, slug in enumerate(slugs):
    path = BLOG / slug / "index.html"
    if not path.is_file(): raise RuntimeError(f"Missing article {slug}")
    content = path.read_text(encoding="utf8")
    match = re.search(r'<span class="tag">([^<]+)</span>', content)
    assert match, f"Missing category for {slug}"
    actual = unescape(match.group(1))
    expected = CATEGORIES[n//10]["category"]
    assert actual == expected, f"Category mismatch: {slug}: {actual} != {expected}"

def fetch_one(i):
    slug=slugs[i]
    output=BLOG / "images" / (slug + ".webp")
    if output.is_file() and output.stat().st_size > 2000:
        image=output.read_bytes()
        if image[:4]==b"RIFF" and image[8:12]==b"WEBP":
            return (i,slug,sha256(image).hexdigest(),output.stat().st_size,"cached")
    id=IDS[i]
    url=f"https://images.unsplash.com/photo-{id}?fit=crop&w=1100&h=688&q=70&fm=webp"
    last_error=None
    for attempt in range(3):
        try:
            req=urllib.request.Request(url,headers={"User-Agent":"AISurajTeachWebsite/1.0 (+https://xsurajteach.netlify.app/)","Accept":"image/webp"})
            with urllib.request.urlopen(req,timeout=26) as resp:
                if resp.status!=200:raise ValueError(f"HTTP {resp.status}")
                image=resp.read()
            if not (image[:4]==b"RIFF" and image[8:12]==b"WEBP" and len(image)>2000):
                raise ValueError(f"Invalid or tiny WebP response ({len(image)} bytes)")
            output.write_bytes(image)
            return (i,slug,sha256(image).hexdigest(),len(image),"downloaded")
        except (urllib.error.URLError,TimeoutError,ValueError,OSError) as exc:
            last_error=exc
            if attempt<2:time.sleep(0.7*(attempt+1))
    raise RuntimeError(f"Blog post {i+1} ({slug}) — photo-{id}: {last_error}")

(BLOG/"images").mkdir(parents=True,exist_ok=True)
print("Checking 100 different Unsplash sources and writing optimized local .webp images ...",flush=True)
results=[]
errors=[]
with ThreadPoolExecutor(max_workers=9) as pool:
    jobs=[pool.submit(fetch_one,i) for i in range(100)]
    for fut in as_completed(jobs):
        try:results.append(fut.result())
        except Exception as exc:errors.append(str(exc))
if errors:
    print("BROKEN IMAGES:",flush=True)
    for e in errors: print(e,flush=True)
    raise SystemExit(f"{len(errors)} of 100 images failed to download; fix manifest and rerun")
assert len(results)==100
hashes=[r[2] for r in results]
assert len(set(hashes))==100,"Two photo IDs downloaded visually identical source image bytes"

updated=0
for n,slug in enumerate(slugs):
    article=BLOG/slug/"index.html"
    h=article.read_text(encoding="utf8")
    local=f"/blog/images/{slug}.webp"
    social=BASE+local
    title=unescape(re.search(r"<h1>([^<]+)</h1>",h).group(1))
    alt=escape("Editorial photograph illustrating "+title,quote=True)
    # Replace only the source and alt attributes of the existing hero photo, not other article images.
    pattern=r'(<figure class="hero-photo"><img )src="[^"]+" alt="[^"]+"'
    h,count=re.subn(pattern,lambda m:m.group(1)+'src="'+local+'" alt="'+alt+'"',h,count=1)
    assert count==1,f"Hero image missing: {slug}"
    h,count=re.subn(r'<meta property="og:image" content="[^"]+">',f'<meta property="og:image" content="{social}">',h,count=1)
    assert count==1,f"OpenGraph image missing: {slug}"
    if '<meta name="twitter:image"' in h:
        h=re.sub(r'<meta name="twitter:image" content="[^"]+">',f'<meta name="twitter:image" content="{social}">',h,count=1)
    else:
        h=h.replace('<meta name="twitter:card" content="summary_large_image">',f'<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="{social}">',1)
    h=h.replace('<figcaption>Illustrative editorial photograph</figcaption>','<figcaption>Illustrative editorial photo · Unsplash</figcaption>',1)
    article.write_text(h,encoding="utf8")
    updated+=1

# Rewrite each gallery card with a matching unique local source and descriptive alt.
def replace_card(match):
    url=match.group(1)
    slug=url.split("/")[2]
    assert slug in slugs,slug
    i=slugs.index(slug)
    rest=match.group(3)
    titleMatch=re.search(r'<h2>([^<]+)</h2>',rest)
    assert titleMatch,slug
    title=unescape(titleMatch.group(1))
    return '<a class="card" href="'+url+'"><img class="card-photo" src="/blog/images/'+slug+'.webp" alt="'+escape('Editorial photograph for '+title,quote=True)+'" width="640" height="360" loading="lazy" decoding="async">'+rest

# Match cards with flexible old image tag, preserving all card text.
card_pattern=r'<a class="card" href="(/blog/[a-z0-9-]+/)"><img class="card-photo"[^>]*>(<span class="tag">[\s\S]*?</a>)'
repl_count=0
def card_repl(match):
    global repl_count
    repl_count+=1
    slug=match.group(1).split("/")[2]
    title=re.search(r'<h2>([^<]+)</h2>',match.group(2)).group(1)
    return '<a class="card" href="'+match.group(1)+'"><img class="card-photo" src="/blog/images/'+slug+'.webp" alt="'+escape('Illustrative photograph for '+unescape(title),quote=True)+'" width="640" height="360" loading="lazy" decoding="async">'+match.group(2)
idx=re.sub(card_pattern,card_repl,idx)
assert repl_count==100,f"Expected 100 cards updated, got {repl_count}"
idx=re.sub(r'<meta property="og:image" content="[^"]+">',f'<meta property="og:image" content="{BASE}/blog/images/{slugs[0]}.webp">',idx,count=1)
idxpath.write_text(idx,encoding="utf8")

if (ROOT/"index.html").exists():
    home=ROOT/"index.html"
    hs=home.read_text(encoding="utf8")
    for slug in slugs:
        hs=hs.replace(f'src="https://images.unsplash.com/photo-',f'src="https://images.unsplash.com/photo-') # no-op; homepage blog cards already use local images
    home.write_text(hs,encoding="utf8")
total_bytes=sum(x[3] for x in results)
print(f"PASS: {updated} article covers + {repl_count} blog listing cards use 100 distinct local WebP files ({total_bytes//1024} KB total).",flush=True)
