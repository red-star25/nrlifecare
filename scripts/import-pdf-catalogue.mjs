/**
 * Parses the 2026 NR Life Care PDF catalogue into products.generated.ts.
 *
 *   node --experimental-strip-types --no-warnings scripts/import-pdf-catalogue.mjs \
 *     "/path/to/catalogue.pdf"
 *
 * Merges CAS / grade / use from the previous catalogue when names match.
 */

import { readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { categoryMeta } from "../src/data/categories.ts";
import { productRows as previousRows } from "../src/data/products.generated.ts";

const pdfPath = process.argv[2];
if (!pdfPath) {
  console.error("Usage: npm run catalog:import-pdf -- /path/to/catalogue.pdf");
  process.exit(1);
}

const SECTION_TO_SLUG = new Map([
  ["Active Pharmaceutical Ingredients", "active-pharmaceutical-ingredients"],
  ["Antibiotic Powder List", "antibiotic-powders"],
  ["Human Steroid APIs", "human-steroid-apis"],
  ["Pharmaceutical Materials", "pharmaceutical-materials"],
  ["Excipients", "pharmaceutical-excipients"],
  ["API Intermediates", "pharmaceutical-intermediates"],
  ["Food Ingredients & Raw Materials", "food-and-agro-chemicals"],
  ["Nutraceutical Powders", "nutraceutical-ingredients"],
  ["Vitamins", "vitamins-and-minerals"],
  ["Chemical Powders", "chemical-powders"],
  ["Industrial Chemicals", "industrial-and-specialty-chemicals"],
  ["Organic & Inorganic Chemicals", "organic-and-inorganic-chemicals"],
]);

const SECTION_TITLES = [...SECTION_TO_SLUG.keys()];

const SKIP_LINE =
  /^(NR LIFE|YOUR GLOBAL|www\.|BUSINESS REFERENCE|Starts on|PRODUCT|CATALOGUE|ABOUT|HOW TO|QUALITY FOCUS|RELIABLE SOURCING|EXPORT SUPPORT|LONG-TERM|Complete |Common |Use this|Overlapping|Documentation|CEO|CMO|PHONE|EMAIL|WEBSITE|INSTAGRAM|REGISTERED|QUALITY PRODUCTS|FOR B2B|SUPPLIER|ACTIVE PHARMACEUTICAL|ANTIBIOTIC|HUMAN STEROID|PHARMACEUTICAL|EXCIPIENTS|API INTERMEDIATES|FOOD INGREDIENTS|NUTRACEUTICAL|VITAMINS|CHEMICAL POWDERS|INDUSTRIAL|ORGANIC|Catalogue Contents|Company Profile|PRODUCT CATEGORY|CATALOGUE NOTE|RESPONSIBLE|OFFICIAL CONTACT|PRODUCT PORTFOLIO|Custom Sourcing|Solvents & Chemical Powders|Cosmetic Ingredients|Veterinary Raw Materials|enquiries\.?$|applications\.?$|application-specific$|market-specific$|and product availability\.?$|subject to market regulation$|regulated industrial use$|industrial use$|destination-country|\d{1,2}$|[A-Z]{1,3}$)/i;

const SUBHEAD =
  /^(Pain, Fever|Antibiotic|Antifungal|Antiviral|Gastro|Diabetes|Cardiac|Cholesterol|Respiratory|Dermatology|Neurology|Hormonal|Veterinary|Glucocorticoid|Topical|Mineralocorticoid|Estrogen|Progestin|Androgen|Anabolic|Steroidal|Common API|Analgesic|Cefixime|Ceftriaxone|Clavulanate|Linezolid|Acyclovir|Oseltamivir|Favipiravir|Terbinafine|Itraconazole|Voriconazole|Lansoprazole|Domperidone|Ondansetron|Ursodeoxycholic|Metoclopramide|Sucralfate|Amlodipine|Losartan|Valsartan|Telmisartan|Olmesartan|Ramipril|Metoprolol|Atenolol|Metformin|Glimepiride|Gliclazide|Pioglitazone|Sitagliptin|Vildagliptin|Linagliptin|Dapagliflozin|Empagliflozin|Canagliflozin|CNS|Pregabalin|Levetiracetam|Carbamazepine|Oxcarbazepine|Topiramate|Sertraline|Escitalopram|Fluoxetine|Duloxetine|Bupropion|Paroxetine|Vitamin|Fat-Soluble|Vitamin B|Co-Processed|Food Gums|Food Acids|Food Processing|Inorganic Salts|Pigment|Agro-Industrial|Industrial Solvents|Paint|Ceramic|Water Treatment|Oil & Gas|Food, Cosmetic|Food, Pharma|Other Antibacterial|Fine Chemical|Research Intermediates|Speciality Intermediates|Aromatic|Ester|Nutraceutical Premix|Enzymes|Gums, Stabilizers|Vitamin Premixes|Nutraceutical Vitamin|Mineral & Vitamin|Food Grade Vitamins|BP Grade|Pharma Grade|EP Grade|IP Grade|Feed Grade|FCC Grade|USP Grade|Steroid and hormonal)/i;

function extractText(path) {
  try {
    return execFileSync(
      "python3",
      [
        "-c",
        `
from pypdf import PdfReader
r=PdfReader(${JSON.stringify(path)})
print('\\n'.join((p.extract_text() or '') for p in r.pages))
`,
      ],
      { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 },
    );
  } catch (cause) {
    console.error(
      "Could not read the PDF. Install pypdf: python3 -m pip install --user pypdf",
    );
    console.error(cause.message);
    process.exit(1);
  }
}

function normaliseName(value) {
  return value
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const previousByName = new Map();
for (const row of previousRows) {
  previousByName.set(normaliseName(row.name), row);
}

const text = extractText(pdfPath);
const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

let currentSlug = null;
const seen = new Set();
const products = [];

for (const line of lines) {
  const section = SECTION_TITLES.find((title) => title === line);
  if (section) {
    currentSlug = SECTION_TO_SLUG.get(section);
    continue;
  }

  if (!currentSlug) continue;
  if (SKIP_LINE.test(line)) continue;
  if (SUBHEAD.test(line)) continue;
  if (line.length < 3 || line.length > 90) continue;
  if (/must be verified/i.test(line)) continue;
  if (/^[|=]+$/.test(line)) continue;
  // Sentence fragments from prose that leaked into the product columns.
  if (/^[a-z]/.test(line)) continue;
  if (/\b(availability|compliance|verified|partnerships|communication)\b/i.test(line) && line.split(" ").length > 4) {
    continue;
  }

  // Drop trailing page furniture accidentally captured
  if (/nrlifecare\.(com|net)/i.test(line)) continue;

  const key = `${currentSlug}::${normaliseName(line)}`;
  if (seen.has(key)) continue;
  seen.add(key);

  const prev = previousByName.get(normaliseName(line));
  products.push({
    category: currentSlug,
    name: line.replace(/\s+/g, " ").trim(),
    cas: prev?.cas,
    grade: prev?.grade,
    use: prev?.use,
    image: prev?.image,
    featured: prev?.featured,
    featuredOrder: prev?.featuredOrder,
  });
}

if (products.length < 100) {
  console.error(`Parser only found ${products.length} products — aborting.`);
  process.exit(1);
}

const order = new Map(categoryMeta.map((category, index) => [category.slug, index]));
products.sort(
  (a, b) => (order.get(a.category) ?? 99) - (order.get(b.category) ?? 99),
);

const literal = (value) =>
  value === undefined ? "undefined" : JSON.stringify(value);

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
    if (product.featuredOrder !== undefined) {
      parts.push(`featuredOrder: ${product.featuredOrder}`);
    }
    return `  { ${parts.join(", ")} },`;
  })
  .join("\n");

const file = `// AUTO-GENERATED — DO NOT EDIT BY HAND.
// Source: 2026 NR Life Care PDF catalogue (+ preserved fields from prior rows).
// Regenerate with: npm run catalog:import-pdf
// Day-to-day edits: Sanity CMS → npm run cms:pull

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

console.log(`Wrote products.generated.ts — ${products.length} products.`);
for (const category of categoryMeta) {
  const n = counts.get(category.slug) ?? 0;
  if (n) console.log(`  ${category.slug.padEnd(42)} ${n}`);
}

const withMeta = products.filter((p) => p.cas || p.grade || p.use).length;
console.log(
  `\nPreserved CAS/grade/use from the previous catalogue on ${withMeta} matching names.`,
);
