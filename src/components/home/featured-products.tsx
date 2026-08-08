import Link from "next/link";

import { ProductMarketingCard } from "@/components/products/product-marketing-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight } from "@/components/icons";
import { getFeaturedProducts, hasCmsHomepageFeatured } from "@/data/catalog";

const featured = getFeaturedProducts();
const fromCms = hasCmsHomepageFeatured();

/**
 * Homepage strip: Sanity “Show on homepage” when any are flagged;
 * otherwise falls back to the star list so the section is never empty.
 */
export function FeaturedProducts() {
  if (!featured.length) return null;

  return (
    <section className="border-y border-sand-200 bg-white py-16 md:py-24">
      <div className="shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow={fromCms ? "Featured" : "Star products"}
            title="What buyers order most"
            lede={
              fromCms
                ? "Hand-picked lines from the catalogue — toggled in Studio with “Show on homepage”. Pricing and documentation on request."
                : "Priority lines from our trading desk. Mark products with “Show on homepage” in Studio (then pull) to curate this strip yourself."
            }
          />
          <Reveal delay={0.1} className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <ButtonLink
              href={fromCms ? "/contact" : "/star-products"}
              size="lg"
            >
              {fromCms ? "Request a quotation" : "View star products"}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </ButtonLink>
            <ButtonLink href="/products" variant="secondary" size="lg">
              Full catalogue
            </ButtonLink>
          </Reveal>
        </div>

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <StaggerItem key={`${product.categorySlug}-${product.slug}`}>
              <Link
                href={product.href}
                className="group block transition-transform duration-300 hover:-translate-y-1"
              >
                <ProductMarketingCard
                  name={product.name}
                  categoryLabel={product.categoryName}
                  cas={product.cas}
                  grade={product.grade}
                  variant="compact"
                />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
