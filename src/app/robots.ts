import type { MetadataRoute } from "next";

import { IS_CANONICAL_HOST, SITE_URL } from "@/data/company";

export default function robots(): MetadataRoute.Robots {
  if (!IS_CANONICAL_HOST) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
