# Little Paws Dubai

A responsive puppy discovery demo built for the Blutec AI technical assignment. The TeddyPups reference informed the navigation and catalog flows. This implementation uses original branding, layout, copy, synthetic inventory and AI-generated portraits.

## Run locally

Run `python3 -m http.server 8000 --directory dist` and open http://localhost:8000. No package installation, build step, or environment variables are required.

- `dist/index.html` provides the shared navigation, footer and dialog.
- `dist/style.css` defines layout, breakpoints and focus styles.
- `dist/app.js` handles hash routes, filtering, the gallery and enquiry preview.
- `dist/data.js` contains demo profiles and FAQ content.
- `dist/images/` contains portable WebP assets.

Hash routes allow deep links on a static host. Catalog controls serialize into the URL so filters can be shared. The contact form validates inputs and renders a local preview through text nodes. It makes no network submissions and stores no personal data. The assignment demo uses no live WhatsApp number, booking backend, customer photos, or puppy videos.

## Deployment

GitHub Pages serves the static files from the root of the `gh-pages` branch. The source files are in `dist/` on `main`.

## Loom walkthrough outline

1. Open the landing page and explain how the reference informed the set of visitor flows.
2. Filter the catalog by location and breed. Open a puppy and show the profile and photo dialog.
3. Show the mobile menu, FAQ, gone-home gallery, and visit form. Point out that the enquiry preview is local.
4. Open the source and explain the data module, URL-backed filters, routing, native dialog, and CSS breakpoints.
5. Show the AI disclosure and read the exact image prompt. Explain that ChatGPT Codex assisted with design, code, and verification after receiving the assignment brief.
6. Show the live deployment and the results of the browser checks.

## AI image generation prompt

> Create a photorealistic 3 by 2 contact sheet of six separate square puppy portraits, flush tiles with no gutters or lettering, evenly split in exact thirds horizontally and halves vertically. Warm editorial studio photography with daylight, puppy centered in each tile, plenty of space above ears. Row one: apricot Maltipoo on warm butterscotch, cream Toy Poodle on pale sage, caramel Cavapoo on dusty pink. Row two: orange Pomeranian on lavender, black and white Shih Tzu on peach, chocolate Poodle on pale teal. Distinct animals, dog-eye-level, soft natural shadows. No people, typography, logos, collar tags, frames, or overlays.

## Live demo

https://prashantpowar45.github.io/little-paws-dubai/

## Browser verification

Verified combined breed and location filters, deep-linked status and reset, profile photo dialog, FAQ accordion, and the prefilled enquiry preview. Rechecked the filter reset on the deployed site.
