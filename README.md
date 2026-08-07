# N R Life Care — Website

The official website for **N R Life Care**, an Ahmedabad-based manufacturer, importer, exporter and wholesale supplier of Active Pharmaceutical Ingredients, pharmaceutical excipients, intermediates, vitamins, nutraceutical actives and specialty chemicals.

Built as a fully independent site — no marketplace lock-in, no Indiamart or TradeIndia dependency.

---

## Tech stack

| Concern    | Choice                                        |
| ---------- | --------------------------------------------- |
| Framework  | Next.js 16 (App Router, React 19, Turbopack)  |
| Language   | TypeScript                                    |
| Styling    | Tailwind CSS v4 (CSS-first `@theme` tokens)   |
| Animation  | Motion (`motion/react`)                       |
| Fonts      | Sora (display), Inter (body), JetBrains Mono  |
| Rendering  | Fully static — every route is prerendered     |

No database, no CMS and no server runtime, so the site can be hosted anywhere static files can be served.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

## Brand

The palette is derived from the company logo. The logo indigo is `#2a176f`,
exposed as `--color-brand-800` in `src/app/globals.css`; every other brand shade
is a tint or shade of it. Gold (`--color-gold-*`) is used sparingly for trust and
credential signals.

Logo files live in `public/`:

| File | Use |
| --- | --- |
| `logo-nrlifecare.png` | Indigo wordmark, for light backgrounds |
| `logo-nrlifecare-light.png` | Inverted, for dark backgrounds |

These were recovered from the existing site at 293x72. If a vector (SVG/AI/EPS)
original is available from the printer or designer, drop it in and update
`src/components/logo.tsx` — it will stay crisp at any size.

## Updating the product catalogue

Products live in a Google Sheet, not in the code. Nobody needs a developer, a
login, or a CMS to add a product — edit the sheet, and the site follows within
the hour.

### How it fits together

```
Google Sheet  ──published as CSV──>  GitHub Action (hourly)
                                          │
                                          ├─ validates every row
                                          ├─ writes src/data/products.generated.ts
                                          ├─ runs a full production build
                                          └─ commits only if the build passed
                                                    │
                                                    └──> host redeploys
```

`src/data/products.generated.ts` is committed to the repository, so **builds
never depend on the sheet being reachable**. If Google is down, or the sheet is
mid-edit, the site keeps building from the last good copy.

### Sheet format

One row per product. The header row must be present; column order does not
matter and capitalisation is ignored.

| Column | Required | Notes |
| --- | --- | --- |
| `category` | Yes | Slug, full name or short name — `vitamins-and-minerals`, `Vitamins & Minerals` and `Vitamins and Minerals` all work |
| `name` | Yes | Product name. Becomes the page URL |
| `cas` | No | CAS registry number |
| `grade` | No | e.g. `IP / BP / USP` |
| `use` | No | One short line describing the application |

Valid category values come from `src/data/categories.ts`. To add a whole new
category, add it there — that part is editorial prose and does change rarely.

### First-time setup

1. Seed the sheet with what is already on the site:

   ```bash
   npm run catalog:export     # writes catalog-export.csv
   ```

   Open the CSV, copy everything, paste into a new Google Sheet.

2. In the sheet: **File → Share → Publish to web**, choose the sheet and
   **Comma-separated values (.csv)**, publish, and copy the URL. It looks like
   `https://docs.google.com/spreadsheets/d/e/…/pub?gid=0&single=true&output=csv`.

   Publishing exposes only that one tab as read-only CSV. It does not make the
   document editable by anyone.

3. In GitHub: **Settings → Secrets and variables → Actions → New repository
   secret**, named `CATALOG_CSV_URL`, set to that URL.

4. Run it once by hand from the **Actions** tab → *Sync product catalogue* →
   *Run workflow*, to confirm the wiring.

### Day-to-day

Your dad edits the sheet. Within the hour the Action picks it up, validates it,
builds the site, and commits. Nothing else to do.

To pull changes immediately, either trigger the workflow from the Actions tab,
or run it locally:

```bash
CATALOG_CSV_URL="https://docs.google.com/..." npm run catalog:sync
npm run build
```

### What happens when the sheet has a mistake

The sync refuses to write and the Action fails loudly, leaving the live site on
the last good catalogue. It rejects unknown categories, duplicate products
within a category, empty names, and an empty sheet:

```
Refusing to write — 3 problem(s) in the sheet:

  Row 3: unknown category "not-a-real-category" for "Widget".
  Row 4: "Paracetamol" already listed in active-pharmaceutical-ingredients on row 2.
  Row 5: name is empty.
```

### Making it instant instead of hourly

If waiting up to an hour is annoying, add this Apps Script to the sheet
(**Extensions → Apps Script**) and set an *On edit* trigger. Create a deploy
hook on your host and paste its URL in:

```javascript
function onEditTrigger() {
  UrlFetchApp.fetch("https://api.vercel.com/v1/integrations/deploy/...", {
    method: "post",
  });
}
```

