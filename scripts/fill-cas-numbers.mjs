/**
 * Fill missing CAS numbers via curated map + PubChem name lookup.
 *
 *   node --experimental-strip-types --no-warnings scripts/fill-cas-numbers.mjs
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { productRows } from "../src/data/products.generated.ts";
import { starProductAdditions } from "../src/data/star-product-additions.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

/** Curated CAS for high-priority / awkward names PubChem often misses. */
const CURATED = {
  "drostanolone propionate": "521-12-0",
  "trenbolone hexahydrobenzyl carbonate": "23454-33-3",
  "trenbolone hexahydrobenzylcarbonate": "23454-33-3",
  "trenbolone acetate": "10161-34-9",
  "trenbolone enanthate": "1629618-98-9",
  "testosterone suspension": "58-22-0",
  "testosterone": "58-22-0",
  "testosterone acetate": "1045-69-8",
  "testosterone decanoate": "5721-91-5",
  "testosterone phenylpropionate": "1255-49-8",
  "testosterone isocaproate": "15262-86-9",
  "betamethasone valerate": "2152-44-5",
  "betamethasone sodium phosphate": "151-73-5",
  "clenbuterol hydrochloride": "21898-19-1",
  "dutasteride": "164656-23-9",
  "letrozole": "112809-51-5",
  "carboplatin": "41575-94-4",
  "anastrozole": "120511-73-1",
  "pregabalin": "148553-50-8",
  "cyproheptadine hydrochloride": "969-33-5",
  "telmisartan": "144701-48-4",
  "tadalafil": "171596-29-5",
  "metformin hydrochloride": "1115-70-4",
  "artemether": "71963-77-4",
  "lumefantrine": "82166-21-0",
  "quinine sulphate": "6119-70-6",
  "quinine sulfate": "6119-70-6",
  "chloroquine phosphate": "50-63-5",
  "empagliflozin": "864070-44-0",
  "sitagliptin": "486460-32-6",
  "sucralfate": "54182-58-0",
  "itraconazole": "84625-61-6",
  "voriconazole": "137234-62-9",
  "sildenafil citrate": "171599-83-0",
  "ondansetron hydrochloride": "103639-04-9",
  "domperidone": "57808-66-9",
  "apixaban": "503612-47-3",
  "acyclovir": "59277-89-3",
  "aciclovir": "59277-89-3",
  "cefixime": "79350-37-1",
  "cefixime trihydrate": "125373-45-5",
  "ceftriaxone sodium": "74578-69-1",
  "cholecalciferol": "67-97-0",
  "caffeine anhydrous": "58-08-2",
  "natural caffeine": "58-08-2",
  "caffeine": "58-08-2",
  "benfotiamine": "22457-89-2",
  "povidone k-25": "9003-39-8",
  "povidone k25": "9003-39-8",
  "nandrolone decanoate": "360-70-3",
  "boldenone undecylenate": "13103-34-9",
  "nandrolone phenylpropionate": "62-90-8",
  "methenolone enanthate": "303-42-4",
  "testosterone cypionate": "58-20-8",
  "testosterone enanthate": "315-37-7",
  "testosterone propionate": "57-85-2",
  "stanozolol": "10418-03-8",
  "methandienone": "72-63-9",
  "methandrostenolone": "72-63-9",
  "oxandrolone": "53-39-4",
  "methyltestosterone": "58-18-4",
  "clobetasol propionate": "25122-46-7",
  "progesterone": "57-83-0",
  "methylprednisolone": "83-43-2",
  "dydrogesterone": "152-62-5",
  "oxymetholone": "434-07-1",
  "aspirin": "50-78-2",
  "acetylsalicylic acid": "50-78-2",
  "azithromycin": "83905-01-5",
  "benzoyl peroxide": "94-36-0",
  "amoxicillin trihydrate": "61336-70-7",
  "amoxicillin sodium": "34642-77-8",
  "ambroxol hydrochloride": "23828-92-4",
  "biotin": "58-85-5",
  "bisoprolol fumarate": "104344-23-2",
  "bromhexine hydrochloride": "611-75-6",
  "budesonide": "51333-22-3",
  "betamethasone dipropionate": "5593-20-4",
  "erythromycin stearate": "643-22-1",
  "ethyl cellulose": "9004-57-3",
  "trimethoprim": "738-70-5",
  "ciprofloxacin": "85721-33-1",
  "levofloxacin": "100986-85-4",
  "albendazole": "54965-21-8",
};

const SKIP_NAME =
  /\b(derivatives|mixture|blend|complex|extract|concentrate|isolate|premix|combination|\+|\/|and\s)\b/i;

const CAS_RE = /^\d{2,7}-\d{2}-\d$/;

