/**
 * Pulls the product catalogue from a published Google Sheet and writes it into
 * src/data/products.generated.ts.
 *
 *   npm run catalog:sync                   # uses CATALOG_CSV_URL
 *   npm run catalog:sync -- ./local.csv    # or a local file, for testing
 *
 * The generated file is committed to the repository, so builds never depend on
 * the sheet being reachable. If validation fails, nothing is written and the
 * process exits non-zero — a malformed sheet can never break the live site.
 */

import { readFile, readdir, writeFile } from "node:fs/promises";
import { categoryMeta } from "../src/data/categories.ts";
import { parseCsvRecords } from "./lib/csv.mjs";

const OUTPUT = new URL("../src/data/products.generated.ts", import.meta.url);
const REQUIRED_HEADERS = ["category", "name"];

const source = process.argv[2] ?? process.env.CATALOG_CSV_URL;

if (!source) {
  console.error(
    "No source given. Set CATALOG_CSV_URL or pass a path:\n" +
      "  npm run catalog:sync -- ./catalog-export.csv",
  );
  process.exit(1);
}

async function loadCsv(from) {
  if (/^https?:\/\//.test(from)) {
    let response;
    try {
      response = await fetch(from, { redirect: "follow" });
    } catch (cause) {
      fail(
        `Could not reach the sheet at ${from}\n  ${cause.message}\n` +
          "  Check the URL, and that the sheet is still published to the web.",
      );
    }
    if (!response.ok) {
      fail(
        `The sheet returned ${response.status} ${response.statusText}.\n` +
          "  A 404 usually means the sheet was unpublished or the URL changed.",
      );
    }
    const text = await response.text();
    if (text.trimStart().startsWith("<")) {
      fail(
        "The URL returned HTML, not CSV.\n" +
          "  Use the Publish to web link ending in output=csv, not the address bar URL.",
      );
    }
    return text;
  }

  try {
    return await readFile(from, "utf8");
  } catch (cause) {
    fail(`Could not read ${from}\n  ${cause.message}`);
  }
}

function fail(message) {
  console.error(`\nCatalogue sync failed.\n\n  ${message}\n`);
  process.exit(1);
}

/** Accept the slug, the full name or the short name, case-insensitively. */
const categoryLookup = new Map();
for (const category of categoryMeta) {
  for (const key of [category.slug, category.name, category.short]) {
    categoryLookup.set(key.toLowerCase().trim(), category.slug);
  }
}

const csv = await loadCsv(source);
const { headers, records } = parseCsvRecords(csv);

const missingHeaders = REQUIRED_HEADERS.filter((h) => !headers.includes(h));
if (missingHeaders.length) {
  console.error(
    `Sheet is missing required column(s): ${missingHeaders.join(", ")}\n` +
      `Found: ${headers.join(", ")}`,
  );
  process.exit(1);
}

/**
 * CAS registry numbers carry a check digit: take the digits of the first two
 * parts, reverse them, weight by 1..n, and the sum mod 10 is the last digit.
 */
function casChecksumOk(cas) {
  const parts = /^(\d{2,7})-(\d{2})-(\d)$/.exec(cas);
  if (!parts) return false;
  const digits = (parts[1] + parts[2]).split("").reverse();
  const sum = digits.reduce((acc, d, i) => acc + Number(d) * (i + 1), 0);
  return sum % 10 === Number(parts[3]);
}

/**
 * Google Sheets eagerly reads things like `114-07-8` as a date and rewrites
 * them as `0114-07-08`. Strip the zero padding it added, but only trust the
 * result if it satisfies the CAS check digit — that turns a guess into a
 * verifiable repair.
 */
function repairCas(cas) {
  const parts = /^0*(\d+)-(\d+)-0*(\d)$/.exec(cas);
  if (!parts) return null;
  const candidate = `${parts[1]}-${parts[2].padStart(2, "0")}-${parts[3]}`;
  return casChecksumOk(candidate) ? candidate : null;
}

/**
 * Spreadsheets express "yes" in many ways depending on who typed it and
 * whether the cell was a checkbox.
 */
function isTruthy(value) {
  return /^(true|yes|y|1|x|✓)$/i.test((value ?? "").trim());
}

/**
 * Photographs live in the repository, not in the sheet. The sheet names one,
 * so a typo should be reported rather than silently producing a broken image.
 */
const knownImages = new Set(
  await readdir(new URL("../public/products/", import.meta.url)).catch(() => []),
);

const errors = [];
const warnings = [];
const repairs = [];
const seen = new Map();
const products = [];