Still no backend, still no server to maintain.

## Staging vs production

`NEXT_PUBLIC_SITE_URL` controls which domain a deployment believes it is. It
feeds canonical tags, the sitemap, Open Graph URLs and `robots.txt`.

| Deployment | `NEXT_PUBLIC_SITE_URL` | Crawlable |
| --- | --- | --- |
| Production | unset (defaults to `https://www.nrlifecare.com`) | Yes |
| Staging / preview | the temporary URL, e.g. `https://nrlifecare.vercel.app` | No — `Disallow: /` and `noindex` |

This matters: a staging copy that gets indexed competes with the real site for
the same search terms and can outrank it. Set the variable on any deployment
that is not the final domain, and remove it when the domain is switched over.

## Project structure

```
src/
├── app/
│   ├── layout.tsx              # fonts, metadata, Organization/LocalBusiness JSON-LD
│   ├── page.tsx                # homepage
│   ├── about/                  # company story, timeline, values
│   ├── products/
│   │   ├── page.tsx            # searchable catalogue
│   │   └── [slug]/page.tsx     # one page per category (statically generated)
│   ├── industries/             # sectors served
│   ├── quality/                # CoA, MSDS, pharmacopoeial standards
│   ├── contact/                # enquiry form, map, contact details
│   ├── opengraph-image.tsx     # generated social share image
│   ├── sitemap.ts / robots.ts  # generated SEO files
│   └── globals.css             # design tokens and base styles
├── components/                 # header, footer, hero, catalogue explorer, UI primitives
└── data/
    ├── company.ts              # company facts, credentials, stats, quality commitments
    ├── categories.ts           # category prose: descriptions, applications, packing
    ├── products.generated.ts   # AUTO-GENERATED from the Google Sheet — do not edit
    ├── catalog.ts              # merges the two above; search/derived helpers
    └── industries.ts           # industries served
```

## Editing content

**To add or edit a product**, use the Google Sheet — see
[Updating the product catalogue](#updating-the-product-catalogue). Do not edit
`products.generated.ts`; the next sync overwrites it.

Product counts, search, filters, category pages, product pages, the sitemap and
structured data all derive from the sheet automatically.

**To change contact details, phone numbers, credentials or company facts**, edit
`src/data/company.ts`. These values feed the header, footer, contact page,
quality page, schema.org markup and page metadata.

**To add a new product category**, append a category object to `categoryMeta` in
`src/data/categories.ts` and add a matching icon in the `categoryIcons` map in
`src/components/icons.tsx`. A static page is generated at `/products/<slug>`
automatically, and the new category name becomes valid in the sheet.

## The enquiry form

The site is fully static, so the contact form composes a structured message and hands it to the visitor's email client or WhatsApp. Nothing is stored, and no server is required.

To deliver submissions server-side instead, wire `src/components/contact/enquiry-form.tsx` to a form backend — [Formspree](https://formspree.io), [Web3Forms](https://web3forms.com) or a Next.js route handler using [Resend](https://resend.com) all work. Replace the `handleSubmit` function with a `fetch` POST to your endpoint.

## Deploying

The site is static, so any of these work:

- **Vercel** — import the repository; no configuration needed.
- **Netlify / Cloudflare Pages** — build command `npm run build`, and use the Next.js adapter for the platform.
- **Any static host** — add `output: "export"` to `next.config.ts` and serve the generated `out/` directory. Note that the `next/og` generated images require build-time generation, which the export handles.

### Pointing www.nrlifecare.com at this site

1. Deploy to your chosen host.
2. Add `nrlifecare.com` and `www.nrlifecare.com` as custom domains in the host's dashboard.
3. Update the DNS records at your domain registrar to the values the host provides.
4. Confirm `SITE_URL` in `src/data/company.ts` matches the final canonical domain — it drives canonical URLs, the sitemap, robots.txt and Open Graph tags.

## SEO

- Per-page titles, descriptions and canonical URLs
- `Organization`, `WebSite`, `LocalBusiness`, `ContactPage` and `CollectionPage` JSON-LD
- Auto-generated `sitemap.xml` and `robots.txt` covering every category page
- Generated Open Graph and Apple touch images
- Semantic headings, breadcrumbs and descriptive link text throughout

After deploying, submit the sitemap in [Google Search Console](https://search.google.com/search-console) and claim the [Google Business Profile](https://business.google.com) for the Ahmedabad address to strengthen local search results.

## Accessibility

Skip-to-content link, visible focus rings, semantic landmarks, labelled form fields, `aria` attributes on interactive controls, and a `prefers-reduced-motion` block that disables animation for visitors who ask for it.

## A note on claims

Product listings, grades and company details were compiled from N R Life Care's existing published material. The site deliberately avoids claiming manufacturing certifications (WHO-GMP, ISO, USFDA) that belong to partner manufacturing plants rather than to the firm — see the "What we do not claim" section on `/quality`. Review all product data with the business before publishing, and keep CAS numbers and pharmacopoeial grades verified against current supplier documentation.
