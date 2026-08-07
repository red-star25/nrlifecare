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

import { readFile, writeFile } from "node:fs/promises";
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

const errors = [];
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

  products.push({
    category: slug,
    name,
    cas: record.cas || undefined,
    grade: record.grade || undefined,
    use: record.use || undefined,
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