function normKey(name) {
  return name
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function lookupAliases(name) {
  const key = normKey(name);
  const aliases = [key];
  aliases.push(key.replace(/\bsulphate\b/g, "sulfate"));
  aliases.push(key.replace(/\bsulphite\b/g, "sulfite"));
  aliases.push(key.replace(/\bhydrochloride\b/g, "hcl"));
  aliases.push(key.replace(/\bhcl\b/g, "hydrochloride"));
  aliases.push(key.replace(/\banhydrous\b/g, "").replace(/\s+/g, " ").trim());
  // Drop pharmacopoeial suffixes stuck on names
  aliases.push(
    key
      .replace(/\b(ip|bp|usp|ep|fcc|nf)\b/g, "")
      .replace(/\s+/g, " ")
      .trim(),
  );
  return [...new Set(aliases.filter(Boolean))];
}

function curatedCas(name) {
  for (const alias of lookupAliases(name)) {
    if (CURATED[alias]) return CURATED[alias];
  }
  return undefined;
}

function shouldSkip(name) {
  if (SKIP_NAME.test(name)) return true;
  if (/^(amino acid|vitamin|mineral|enzyme|flavour|color|colour)\b/i.test(name))
    return true;
  if (/\bwhey protein\b/i.test(name)) return true;
  return false;
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function pubchemCas(name) {
  const attempts = lookupAliases(name).slice(0, 3);
  for (const attempt of attempts) {
    const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(attempt)}/synonyms/JSON`;
    try {
      const res = await fetch(url);
      if (res.status === 404) continue;
      if (!res.ok) {
        if (res.status === 503 || res.status === 429) {
          await sleep(1500);
          const retry = await fetch(url);
          if (!retry.ok) continue;
          const data = await retry.json();
          const syns = data?.InformationList?.Information?.[0]?.Synonym ?? [];
          const cas = syns.find((s) => CAS_RE.test(String(s)));
          if (cas) return String(cas);
          continue;
        }
        continue;
      }
      const data = await res.json();
      const syns = data?.InformationList?.Information?.[0]?.Synonym ?? [];
      const cas = syns.find((s) => CAS_RE.test(String(s)));
      if (cas) return String(cas);
    } catch {
      await sleep(500);
    }
  }
  return undefined;
}

function serializeRows(rows, headerComment) {
  const literal = (value) => JSON.stringify(value);
  const body = rows
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

  return `${headerComment}

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
}

function serializeAdditions(rows) {
  const literal = (value) => JSON.stringify(value);
  const body = rows
    .map((product) => {
      const parts = [
        `category: ${literal(product.category)}`,
        `name: ${literal(product.name)}`,
      ];
      if (product.cas) parts.push(`cas: ${literal(product.cas)}`);
      if (product.grade) parts.push(`grade: ${literal(product.grade)}`);
      if (product.use) parts.push(`use: ${literal(product.use)}`);
      if (product.image) parts.push(`image: ${literal(product.image)}`);
      return `  { ${parts.join(", ")} },`;
    })
    .join("\n");

  return `/**
 * Star-list products that are not yet in the PDF/Sanity catalogue dump.
 * Merged in catalog.ts so a cms:pull of products.generated.ts cannot drop them.
 */
import type { ProductRow } from "./products.generated";

export const starProductAdditions: ProductRow[] = [
${body}
];
`;
}

const cache = new Map();

async function resolveCas(name) {
  const key = normKey(name);
  if (cache.has(key)) return cache.get(key);

  const fromCurated = curatedCas(name);
  if (fromCurated) {
    cache.set(key, fromCurated);
    return fromCurated;
  }
  if (shouldSkip(name)) {
    cache.set(key, undefined);
    return undefined;
  }

  const fromPubchem = await pubchemCas(name);
  cache.set(key, fromPubchem);
  await sleep(220); // ~4–5 req/s politeness
  return fromPubchem;
}

const missingNames = [
  ...new Set(
    [...productRows, ...starProductAdditions]
      .filter((p) => !p.cas)
      .map((p) => p.name),
  ),
];

console.log(`Resolving CAS for ${missingNames.length} unique names…`);

let filled = 0;
let skipped = 0;
let failed = 0;
const failures = [];

for (let i = 0; i < missingNames.length; i++) {
  const name = missingNames[i];
  if ((i + 1) % 25 === 0 || i === 0) {
    console.log(`  [${i + 1}/${missingNames.length}] ${name}`);
  }
  const cas = await resolveCas(name);
  if (cas) filled += 1;
  else if (shouldSkip(name)) skipped += 1;
  else {
    failed += 1;
    failures.push(name);
  }
}

const apply = (rows) =>
  rows.map((row) => {
    if (row.cas) return row;
    const cas = cache.get(normKey(row.name));
    return cas ? { ...row, cas } : row;
  });

const nextProducts = apply(productRows);
const nextAdditions = apply(starProductAdditions);

const productsPath = path.join(root, "src/data/products.generated.ts");
const additionsPath = path.join(root, "src/data/star-product-additions.ts");

await writeFile(
  productsPath,
  serializeRows(
    nextProducts,
    `// AUTO-GENERATED — DO NOT EDIT BY HAND.
// Source: 2026 NR Life Care PDF catalogue (+ preserved fields from prior rows).
// CAS numbers enriched via curated map + PubChem (scripts/fill-cas-numbers.mjs).
// Regenerate catalogue with: npm run catalog:import-pdf
// Day-to-day edits: Sanity CMS → npm run cms:pull
// Duplicates across PDF categories are collapsed (see scripts/lib/dedupe-products.mjs).`,
  ),
);

await writeFile(additionsPath, serializeAdditions(nextAdditions));

const stillMissingProducts = nextProducts.filter((p) => !p.cas).length;
const stillMissingAdditions = nextAdditions.filter((p) => !p.cas).length;

console.log("\nDone.");
console.log({
  uniqueResolved: filled,
  skippedMixtures: skipped,
  unresolved: failed,
  productsMissingAfter: stillMissingProducts,
  additionsMissingAfter: stillMissingAdditions,
});
if (failures.length) {
  console.log("\nUnresolved (sample):");
  for (const name of failures.slice(0, 40)) console.log(" -", name);
  if (failures.length > 40) console.log(` … +${failures.length - 40} more`);
}
