/**
 * One-off importer for the product photography on the company's older
 * TradeIndia-built site.
 *
 * Those images belong to NR Life Care and are already public, but they are
 * served from a vendor CDN. Hotlinking them would leave the new site rendering
 * through infrastructure we do not control, so each is fetched once, converted
 * and committed alongside everything else.
 *
 * Many products share the same underlying stock photograph, so files are named
 * by content hash: identical bytes are stored once no matter how many products
 * point at them. The run reports how much reuse it found, since a photo doing
 * duty for a dozen unrelated products is worth knowing about.
 *
 * Run with: npm run images:import
 */

import { mkdir, writeFile, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";

import { productRows } from "../src/data/products.generated.ts";

const ORIGIN = "https://www.nrlifecare.com";
const OUT_DIR = new URL("../public/products/", import.meta.url);
const MANIFEST = new URL("../src/data/product-images.generated.ts", import.meta.url);
const MAPPING_CSV = new URL("../catalog-images.csv", import.meta.url);

const MAX_EDGE = 1100;
const POLITE_DELAY_MS = 250;

/** Grade and form words that differ between the two catalogues but mean nothing here. */
const NOISE =
  /\b(ip|bp|usp|ep|jp|nf|fcc|ih|usp-nf|api|powder|granular|granules|crystals|crystal|flakes|extra|pure|anhydrous|monohydrate|dihydrate|hydrous|grade|food|tech|technical|pharma|pharmaceutical|liquid|liquids|feed)\b/g;

/** The old listings abbreviate salts; the catalogue spells them out. */
const SYNONYMS = new Map([
  ["hcl", "hydrochloride"],
  ["hbr", "hydrobromide"],
  ["na", "sodium"],
  ["k", "potassium"],
  ["ca", "calcium"],
  ["mg", "magnesium"],
  ["zn", "zinc"],
  ["fe", "iron"],
  ["sulfate", "sulphate"],
  ["sulfide", "sulphide"],
  ["standerd", "standardised"],
  ["standard", "standardised"],
]);

/**
 * Reduces a product name to a comparable token set. Word order differs between
 * the two catalogues — "Light Soda Ash" against "Soda Ash Light" — so the
 * tokens are sorted rather than compared as a phrase.
 */
function tokens(value) {
  const words = value
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(NOISE, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => SYNONYMS.get(word) ?? word);

  return [...new Set(words)].sort();
}

function normalise(value) {
  return tokens(value).join(" ");
}

/** Jaccard overlap, so a near-miss on one qualifier still matches. */
function similarity(a, b) {
  const setB = new Set(b);
  const shared = a.filter((token) => setB.has(token)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : shared / union;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/%/g, " percent ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const failureReasons = new Map();

function noteFailure(reason) {
  failureReasons.set(reason, (failureReasons.get(reason) ?? 0) + 1);
}

/**
 * The host throttles sustained crawling, and a single rejection previously
 * discarded the page for good. Back off and retry before giving up.
 */
async function getText(url, attempts = 3) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "nrlifecare-site-migration" },
      });

      if (response.ok) return response.text();

      if (response.status === 404) {
        noteFailure("404");
        throw new Error("404");
      }

      noteFailure(`HTTP ${response.status}`);
      if (attempt === attempts) throw new Error(String(response.status));
      await sleep(1200 * attempt);
    } catch (cause) {
      if (cause.message === "404") throw cause;
      if (attempt === attempts) {
        noteFailure(cause.message.slice(0, 40));
        throw cause;
      }
      await sleep(1200 * attempt);
    }
  }

  throw new Error("unreachable");
}

/** Product pages carry a numeric listing id, which separates them from category pages. */
async function discoverProductPages() {
  const seen = new Set();
  const queue = ["/"];
  const visited = new Set();

  while (queue.length) {
    const path = queue.shift();
    if (visited.has(path)) continue;
    visited.add(path);

    let html;
    try {
      html = await getText(ORIGIN + path);
    } catch {
      continue;
    }

    for (const match of html.matchAll(/href="(\/[a-z0-9-]+\.html)"/gi)) {
      const href = match[1];
      if (/-\d{6,}\.html$/.test(href)) seen.add(href);
      // Category pages list the products, so follow them once.
      else if (!visited.has(href) && visited.size < 40) queue.push(href);
    }

    await sleep(POLITE_DELAY_MS);
  }

  return [...seen];
}

function extractTitle(html) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  const title = h1 ?? html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  return title
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .split(/[|\u2013\u2014]/)[0]
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The listing's own photo lives under a path keyed by the listing id. Template
 * chrome and the company logo live elsewhere on the CDN, so they are excluded.
 */
function extractImage(html) {
  const candidates = [
    ...html.matchAll(
      /https?:\/\/cpimg\.tistatic\.com\/+(\d+)\/b\/\d+\/([A-Za-z0-9._%-]+\.(?:jpg|jpeg|png|webp))/gi,
    ),
  ].map((match) => match[0]);

  return candidates.find((url) => !/template_photo|logo/i.test(url)) ?? null;
}

console.log("Discovering product pages…");
const pages = await discoverProductPages();
console.log(`Found ${pages.length} product pages.\n`);

if (!pages.length) {
  console.error("No product pages found — the site's markup may have changed.");
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });

const catalogue = productRows.map((row) => ({ row, tokens: tokens(row.name) }));

