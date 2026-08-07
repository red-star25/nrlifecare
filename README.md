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

### CAS numbers and the spreadsheet date problem

Google Sheets reads `114-07-8` as a date and silently rewrites it to
`0114-07-08`. This is the same coercion that famously forced human gene names
to be changed, and on a chemical catalogue it is a correctness problem, not a
cosmetic one.

The sync defends against it. A CAS number carries a check digit — the digits of
the first two parts, reversed and weighted 1..n, sum mod 10 — so the zero
padding can be stripped and the result *verified* rather than guessed. Anything
that fails to verify is left alone and reported:

```
Repaired 18 CAS number(s) that the spreadsheet had reformatted as dates.
  Erythromycin: 0114-07-08 → 114-07-8
  ...

2 CAS number(s) look wrong — worth checking:
  Folic Acid (Vitamin B9): CAS "59-30-7" fails the check digit.
```

That second list is worth reading. It catches genuine typos, not just
spreadsheet damage.

To stop the mangling at source, select the CAS column in the sheet and choose
**Format → Number → Plain text**.

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

A deployment works out which domain it is on, and only the real domain is
crawlable. This matters because a staging copy that gets indexed competes with
the live site for the same search terms and can outrank it.

The domain is resolved in this order:

1. `NEXT_PUBLIC_SITE_URL`, if set to something usable
2. Vercel's own `VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL`
3. `https://www.nrlifecare.com`

Step 2 is the safety net: **on Vercel you do not have to set anything.** An
un-configured deployment describes itself as `*.vercel.app`, which is not the
canonical domain, so it serves `Disallow: /` and `noindex` automatically.
Attach `nrlifecare.com` as the production domain and it becomes indexable on
its own, with no variable to remember to delete.

The value is normalised before use — a bare hostname like `nrlifecare.vercel.app`
gains an `https://`, whitespace and trailing slashes are stripped, and anything
unparseable logs a warning and falls through to the next option rather than
failing the build.

To point a local or self-hosted build at a specific domain:

```bash
NEXT_PUBLIC_SITE_URL=https://staging.example.com npm run build
```

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

The contact form posts to `/api/enquiry`, a Next.js route handler that emails the enquiry to the sales desk via [Resend](https://resend.com). Nothing is stored anywhere — the message goes straight to the inbox, and the sender's address is set as `Reply-To` so replying works normally.

### Setup

Three environment variables, all set in the host's dashboard:

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes | API key from [resend.com/api-keys](https://resend.com/api-keys). |
| `ENQUIRY_TO` | No | Destination inbox. Defaults to `company.email`. |
| `ENQUIRY_FROM` | No | Sender, as `Name <address@domain>`. Defaults to Resend's shared `onboarding@resend.dev`. |

Resend's free tier covers 3,000 emails a month, which is far beyond what this site will generate.

Until a domain is verified in Resend, the shared `onboarding@resend.dev` sender only delivers to the address that owns the Resend account. **For enquiries to reach `info@nrlifecare.com`, verify `nrlifecare.com` in Resend and set `ENQUIRY_FROM` to something like `N R Life Care <enquiries@nrlifecare.com>`.** That also stops the mail landing in spam, since it will then be SPF- and DKIM-signed.

### Behaviour when it cannot send

If `RESEND_API_KEY` is missing the endpoint returns `503`, and the form tells the visitor plainly and offers to open their email client with the details pre-filled. The same fallback covers network failures. This is deliberate: an enquiry that silently disappears is much worse than an inelegant fallback.

### Spam handling

A hidden honeypot field catches naive bots — a submission with it filled in gets a cheerful `200` and is discarded. There is also a per-instance throttle of five submissions a minute per IP. Neither is bulletproof; if spam becomes a real problem, add a captcha (Cloudflare Turnstile is free and unobtrusive).

## Deploying

- **Vercel** — import the repository; no configuration beyond the environment variables above.
- **Netlify / Cloudflare Pages** — build command `npm run build`, and use the Next.js adapter for the platform.

Every page except `/api/enquiry` is prerendered at build time. The site can still be exported as a fully static bundle by adding `output: "export"` to `next.config.ts`, but doing so removes the API route, and the enquiry form falls back to opening the visitor's mail client.

### Pointing nrlifecare.in at this site

The canonical domain is `https://nrlifecare.in`, set by `CANONICAL_SITE_URL` in `src/data/site.ts`. It drives canonical URLs, the sitemap, robots.txt and the Open Graph tags, so it must match the domain actually served.

1. In Vercel → Settings → Domains, add both `nrlifecare.in` and `www.nrlifecare.in`, with the www form redirecting to the bare domain.
2. At the registrar, create the DNS records Vercel shows — an `A` record on the apex pointing at Vercel's address, and a `CNAME` on `www`.
3. Set `NEXT_PUBLIC_SITE_URL` to `https://nrlifecare.in` in the Production environment only. Leave it unset on preview deployments so they stay `noindex` — see "Staging vs production" above.
4. Redeploy, then confirm `/robots.txt` reads `Allow: /` rather than `Disallow: /`.

The `.in` registration renews on a shorter cycle than the company's other domains. Keep auto-renew enabled; if it lapses the site goes dark and the domain becomes available to anyone.

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
