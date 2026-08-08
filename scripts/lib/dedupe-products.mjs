/**
 * Collapse catalogue rows that are the same material listed under many
 * PDF categories (e.g. Guar Gum × 4). Keeps one row per product, preferring
 * the most specific category and merging CAS / grade / use / image.
 */

import { categoryMeta } from "../../src/data/categories.ts";

const CATEGORY_RANK = new Map(
  categoryMeta.map((category, index) => [category.slug, index]),
);

export function normaliseName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Strip filler words so “Guar Gum” and “Guar Gum Powder” group together. */
export function nameCore(name) {
  return normaliseName(name)
    .replace(
      /\b(powder|anhydrous|hydrate|monohydrate|dihydrate|trihydrate|base|pure|fcc|usp|bp|ip|ep)\b/g,
      " ",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function richness(row) {
  return (
    (row.cas ? 4 : 0) +
    (row.grade ? 2 : 0) +
    (row.use ? 2 : 0) +
    (row.image ? 3 : 0) +
    (row.featured ? 1 : 0)
  );
}

function prefer(a, b) {
  const rankA = CATEGORY_RANK.get(a.category) ?? 99;
  const rankB = CATEGORY_RANK.get(b.category) ?? 99;
  if (rankA !== rankB) return rankA < rankB ? a : b;

  const richA = richness(a);
  const richB = richness(b);
  if (richA !== richB) return richA > richB ? a : b;

  // Prefer the shorter, cleaner trade name (“Guar Gum” over “Guar Gum Powder”)
  // when both are otherwise equal.
  if (a.name.length !== b.name.length) {
    return a.name.length < b.name.length ? a : b;
  }
  return a;
}

function mergeFields(keeper, other) {
  return {
    ...keeper,
    cas: keeper.cas || other.cas,
    grade: keeper.grade || other.grade,
    use: keeper.use || other.use,
    image: keeper.image || other.image,
    featured: Boolean(keeper.featured || other.featured),
    featuredOrder:
      keeper.featuredOrder ?? other.featuredOrder ?? undefined,
  };
}

/**
 * @param {Array<Record<string, unknown>>} rows
 * @returns {{ products: Array<Record<string, unknown>>, removed: number }}
 */
export function dedupeProducts(rows) {
  // Pass 1 — exact name (case-insensitive), across all categories.
  const byExact = new Map();
  for (const row of rows) {
    const key = normaliseName(row.name);
    const existing = byExact.get(key);
    if (!existing) {
      byExact.set(key, { ...row });
      continue;
    }
    const winner = prefer(existing, row);
    const loser = winner === existing ? row : existing;
    byExact.set(key, mergeFields(winner, loser));
  }

  let products = [...byExact.values()];

  // Pass 2 — same CAS + same name core (Guar Gum / Guar Gum Powder).
  const byCasCore = new Map();
  const withoutCas = [];
  for (const row of products) {
    if (!row.cas) {
      withoutCas.push(row);
      continue;
    }
    const key = `${row.cas}::${nameCore(row.name)}`;
    const existing = byCasCore.get(key);
    if (!existing) {
      byCasCore.set(key, { ...row });
      continue;
    }
    const winner = prefer(existing, row);
    const loser = winner === existing ? row : existing;
    byCasCore.set(key, mergeFields(winner, loser));
  }

  products = [...byCasCore.values(), ...withoutCas];
  products.sort((a, b) => {
    const rank =
      (CATEGORY_RANK.get(a.category) ?? 99) -
      (CATEGORY_RANK.get(b.category) ?? 99);
    if (rank !== 0) return rank;
    return String(a.name).localeCompare(String(b.name));
  });

  return { products, removed: rows.length - products.length };
}
