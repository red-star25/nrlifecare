/**
 * One-shot / maintenance: rewrite products.generated.ts with cross-category
 * duplicates removed.
 *
 *   node --experimental-strip-types --no-warnings scripts/dedupe-catalog.mjs
 */

import { writeFile } from "node:fs/promises";

import { categoryMeta } from "../src/data/categories.ts";
import { productRows } from "../src/data/products.generated.ts";
import { dedupeProducts } from "./lib/dedupe-products.mjs";

const before = productRows.length;
const { products, removed } = dedupeProducts(productRows);

const literal = (value) =>
  value === undefined || value === null ? "undefined" : JSON.stringify(value);

const body = products
  .map((product) => {
    const parts = [
      `category: ${literal(product.category)}`,
      `name: ${literal(product.name)}`,
    ];
    if (product.cas) parts.push(`cas: ${literal(product.cas)}`);
    if (product.grade) parts.push(`grade: ${literal(product.grade)}`);
    if (product.use) parts.push(`use: ${literal(product.use)}`);
    if (product.image) parts.push(`image: ${literal(product.image)}`);
    if (product.featured) parts.push(`featured: true`);
    if (product.featuredOrder !== undefined && product.featuredOrder !== null) {
      parts.push(`featuredOrder: ${Number(product.featuredOrder)}`);
    }
    return `  { ${parts.join(", ")} },`;
  })
  .join("\n");

const file = `// AUTO-GENERATED — DO NOT EDIT BY HAND.
// Source: 2026 NR Life Care PDF catalogue (+ preserved fields from prior rows).
// Regenerate with: npm run catalog:import-pdf
// Day-to-day edits: Sanity CMS → npm run cms:pull
// Duplicates across PDF categories are collapsed (see scripts/lib/dedupe-products.mjs).

export type ProductRow = {
  category: string;
  name: string;
  cas?: string;
  grade?: string;
  use?: string;
  /** Filename under /public/products. */
  image?: string;
  /** Marked in the CMS as worth showing on the homepage. */
  featured?: boolean;
  /** Lower sorts first among featured products. */
  featuredOrder?: number;
};

export const productRows: ProductRow[] = [
${body}
];
`;

await writeFile(
  new URL("../src/data/products.generated.ts", import.meta.url),
  file,
  "utf8",
);

const counts = new Map();
for (const product of products) {
  counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
}

console.log(`Deduped catalogue: ${before} → ${products.length} (−${removed}).`);
for (const category of categoryMeta) {
  const n = counts.get(category.slug) ?? 0;
  if (n) console.log(`  ${category.slug.padEnd(42)} ${n}`);
}