/** Exact token-set match first, then the best overlap above a safe threshold. */
function findProduct(title) {
  const wanted = tokens(title);
  if (!wanted.length) return null;

  const key = wanted.join(" ");
  const exact = catalogue.find((entry) => entry.tokens.join(" ") === key);
  if (exact) return exact.row;

  let best = null;
  let bestScore = 0;
  for (const entry of catalogue) {
    const score = similarity(wanted, entry.tokens);
    if (score > bestScore) {
      bestScore = score;
      best = entry.row;
    }
  }

  // Below this, matches start pairing unrelated compounds that happen to
  // share a qualifier such as "sodium".
  return bestScore >= 0.75 ? best : null;
}

const bySlug = new Map(); // our product slug -> stored filename
const byHash = new Map(); // content hash -> { file, products[] }
const urlToFile = new Map(); // source URL -> { file, hash }
const unmatched = [];
let fetched = 0;
let failed = 0;
let reusedUrls = 0;

for (const [index, path] of pages.entries()) {
  if (index % 50 === 0) {
    console.log(`  ${index}/${pages.length} — matched ${fetched}`);
  }

  let html;
  try {
    html = await getText(ORIGIN + path);
  } catch {
    failed++;
    continue;
  }

  const title = extractTitle(html);
  const imageUrl = extractImage(html);
  if (!title || !imageUrl) {
    noteFailure(title ? "no image on page" : "no title on page");
    await sleep(POLITE_DELAY_MS);
    continue;
  }

  const match = findProduct(title);

  if (!match) {
    unmatched.push(title);
    await sleep(POLITE_DELAY_MS);
    continue;
  }

  const slug = slugify(match.name);
  if (bySlug.has(slug)) {
    await sleep(POLITE_DELAY_MS);
    continue;
  }

  // The listings reuse the same photograph across many products. Downloading
  // it once per product wastes requests against a host that rate-limits, so
  // remember what each URL resolved to.
  const cached = urlToFile.get(imageUrl);
  if (cached) {
    byHash.get(cached.hash).products.push(match.name);
    bySlug.set(slug, cached.file);
    fetched++;
    reusedUrls++;
    continue;
  }

  try {
    const response = await fetch(imageUrl, {
      headers: { "user-agent": "nrlifecare-site-migration", referer: ORIGIN },
    });
    if (!response.ok) throw new Error(String(response.status));

    const source = Buffer.from(await response.arrayBuffer());
    const webp = await sharp(source)
      .resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    // Distinct URLs still serve byte-identical images, so hash the result and
    // keep one copy on disk however many products point at it.
    const hash = createHash("sha1").update(webp).digest("hex").slice(0, 12);
    const file = `${hash}.webp`;

    if (!byHash.has(hash)) {
      await writeFile(new URL(file, OUT_DIR), webp);
      byHash.set(hash, { file, products: [] });
    }
    byHash.get(hash).products.push(match.name);
    bySlug.set(slug, file);
    urlToFile.set(imageUrl, { file, hash });
    fetched++;
  } catch {
    failed++;
  }

  await sleep(POLITE_DELAY_MS);
}

console.log(`\n`);

const entries = [...bySlug.entries()].sort(([a], [b]) => a.localeCompare(b));

await writeFile(
  MANIFEST,
  [
    "// AUTO-GENERATED — DO NOT EDIT BY HAND.",
    "// Source: product photography imported from the previous site.",
    "// Regenerate with: npm run images:import",
    "",
    "/** Product slug -> filename under /public/products. */",
    "export const productImages: Record<string, string> = {",
    ...entries.map(([slug, file]) => `  ${JSON.stringify(slug)}: ${JSON.stringify(file)},`),
    "};",
    "",
  ].join("\n"),
  "utf8",
);

// A column the sheet can absorb, so the catalogue stays the single source of truth.
const csvRows = entries.map(([slug, file]) => {
  const row = productRows.find((product) => slugify(product.name) === slug);
  return `${JSON.stringify(row?.name ?? slug)},${JSON.stringify(file)}`;
});
await writeFile(MAPPING_CSV, `name,image\n${csvRows.join("\n")}\n`, "utf8");

const shared = [...byHash.values()]
  .filter((entry) => entry.products.length > 1)
  .sort((a, b) => b.products.length - a.products.length);

console.log(`Matched ${fetched} products to a photograph.`);
console.log(`${byHash.size} distinct files on disk after de-duplication.`);
if (reusedUrls) {
  console.log(`${reusedUrls} downloads skipped — the URL had already been fetched.`);
}
if (failed) console.log(`${failed} pages or downloads failed.`);

if (failureReasons.size) {
  console.log(`\nWhy requests failed:`);
  for (const [reason, count] of [...failureReasons].sort((a, b) => b[1] - a[1]).slice(0, 8)) {
    console.log(`  ${String(count).padStart(5)}  ${reason}`);
  }
}

if (shared.length) {
  console.log(`\n${shared.length} images are shared by more than one product:`);
  for (const entry of shared.slice(0, 10)) {
    console.log(`  ${entry.products.length}x  ${entry.products.slice(0, 3).join(", ")}${entry.products.length > 3 ? ", …" : ""}`);
  }
}

if (unmatched.length) {
  console.log(`\n${unmatched.length} legacy products had no match in the catalogue:`);
  for (const title of unmatched.slice(0, 15)) console.log(`  ${title}`);
  if (unmatched.length > 15) console.log(`  …and ${unmatched.length - 15} more`);
}

console.log(`\nWrote catalog-images.csv for pasting into the sheet.`);
