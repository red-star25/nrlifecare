/**
 * Dumps the current catalogue to CSV so it can be pasted into a Google Sheet.
 *
 *   npm run catalog:export
 *
 * Writes catalog-export.csv in the project root. This is a one-off seeding
 * step — after the sheet exists, the sheet is the source of truth.
 *
 * Reads categories.ts and products.generated.ts directly rather than going
 * through catalog.ts: those are leaf modules, whereas catalog.ts uses
 * extensionless imports that Node's ESM loader cannot resolve.
 */

import { writeFile } from "node:fs/promises";
import { categoryMeta } from "../src/data/categories.ts";
import { productRows } from "../src/data/products.generated.ts";
import { toCsv } from "./lib/csv.mjs";

const order = new Map(categoryMeta.map((category, i) => [category.slug, i]));

const rows = [...productRows]
  .sort((a, b) => (order.get(a.category) ?? 0) - (order.get(b.category) ?? 0))
  .map((product) => [
    product.category,
    product.name,
    product.cas ?? "",
    product.grade ?? "",
    product.use ?? "",
  ]);

const csv = toCsv(["category", "name", "cas", "grade", "use"], rows);
await writeFile("catalog-export.csv", `${csv}\n`, "utf8");

console.log(`Wrote catalog-export.csv — ${rows.length} products.`);
console.log("\nCategory slugs to use in the sheet:");

const counts = new Map();
for (const product of productRows) {
  counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
}
for (const category of categoryMeta) {
  console.log(`  ${category.slug.padEnd(42)} ${counts.get(category.slug) ?? 0}`);
}
