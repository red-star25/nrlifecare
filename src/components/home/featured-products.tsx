import Link from "next/link";

import { ProductPhoto } from "@/components/products/product-photo";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight } from "@/components/icons";
import { getFeaturedProducts } from "@/data/catalog";

/**
 * The proprietor may well mark two products that happen to share a stock
 * photograph. His choice of products stands, but the same picture appearing
 * twice in one grid looks like a mistake, so later repeats fall back to the
 * lettered tile.
 */
const featured = (() => {
  const usedImages = new Set<string>();

  return getFeaturedProducts(6).map((product) => {
    if (!product.image || usedImages.has(product.image)) {
      return { ...product, image: undefined };
    }

    usedImages.add(product.image);
    return product;
  });
})();

/**
 * The products the proprietor wants led with, driven by the `featured` column
 * in the catalogue sheet. Renders nothing if the sheet has none marked and no
 * product has a photograph, so an empty catalogue cannot leave a bare heading
 * on the homepage.
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
            <StaggerItem key={product.slug}>
              <Link
                href={product.href}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-sand-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_22px_50px_-28px_rgba(11,6,32,0.45)]"
              >
                {product.image ? (
                  <div className="aspect-4/3 overflow-hidden bg-sand-100">
                    <ProductPhoto
                      image={product.image}
                      name={product.name}
                      sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-4/3 items-center justify-center bg-brand-50">
                    <span className="font-display text-[34px] font-extrabold text-brand-200">
                      {product.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[11px] font-semibold tracking-[0.1em] text-brand-600 uppercase">
                    {product.categoryShort}
                  </p>
                  <h3 className="mt-2.5 text-[17px] leading-snug font-bold text-ink-900 group-hover:text-brand-700">
                    {product.name}
                  </h3>
                  {product.use ? (
                    <p className="mt-2 text-[13.5px] leading-relaxed text-sand-600">
                      {product.use}
                    </p>
                  ) : null}

                  <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-sand-100 pt-4">
                    {product.cas ? (
                      <span className="font-mono text-[11.5px] whitespace-nowrap text-sand-500">
                        CAS {product.cas}
                      </span>
                    ) : null}
                    {product.grade ? (
                      <span className="rounded-full bg-sand-100 px-2.5 py-1 font-mono text-[10.5px] whitespace-nowrap text-sand-600">
                        {product.grade}
                      </span>
                    ) : null}
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
