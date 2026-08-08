import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";
import { CatalogExplorer } from "@/components/products/catalog-explorer";
import { CategoryGrid } from "@/components/category-grid";
import { CtaBand } from "@/components/cta-band";
import { SectionHeading } from "@/components/ui/section-heading";
import { Document } from "@/components/icons";
import { approxProductCountLabel, categories } from "@/data/catalog";
import { catalogueDownloads } from "@/data/company";

export const metadata: Metadata = {
  title: "Product Catalogue — APIs, Excipients, Intermediates & Chemicals",
  description:
    "Search NR Life Care's catalogue of Active Pharmaceutical Ingredients, excipients, intermediates, vitamins, nutraceutical actives, food chemicals and industrial chemicals by product name, CAS number or pharmacopoeial grade.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Product catalogue"
        title="Search by name, CAS number or grade"
        lede={`A working selection of ${approxProductCountLabel} materials across ${categories.length} categories. If you cannot see a line here, ask — we source beyond what is listed online.`}
        crumbs={[{ label: "Products" }]}
      />

      <section className="shell py-14 md:py-16">
        <CatalogExplorer />
      </section>

      <section className="border-t border-sand-200 bg-white py-16 md:py-24">
        <div className="shell">
          <SectionHeading
            eyebrow="Browse by category"
            title="Prefer to explore by category?"
            lede="Each category page carries the full listing, typical applications and the packing formats we ship in."
          />
          <div className="mt-12">
            <CategoryGrid />
          </div>
        </div>
      </section>

      {/* Downloadable catalogues */}
      <section className="shell py-16 md:py-20">
        <SectionHeading
          eyebrow="Printable catalogues"
          title="Take the full list with you"
          lede="The complete product lists as PDFs — convenient for circulating internally or attaching to a purchase requisition."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {catalogueDownloads.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-5 rounded-3xl border border-sand-200 bg-white p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[0_18px_40px_-24px_rgba(11,6,32,0.4)]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                <Document className="h-5 w-5" />
              </span>
              <span className="flex-1">
                <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-[16.5px] font-bold text-ink-900 group-hover:text-brand-700">
                    {item.name}
                  </span>
                  <span className="font-mono text-[11.5px] text-sand-500">
                    PDF · {item.size}
                  </span>
                </span>
                <span className="mt-2 block text-[14px] leading-relaxed text-sand-600">
                  {item.description}
                </span>
                <span className="mt-3 inline-flex items-center gap-2 text-[13.5px] font-semibold text-brand-700">
                  Download
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </span>
              </span>
            </a>
          ))}
        </div>
      </section>

      <CtaBand
        title="Need something that is not on this list?"
        body="Our listed catalogue is a fraction of what we source. Send the product name or CAS number and we will confirm availability, price and lead time from our manufacturing partners."
      />
    </>
  );
}
