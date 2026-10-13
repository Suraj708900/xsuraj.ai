# Original promotional hero image — upload checklist

The homepage now supports the exact 2048 × 689 promotional graphic supplied by the owner.

## Image asset required

Upload the optimized file **hero-ai-suraj-design.webp** to the **repository root** (same folder as `index.html`), via GitHub → **Add file** → **Upload files** → **Commit changes**.

The image is deliberately not substituted with a third-party placeholder. Until the file exists, `hero-poster.js` automatically retains the existing fully functioning live-text homepage hero instead of displaying a broken image.

## On-site behavior

- Full-width user-supplied banner appears on larger screens after successful asset load.
- Quote and Demo visual regions are actual links to `/contact/?service=quote` and `/templates/`.
- The potentially misleading “Trusted by 500+ Businesses” part of the promotional image is covered by the factual “60 Website Demos · Published Pricing” label.
- An adjacent disclaimer identifies imagery/results as illustrative, not verified customers or performance promises.
- Smaller mobile devices get the readable semantic HTML hero and working buttons.
- No pricing, login, quote form, payment form or industry links are removed.

After committing the image, wait for the Netlify deploy and hard-refresh the homepage.
