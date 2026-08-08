import { categoryMeta } from "./categories";
import { productImages as importedImages } from "./product-images.generated";
import { productRows } from "./products.generated";

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

const productsByCategory = new Map<string, Product[]>();
for (const row of productRows) {
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

export const totalProductCount = allProducts.length;

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

/**
 * Products marked “Show on homepage” in Sanity, in the order set there.
 *
 * Only explicitly featured products are shown — we do not pad the grid with
 * other catalogue rows. If none are marked, fall back to a small spread of
 * products that have a distinct photograph so the homepage is not empty.
 */
export function getFeaturedProducts(limit = 6) {
  const marked = allProducts
    .filter((product) => product.featured)
    .sort(
      (a, b) =>
        (a.featuredOrder ?? Number.MAX_SAFE_INTEGER) -
        (b.featuredOrder ?? Number.MAX_SAFE_INTEGER),
    );

  if (marked.length > 0) return marked.slice(0, limit);

  const candidates = allProducts.filter((product) => hasDistinctPhoto(product));
  const byCategory = new Map<string, typeof candidates>();
  for (const product of candidates) {
    const bucket = byCategory.get(product.categorySlug);
    if (bucket) bucket.push(product);
    else byCategory.set(product.categorySlug, [product]);
  }

  const spread: typeof candidates = [];
  let exhausted = false;
  while (!exhausted && spread.length < limit) {
    exhausted = true;
    for (const bucket of byCategory.values()) {
      const next = bucket.shift();
      if (!next) continue;
      exhausted = false;
      spread.push(next);
      if (spread.length >= limit) break;
    }
  }

  return spread;
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
