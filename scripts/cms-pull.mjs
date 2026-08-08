/**
 * Pulls the live Sanity catalogue into src/data/products.generated.ts so the
 * static site build never depends on Sanity being reachable at request time.
 *
 *   SANITY_API_TOKEN=... NEXT_PUBLIC_SANITY_PROJECT_ID=... npm run cms:pull
 *
 * Wire a Sanity webhook (on create/update/delete of product) to a GitHub
 * Action that runs this script and commits the result.
 */

import { writeFile } from "node:fs/promises";
import { createClient } from "@sanity/client";

import { categoryMeta } from "../src/data/categories.ts";
import { dedupeProducts } from "./lib/dedupe-products.mjs";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID before pulling.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

const rows = await client.fetch(`
  *[_type == "product" && defined(slug.current) && defined(category->slug.current)] | order(name asc) {
    "category": category->slug.current,
    name,
    cas,
    grade,
    use,
    "image": image.asset->url,
    featured,
    featuredOrder
  }
`);

if (!rows.length) {
  console.error("Sanity returned zero products — refusing to overwrite.");
  process.exit(1);
}

const { products: dedupedRows, removed } = dedupeProducts(rows);
if (removed > 0) {
  console.log(`Collapsed ${removed} duplicate Sanity rows before writing.`);
}
const order = new Map(categoryMeta.map((category, index) => [category.slug, index]));
dedupedRows.sort(
  (a, b) => (order.get(a.category) ?? 99) - (order.get(b.category) ?? 99),
);

const literal = (value) =>
  value === undefined || value === null ? "undefined" : JSON.stringify(value);

const body = dedupedRows
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
// Source: Sanity CMS.
// Regenerate with: npm run cms:pull
// Edit day-to-day at /studio (or https://www.sanity.io/manage)

export type ProductRow = {
  category: string;
  name: string;
  cas?: string;
  grade?: string;
  use?: string;
  /** Local filename under /public/products, or a full Sanity CDN URL. */
  image?: string;
  featured?: boolean;
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

console.log(
  `Wrote products.generated.ts — ${dedupedRows.length} products from Sanity.`,
);
