/**
 * Seeds / updates Sanity from the local products.generated.ts catalogue.
 *
 *   SANITY_API_TOKEN=... NEXT_PUBLIC_SANITY_PROJECT_ID=... npm run cms:push
 *
 * Creates category documents, then upserts every product by slug. Photos that
 * already live under public/products are uploaded once and attached.
 */

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createClient } from "@sanity/client";

import { categoryMeta } from "../src/data/categories.ts";
import { productRows } from "../src/data/products.generated.ts";

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/%/g, " percent ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error(
    "Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN before pushing.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

console.log(`Pushing to ${projectId}/${dataset}…`);

const categoryIds = new Map();

for (const category of categoryMeta) {
  const id = `category.${category.slug}`;
  await client.createOrReplace({
    _id: id,
    _type: "category",
    title: category.name,
    short: category.short,
    slug: { _type: "slug", current: category.slug },
  });
  categoryIds.set(category.slug, id);
  console.log(`  category  ${category.slug}`);
}

const uploaded = new Map(); // local filename -> sanity asset ref

async function uploadLocalImage(filename) {
  if (!filename) return undefined;
  if (uploaded.has(filename)) return uploaded.get(filename);

  try {
    const buffer = await readFile(
      new URL(`../public/products/${filename}`, import.meta.url),
    );
    const asset = await client.assets.upload("image", buffer, {
      filename,
      contentType: "image/webp",
    });
    const image = {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
    };
    uploaded.set(filename, image);
    return image;
  } catch {
    console.warn(`  skip image (missing): ${filename}`);
    return undefined;
  }
}

let n = 0;
for (const row of productRows) {
  const slug = slugify(row.name);
  const categoryId = categoryIds.get(row.category);
  if (!categoryId) {
    console.warn(`  skip unknown category ${row.category}: ${row.name}`);
    continue;
  }

  const image = await uploadLocalImage(row.image);
  const id = `product.${createHash("sha1").update(slug).digest("hex").slice(0, 16)}`;

  await client.createOrReplace({
    _id: id,
    _type: "product",
    name: row.name,
    slug: { _type: "slug", current: slug },
    category: { _type: "reference", _ref: categoryId },
    ...(row.cas ? { cas: row.cas } : {}),
    ...(row.grade ? { grade: row.grade } : {}),
    ...(row.use ? { use: row.use } : {}),
    ...(image ? { image } : {}),
    featured: Boolean(row.featured),
    ...(row.featuredOrder !== undefined
      ? { featuredOrder: row.featuredOrder }
      : {}),
  });

  n++;
  if (n % 100 === 0) console.log(`  products  ${n}/${productRows.length}`);
}

console.log(`Done — ${n} products upserted, ${uploaded.size} photos uploaded.`);
