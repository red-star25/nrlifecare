/**
 * Downloads 2D structure diagrams from PubChem for every catalogue product
 * that has a CAS number, and converts them into tintable line art.
 *
 * PubChem serves black-on-white PNGs. A flat white block is unusable on the
 * site's dark sections, so each image is rewritten with its own darkness as
 * the alpha channel: the drawn bonds become opaque white, the page white
 * becomes fully transparent. The result can then be coloured with CSS.
 *
 * Structures are factual and PubChem's images are public domain, so unlike
 * stock photography there is nothing here that misrepresents what ships.
 *
 * Run with: node scripts/fetch-structures.mjs
 */

import { mkdir, writeFile, readdir } from "node:fs/promises";
import sharp from "sharp";

import { productRows } from "../src/data/products.generated.ts";

const OUT = new URL("../public/structures/", import.meta.url);
const SIZE = 500;

/** Polymers, mixtures and natural extracts have no single 2D structure. */
const NO_STRUCTURE_EXPECTED = /gum|cellulose|starch|dextr|povidone|polysorbate|macrogol|peg|extract|oil|wax|protein|isolate|concentrate|blend|premix/i;

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/%/g, " percent ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Rewrites black-on-white line art as white-on-transparent, so the diagram can
 * be tinted to any brand colour by the consuming component.
 */
async function toLineArt(buffer) {
  const image = sharp(buffer).resize(SIZE, SIZE, {
    fit: "contain",
    background: { r: 255, g: 255, b: 255 },
  });

  const { data, info } = await image
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Alpha is the inverse of luminance, so ink becomes opaque and paper vanishes.
  //
  // The page is not perfectly white once it has been resized — antialiasing
  // leaves pixels at 250-ish, which survive as a barely-visible haze and read
  // as a grey box floating behind the diagram. Anything that faint is paper,
  // so clamp it away, then lift what remains so thin bonds stay legible when
  // the diagram is scaled down.
  const FLOOR = 34;
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < data.length; i++) {
    const ink = 255 - data[i];
    const alpha = ink <= FLOOR ? 0 : Math.min(255, Math.round(ink * 1.35));
    rgba[i * 4] = 255;
    rgba[i * 4 + 1] = 255;
    rgba[i * 4 + 2] = 255;
    rgba[i * 4 + 3] = alpha;
  }

  return sharp(rgba, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();
}

async function fetchStructure(cas) {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(
    cas,
  )}/PNG?record_type=2d&image_size=${SIZE}x${SIZE}`;

  const response = await fetch(url);
  if (!response.ok) return null;

  const type = response.headers.get("content-type") ?? "";
  if (!type.includes("image")) return null;

  return Buffer.from(await response.arrayBuffer());
}

await mkdir(OUT, { recursive: true });

const existing = new Set(
  (await readdir(OUT).catch(() => [])).map((f) => f.replace(/\.png$/, "")),
);

const withCas = productRows.filter((row) => row.cas);
const results = { written: 0, skipped: 0, missing: [], expectedMissing: 0 };

console.log(`${withCas.length} products carry a CAS number.\n`);

for (const row of withCas) {
  const slug = slugify(row.name);

  if (existing.has(slug)) {
    results.skipped++;
    continue;
  }

  try {
    const raw = await fetchStructure(row.cas);

    if (!raw) {
      if (NO_STRUCTURE_EXPECTED.test(row.name)) results.expectedMissing++;
      else results.missing.push(`${row.name} (${row.cas})`);
      continue;
    }

    await writeFile(new URL(`${slug}.png`, OUT), await toLineArt(raw));
    results.written++;
    process.stdout.write(".");
  } catch (cause) {
    results.missing.push(`${row.name} (${row.cas}) — ${cause.message}`);
  }

  // PubChem asks for no more than five requests a second.
  await new Promise((resolve) => setTimeout(resolve, 220));
}

// The site needs to know which diagrams exist without touching the filesystem
// at render time, so the directory listing becomes a typed manifest.
const slugs = (await readdir(OUT))
  .filter((file) => file.endsWith(".png"))
  .map((file) => file.replace(/\.png$/, ""))
  .sort();

await writeFile(
  new URL("../src/data/structures.generated.ts", import.meta.url),
  [
    "// AUTO-GENERATED — DO NOT EDIT BY HAND.",
    "// Source: public/structures, populated by scripts/fetch-structures.mjs.",
    "// Regenerate with: npm run structures:sync",
    "",
    "/** Product slugs that have a 2D structure diagram on disk. */",
    "export const structureSlugs = new Set<string>([",
    ...slugs.map((slug) => `  ${JSON.stringify(slug)},`),
    "]);",
    "",
  ].join("\n"),
  "utf8",
);

console.log(`\n\nWrote ${results.written}, already had ${results.skipped}.`);
console.log(`Manifest lists ${slugs.length} structures.`);
console.log(
  `${results.expectedMissing} had no structure, as expected for polymers and mixtures.`,
);

if (results.missing.length) {
  console.log(`\n${results.missing.length} without a structure:`);
  for (const item of results.missing.slice(0, 40)) console.log(`  ${item}`);
  if (results.missing.length > 40) {
    console.log(`  …and ${results.missing.length - 40} more`);
  }
}
