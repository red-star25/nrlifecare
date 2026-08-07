import { categoryMeta } from "./categories";
import { productRows } from "./products.generated";

export type Product = {
  name: string;
  cas?: string;
  grade?: string;
  use?: string;
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
  category.products.map((product) => ({
    ...product,
    slug: slugify(product.name),
    href: `/products/${category.slug}/${slugify(product.name)}`,
    categorySlug: category.slug,
    categoryName: category.name,
    categoryShort: category.short,
  })),
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
