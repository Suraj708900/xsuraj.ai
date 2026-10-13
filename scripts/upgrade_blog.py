from pathlib import Path
from html import escape
root=Path(__file__).resolve().parents[1]
cats=['AI Receptionist Basics','Dental Clinic Operations','Appointments & Scheduling','Local Website Design','Local SEO & Discovery','Customer Service & Support','Pricing & Vendor Evaluation','Automation Workflows','Privacy, Safety & Reliability','Business Growth & Content']
photos=['1556761175-b413da4baf72','1576091160399-112ba8d25d1d','1551836022-d5d88e9218df','1486312338219-ce68d2c6f44d','1460925895917-afdab827c52f','1551836022-d5d88e9218df','1554224155-6726b3ff858f','1581091226825-a6a2a5aee158','1486312338219-ce68d2c6f44d','1522071820081-009f0129c71c']
pages=sorted((root/'blog').glob('*/index.html'))
assert len(pages)==100, f'Expected 100, found {len(pages)}'
modified=0
for page in pages:
 h=page.read_text(encoding='utf-8')
 if 'class="hero-photo"' in h: continue
 n=next((i for i,c in enumerate(cats) if f'<span class="tag">{escape(c)}</span>' in h),None)
 if n is None: raise ValueError(f'Category missing in {page}')
 image=f'https://images.unsplash.com/photo-{photos[n]}?auto=format&fit=crop&w=1200&q=78'
 h=h.replace('Practical guide to ','Blog post about ').replace('A practical business guide','Business blog').replace('This guide focuses','This blog post focuses').replace('Related guides','Related blog posts')
 h=h.replace('<a class="brand" href="/">✦ AI Suraj Teach</a>','<a class="brand" href="/"><img class="blog-logo" src="/robot-logo.svg" width="39" height="44" alt="">AI Suraj Teach</a>')
 h=h.replace('</head>',f'<meta property="og:image" content="{image}"><meta name="twitter:card" content="summary_large_image"></head>')
 needle='</h1><p class="muted">'
 if needle not in h: raise ValueError(f'Hero missing in {page}')
 h=h.replace(needle,f'</h1><figure class="hero-photo"><img src="{image}" alt="Illustrative photograph for {cats[n]}" width="1200" height="675" decoding="async" fetchpriority="high"><figcaption>Illustrative editorial photograph</figcaption></figure><p class="muted">',1)
 page.write_text(h,encoding='utf-8')
 modified+=1
assert all('class="hero-photo"' in p.read_text(encoding='utf-8') and 'class="blog-logo"' in p.read_text(encoding='utf-8') for p in pages)
print(f'Validated {len(pages)} articles; modified {modified}')