for (const record of records) {
  const name = record.name;
  const rawCategory = record.category;

  if (!name) {
    errors.push(`Row ${record.__line}: name is empty.`);
    continue;
  }

  const slug = categoryLookup.get(rawCategory.toLowerCase());
  if (!slug) {
    errors.push(
      `Row ${record.__line}: unknown category "${rawCategory}" for "${name}".`,
    );
    continue;
  }

  const key = `${slug}::${name.toLowerCase()}`;
  if (seen.has(key)) {
    errors.push(
      `Row ${record.__line}: "${name}" already listed in ${slug} on row ${seen.get(key)}.`,
    );
    continue;
  }
  seen.set(key, record.__line);

  let cas = record.cas || undefined;
  if (cas) {
    const repaired = repairCas(cas);
    if (repaired && repaired !== cas) {
      repairs.push(`${name}: ${cas} → ${repaired}`);
      cas = repaired;
    } else if (!casChecksumOk(cas)) {
      warnings.push(`${name}: CAS "${cas}" fails the check digit.`);
    }
  }

  const image = (record.image || "").trim() || undefined;
  if (image && !knownImages.has(image)) {
    warnings.push(
      `${name}: image "${image}" is not in public/products — the page will fall back to no photo.`,
    );
  }

  const featured = isTruthy(record.featured);
  const featuredOrder = Number.parseInt(record.featured_order ?? "", 10);

  products.push({
    category: slug,
    name,
    cas,
    grade: record.grade || undefined,
    use: record.use || undefined,
    image,
    featured: featured || undefined,
    featuredOrder: Number.isFinite(featuredOrder) ? featuredOrder : undefined,
  });
}

if (errors.length) {
  console.error(`Refusing to write — ${errors.length} problem(s) in the sheet:\n`);
  for (const error of errors.slice(0, 25)) console.error(`  ${error}`);
  if (errors.length > 25) console.error(`  … and ${errors.length - 25} more.`);
  process.exit(1);
}

if (products.length === 0) {
  console.error("Refusing to write — the sheet produced zero products.");
  process.exit(1);
}

// Keep category order stable so diffs stay readable.
const order = new Map(categoryMeta.map((c, index) => [c.slug, index]));
products.sort(
  (a, b) => (order.get(a.category) ?? 0) - (order.get(b.category) ?? 0),
);

const literal = (value) =>
  value === undefined ? "undefined" : JSON.stringify(value);

const body = products
  .map((product) => {
    const parts = [`category: ${literal(product.category)}`, `name: ${literal(product.name)}`];
    if (product.cas) parts.push(`cas: ${literal(product.cas)}`);
    if (product.grade) parts.push(`grade: ${literal(product.grade)}`);
    if (product.use) parts.push(`use: ${literal(product.use)}`);
    if (product.image) parts.push(`image: ${literal(product.image)}`);
    if (product.featured) parts.push(`featured: true`);
    if (product.featuredOrder !== undefined) {
      parts.push(`featuredOrder: ${product.featuredOrder}`);
    }
    return `  { ${parts.join(", ")} },`;
  })
  .join("\n");

const file = `// AUTO-GENERATED — DO NOT EDIT BY HAND.
// Source: the product catalogue Google Sheet.
// Regenerate with: npm run catalog:sync
// See README.md → "Updating the product catalogue".

export type ProductRow = {
  category: string;
  name: string;
  cas?: string;
  grade?: string;
  use?: string;
  /** Filename under /public/products. */
  image?: string;
  /** Marked in the sheet as a product worth showing on the homepage. */
  featured?: boolean;
  /** Lower sorts first among featured products. */
  featuredOrder?: number;
};

export const productRows: ProductRow[] = [
${body}
];
`;

await writeFile(OUTPUT, file, "utf8");

const counts = new Map();
for (const product of products) {
  counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
}

console.log(`Wrote src/data/products.generated.ts — ${products.length} products.`);
for (const category of categoryMeta) {
  console.log(`  ${category.slug.padEnd(42)} ${counts.get(category.slug) ?? 0}`);
}

if (repairs.length) {
  console.log(
    `\nRepaired ${repairs.length} CAS number(s) that the spreadsheet had reformatted as dates.`,
  );
  for (const repair of repairs.slice(0, 20)) console.log(`  ${repair}`);
  if (repairs.length > 20) console.log(`  … and ${repairs.length - 20} more.`);
  console.log(
    "\n  To stop this at the source: in the sheet select the CAS column and choose\n" +
      "  Format → Number → Plain text.",
  );
}

if (warnings.length) {
  console.log(`\n${warnings.length} CAS number(s) look wrong — worth checking:`);
  for (const warning of warnings.slice(0, 20)) console.log(`  ${warning}`);
  if (warnings.length > 20) console.log(`  … and ${warnings.length - 20} more.`);
}
