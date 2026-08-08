# NR Life Care — Website

The official website for **NR Life Care**, an Ahmedabad-based manufacturer, importer, exporter and wholesale supplier of Active Pharmaceutical Ingredients, pharmaceutical excipients, intermediates, vitamins, nutraceutical actives and specialty chemicals.

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

Catalogue editing uses Sanity CMS (`/studio`). The public site stays mostly prerendered; only `/api/enquiry` and `/studio` need a server runtime (Vercel).

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

The palette is derived from the company logo indigo, lifted slightly so dark
sections read as rich purple-blue rather than near-black. Logo artwork stays
`#2a176f` (`--color-brand-900`); UI chrome uses the lighter `--color-brand-800`. Gold (`--color-gold-*`) is used sparingly for trust and
credential signals.

Logo files live in `public/`:

| File | Use |
| --- | --- |
| `logo-nrlifecare.png` | Indigo wordmark, for light backgrounds |
| `logo-nrlifecare-light.png` | Inverted, for dark backgrounds |

These were recovered from the existing site at 293x72. If a vector (SVG/AI/EPS)
original is available from the printer or designer, drop it in and update
`src/components/logo.tsx` — it will stay crisp at any size.

## Updating the product catalogue (Sanity CMS)

Day-to-day edits happen in **Sanity Studio** at `/studio`. Your dad or an
employee can add products, upload a photo, and tick **Show on homepage** —
no code, no Google Sheet.

### How it fits together

```
Sanity Studio (/studio) ──publish──> Sanity webhook
                                         │
                                         ▼
                              GitHub Action (cms-pull)
                                         │
                    writes src/data/products.generated.ts
                                         │
                              build + commit + Vercel redeploy
```

The generated file is committed, so **builds never depend on Sanity being
reachable**. If Sanity is briefly down, the site keeps shipping the last good
catalogue.

### First-time setup

1. Create a free project at [sanity.io/manage](https://www.sanity.io/manage).
2. Copy the project ID into `.env.local` and into Vercel / GitHub secrets:

   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=xxxx
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=sk...   # Editor token with write access
   ```

3. Invite dad/employees as **Editors** in the Sanity project members screen.
4. Seed Sanity from the current catalogue:

   ```bash
   npm run cms:push
   ```

5. Open `https://<your-site>/studio`, sign in, and confirm products appear.
6. Wire auto-sync (so dad never has to run a workflow):

   a. Create a GitHub Personal Access Token (classic) with the `repo` scope,
      or a fine-grained token that can trigger workflows on this repository.
      Store it in Vercel as `GH_DISPATCH_TOKEN`.

   b. Invent a long random string and store it in Vercel as
      `SANITY_WEBHOOK_SECRET` (and optionally `GH_REPO=red-star25/nrlifecare`).

   c. In Sanity → API → Webhooks → Create webhook:
      - URL: `https://nrlifecare.vercel.app/api/cms-webhook`
      - Trigger: Create / Update / Delete on `product`
      - HTTP header: `x-webhook-secret` = the same secret as above
      - Dataset: `production`

   After that, every Publish in Studio kicks off the pull Action automatically.
   Until the webhook is set, you can still run **Actions → Pull catalogue from
   Sanity** by hand.

### Day-to-day (for dad / employees)

1. Go to `/studio` and sign in.
2. Open **Product** → edit or create.
3. Fill name, category, optional CAS / grade / use.
4. Upload a photo if you have one.
5. Tick **Show on homepage** for popular products (set order if you care).
6. Publish.

### Homepage featured products

Any product with **Show on homepage** ticked appears in the “What buyers order
most” section, sorted by **Homepage order** (lower first).

### Importing a new PDF catalogue

```bash
npm run catalog:import-pdf -- "/path/to/catalogue.pdf"
npm run cms:push    # after Sanity is configured
```

### Legacy Google Sheet sync

The old sheet workflow (`catalog:sync`) still exists but is retired for
day-to-day use. Prefer Sanity.

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

Until a domain is verified in Resend, the shared `onboarding@resend.dev` sender only delivers to the address that owns the Resend account. **For enquiries to reach `info@nrlifecare.com`, verify `nrlifecare.com` in Resend and set `ENQUIRY_FROM` to something like `NR Life Care <enquiries@nrlifecare.com>`.** That also stops the mail landing in spam, since it will then be SPF- and DKIM-signed.

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

Product listings, grades and company details were compiled from NR Life Care's existing published material. The site deliberately avoids claiming manufacturing certifications (WHO-GMP, ISO, USFDA) that belong to partner manufacturing plants rather than to the firm — see the "What we do not claim" section on `/quality`. Review all product data with the business before publishing, and keep CAS numbers and pharmacopoeial grades verified against current supplier documentation.
