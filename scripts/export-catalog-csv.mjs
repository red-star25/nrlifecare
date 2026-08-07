/**
 * Dumps the current catalogue to CSV so it can be pasted into a Google Sheet.
 *
 *   npm run catalog:export
 *
 * Writes catalog-export.csv in the project root. This is a one-off seeding
 * step — after the sheet exists, the sheet is the source of truth.
 */

import { writeFile } from "node:fs/promises";
import { toCsv } from "./lib/csv.mjs";

const { categories } = await import("../src/data/catalog.ts");

const rows = categories.flatMap((category) =>
  category.products.map((product) => [
    category.slug,
    product.name,
    product.cas ?? "",
    product.grade ?? "",
    product.use ?? "",
  ]),
);

const csv = toCsv(["category", "name", "cas", "grade", "use"], rows);
await writeFile("catalog-export.csv", `${csv}\n`, "utf8");

console.log(`Wrote catalog-export.csv — ${rows.length} products.`);
console.log("\nCategory slugs to use in the sheet:");
for (const category of categories) {
  console.log(`  ${category.slug.padEnd(42)} ${category.products.length}`);
}
