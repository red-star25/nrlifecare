import Link from "next/link";

import { ProductMarketingCard } from "@/components/products/product-marketing-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight } from "@/components/icons";
import { getFeaturedProducts } from "@/data/catalog";

const featured = getFeaturedProducts(6);

/**
 * The products the proprietor wants led with, driven by the `featured` flag
 * in Sanity / the catalogue. Renders nothing if none are marked and the
 * photo fallback also finds nothing, so an empty catalogue cannot leave a
 * bare heading on the homepage.
 */
export function FeaturedProducts() {
  if (!featured.length) return null;

  return (
    <section className="border-y border-sand-200 bg-white py-16 md:py-24">
      <div className="shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Moving fastest"
            title="What buyers order most"
            lede="The lines that leave our warehouse week after week. Every one is stocked, documented and quotable the same day."
          />
          <Reveal delay={0.1} className="shrink-0">
            <ButtonLink href="/products" variant="secondary" size="lg">
              See the full catalogue
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
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
