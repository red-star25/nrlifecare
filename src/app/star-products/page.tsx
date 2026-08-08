import Link from "next/link";
import type { Metadata } from "next";

import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { ProductMarketingCard } from "@/components/products/product-marketing-card";
import { ButtonLink } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { ArrowRight } from "@/components/icons";
import { getStarCatalogue } from "@/data/catalog";
import { company } from "@/data/company";
import { STAR_PRODUCT_NAMES } from "@/data/star-products";

export const metadata: Metadata = {
  title: "Star Products — Priority APIs & Chemicals",
  description:
    "N R Life Care’s star product list — the APIs, steroid actives, antibiotics and specialty chemicals buyers ask for most. Request a quotation from Ahmedabad.",
  alternates: { canonical: "/star-products" },
};

export default function StarProductsPage() {
  const entries = getStarCatalogue();
  const listed = entries.filter((entry) => entry.product);
  const enquireOnly = entries.filter((entry) => !entry.product);

  const enquireSubject = encodeURIComponent(
    "Quotation request: star product list",
  );

  return (
    <>
      <PageHero
        eyebrow="Star products"
        title="What we push hardest"
        lede={`A curated list of ${STAR_PRODUCT_NAMES.length} priority materials from our trading desk — the lines buyers come back for. ${listed.length} are linked below; the rest are available on request.`}
        crumbs={[
          { label: "Products", href: "/products" },
          { label: "Star products" },
        ]}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/contact" size="lg">
            Request a quotation
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="/products" variant="onDark" size="lg">
            Search full catalogue
          </ButtonLink>
        </div>
      </PageHero>

      <section className="shell py-16 md:py-20">
        <Reveal>
          <p className="text-[13px] font-semibold tracking-[0.14em] text-brand-700 uppercase">
            On the site
          </p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.1rem)] font-bold text-ink-900">
            {listed.length} star products with catalogue pages
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-sand-600">
            Open any card for CAS number, grade and a direct quotation path.
            Packing and lead time are confirmed per enquiry.
          </p>
        </Reveal>

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listed.map(({ listName, product }) => (
            <StaggerItem key={`${product!.categorySlug}-${product!.slug}`}>
              <Link
                href={product!.href}
                className="group block transition-transform duration-300 hover:-translate-y-1"
              >
                <ProductMarketingCard
                  name={product!.name}
                  categoryLabel={product!.categoryName}
                  cas={product!.cas}
                  grade={product!.grade}
                  variant="compact"
                />
                {listName !== product!.name ? (
                  <p className="mt-2 px-1 text-[12px] text-sand-500">
                    Listed as {listName}
                  </p>
                ) : null}
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {enquireOnly.length ? (
        <section className="border-t border-sand-200 bg-white py-16 md:py-20">
          <div className="shell">
            <Reveal>
              <p className="text-[13px] font-semibold tracking-[0.14em] text-brand-700 uppercase">
                Also on the star list
              </p>
              <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.1rem)] font-bold text-ink-900">
                Available on request
              </h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-sand-600">
                These names are on our priority trading list. Ask for grade,
                packing and lead time — we will confirm sourcing the same day
                where possible.
              </p>
            </Reveal>

            <ul className="mt-10 columns-1 gap-x-10 sm:columns-2 lg:columns-3">
              {enquireOnly.map((entry) => (
                <li
                  key={entry.listName}
                  className="break-inside-avoid border-b border-sand-100 py-3 text-[14.5px] font-medium text-ink-900"
                >
                  {entry.listName}
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <ButtonLink
                href={`mailto:${company.email}?subject=${enquireSubject}`}
                size="lg"
              >
                Enquire about these products
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand />
    </>
  );
}
