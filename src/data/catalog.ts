import { categoryMeta } from "./categories";
import { productImages as importedImages } from "./product-images.generated";
import { productRows, type ProductRow } from "./products.generated";
import { starProductAdditions } from "./star-product-additions";
import {
  HOMEPAGE_STAR_COUNT,
  STAR_NAME_ALIASES,
  STAR_PRODUCT_NAMES,
  normaliseProductName,
} from "./star-products";

export type Product = {
  name: string;
  cas?: string;
  grade?: string;
  use?: string;
  /** Filename under /public/products, if a photograph exists. */
  image?: string;
  featured?: boolean;
  featuredOrder?: number;
};

export type Category = {
  slug: string;
  name: string;
  short: string;
  tagline: string;
  description: string;
  applications: string[];
  packing: string;
  products: Product[];
};

function rowKey(row: Pick<ProductRow, "category" | "name">) {
  return `${row.category}::${row.name.toLowerCase()}`;
}

/** PDF/Sanity dump plus star-list additions that are not already present. */
const mergedProductRows: ProductRow[] = (() => {
  const seen = new Set(productRows.map(rowKey));
  const extras = starProductAdditions.filter((row) => {
    const key = rowKey(row);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return [...productRows, ...extras];
})();

const productsByCategory = new Map<string, Product[]>();
for (const row of mergedProductRows) {
  const bucket = productsByCategory.get(row.category);
  const product: Product = {
    name: row.name,
    ...(row.cas ? { cas: row.cas } : {}),
    ...(row.grade ? { grade: row.grade } : {}),
    ...(row.use ? { use: row.use } : {}),
    ...(row.image ? { image: row.image } : {}),
    ...(row.featured ? { featured: true } : {}),
    ...(row.featuredOrder !== undefined
      ? { featuredOrder: row.featuredOrder }
      : {}),
  };

  if (bucket) bucket.push(product);
  else productsByCategory.set(row.category, [product]);
}

export const categories: Category[] = categoryMeta.map((category) => ({
  ...category,
  products: productsByCategory.get(category.slug) ?? [],
}));

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/%/g, " percent ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const allProducts = categories.flatMap((category) =>
  category.products.map((product) => {
    const slug = slugify(product.name);

    return {
      ...product,
      // The sheet wins, so a photograph can always be replaced without
      // touching code. Otherwise fall back to whatever the import from the
      // previous site found for this product.
      image: product.image ?? importedImages[slug],
      slug,
      href: `/products/${category.slug}/${slug}`,
      categorySlug: category.slug,
      categoryName: category.name,
      categoryShort: category.short,
    };
  }),
);

export type CatalogProduct = (typeof allProducts)[number];

/** Exact length — prefer `approxProductCountLabel` in UI copy. */
export const totalProductCount = allProducts.length;

/**
 * Rounded-down display count, e.g. 850 → "800+".
 * Keeps marketing copy from tracking every catalogue edit.
 */
export function approxCountLabel(count: number, step = 100): string {
  if (count <= 0) return "0";
  const floored = Math.floor(count / step) * step;
  if (floored < step) return `${step}+`;
  return `${floored}+`;
}

export const approxProductCountLabel = approxCountLabel(totalProductCount);

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getProduct(categorySlug: string, productSlug: string) {
  return allProducts.find(
    (product) =>
      product.categorySlug === categorySlug && product.slug === productSlug,
  );
}

/**
 * How many products share each photograph.
 *
 * The images inherited from the previous site are mostly stock, and one bowl
 * of white powder often stands in for a dozen unrelated compounds. Knowing
 * which photos are distinctive lets the homepage lead with those.
 */
const imageUsage = new Map<string, number>();
for (const product of allProducts) {
  if (product.image) {
    imageUsage.set(product.image, (imageUsage.get(product.image) ?? 0) + 1);
  }
}

/** True when this photograph belongs to exactly one product. */
export function hasDistinctPhoto(product: { image?: string }) {
  return Boolean(product.image) && imageUsage.get(product.image!) === 1;
}

function catalogueIndex() {
  const byNorm = new Map<string, CatalogProduct[]>();
  for (const product of allProducts) {
    const key = normaliseProductName(product.name);
    const bucket = byNorm.get(key);
    if (bucket) bucket.push(product);
    else byNorm.set(key, [product]);
  }
  return byNorm;
}

function pickPreferred(candidates: CatalogProduct[]) {
  return (
    candidates.find((product) => product.categorySlug === "human-steroid-apis") ??
    candidates.find(
      (product) => product.categorySlug === "active-pharmaceutical-ingredients",
    ) ??
    candidates[0]
  );
}

function matchStarName(
  starName: string,
  byNorm: Map<string, CatalogProduct[]>,
): CatalogProduct | undefined {
  let key = normaliseProductName(starName);
  key = STAR_NAME_ALIASES[key] ?? key;

  const direct = byNorm.get(key);
  if (direct?.length) return pickPreferred(direct);

  // Loose contains match for near-names (e.g. Trimethoprim → Trimethoprim Powder)
  const loose: CatalogProduct[] = [];
  for (const [norm, products] of byNorm) {
    if (norm.includes(key) || key.includes(norm)) {
      if (Math.min(norm.length, key.length) < 5) continue;
      loose.push(...products);
    }
  }
  if (!loose.length) return undefined;

  const unique = new Map<string, CatalogProduct>();
  for (const product of loose) {
    unique.set(`${product.categorySlug}:${product.slug}`, product);
  }
  return pickPreferred([...unique.values()]);
}

export type StarCatalogueEntry = {
  /** Name as written in dad’s star list. */
  listName: string;
  /** Matched catalogue product, if we have a page for it. */
  product?: CatalogProduct;
};

/**
 * Resolve the star list against the live catalogue, preserving list order.
 * Unmatched names are kept so the star page can still offer an enquiry CTA.
 */
export function getStarCatalogue(): StarCatalogueEntry[] {
  const byNorm = catalogueIndex();
  const used = new Set<string>();

  return STAR_PRODUCT_NAMES.map((listName) => {
    const product = matchStarName(listName, byNorm);
    if (!product) return { listName };

    const id = `${product.categorySlug}:${product.slug}`;
    if (used.has(id)) return { listName };
    used.add(id);
    return { listName, product };
  });
}

/**
 * Star products for the homepage hero panel (dad’s priority list).
 */
export function getStarShowcase(limit = 5): CatalogProduct[] {
  return getStarCatalogue()
    .filter(
      (entry): entry is StarCatalogueEntry & { product: CatalogProduct } =>
        Boolean(entry.product),
    )
    .map((entry) => entry.product)
    .slice(0, limit);
}

/**
 * Homepage grid — products with Sanity “Show on homepage” (`featured`).
 * Order comes from `featuredOrder` (lower first), then name.
 * Falls back to the star list until any CMS flags are present in the
 * committed catalogue (after a Studio toggle + `cms:pull`).
 */
export function getFeaturedProducts(limit = 12): CatalogProduct[] {
  const fromCms = allProducts
    .filter((product) => product.featured)
    .sort((a, b) => {
      const orderA = a.featuredOrder ?? Number.POSITIVE_INFINITY;
      const orderB = b.featuredOrder ?? Number.POSITIVE_INFINITY;
      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name);
    })
    .slice(0, limit);

  if (fromCms.length > 0) return fromCms;

  return getStarShowcase(Math.min(limit, HOMEPAGE_STAR_COUNT));
}

/** True when at least one catalogue row has Sanity’s homepage flag. */
export function hasCmsHomepageFeatured() {
  return allProducts.some((product) => product.featured);
}

/** Other products in the same category, for cross-linking. */
export function getRelatedProducts(
  categorySlug: string,
  productSlug: string,
  limit = 8,
) {
  return allProducts
    .filter(
      (product) =>
        product.categorySlug === categorySlug && product.slug !== productSlug,
    )
    .slice(0, limit);
}
