import type { MetadataRoute } from "next";

import { SITE_URL } from "@/data/company";
import { allProducts, categories } from "@/data/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/products", priority: 0.95, changeFrequency: "weekly" as const },
    {
      path: "/star-products",
      priority: 0.92,
      changeFrequency: "weekly" as const,
    },
    { path: "/industries", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/quality", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.75, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.9, changeFrequency: "monthly" as const },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE_URL}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...categories.map((category) => ({
      url: `${SITE_URL}/products/${category.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...allProducts.map((product) => ({
      url: `${SITE_URL}${product.href}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
