import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { Check } from "@/components/icons";
import { industries } from "@/data/industries";

export const metadata: Metadata = {
  title: "Industries We Supply — Pharma, Food, Agro, Coatings & More",
  description:
    "N R Life Care supplies raw materials to pharmaceutical formulators, nutraceutical brands, food processors, cosmetics manufacturers, feed millers, agrochemical, paint, textile, water treatment and oil & gas customers.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries served"
        title="The same rigour, whichever line it feeds"
        lede="A pharmaceutical excipient and a paint filler can be the same molecule at different specifications. Knowing which difference matters to which customer is most of what a good supply partner does."
        crumbs={[{ label: "Industries" }]}
      />

      <section className="shell py-16 md:py-24">
        <SectionHeading
          eyebrow="Where our material goes"
          title="Twelve sectors we supply regularly"
          lede="Across seventeen broad industry groups, these are the customers we serve week in and week out — each with their own grade requirements, documentation expectations and packing needs."
        />

        <Stagger className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <StaggerItem key={industry.name}>
              <article className="group flex h-full flex-col rounded-3xl border border-sand-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_22px_50px_-30px_rgba(6,35,42,0.4)]">
                <h3 className="text-[18px] leading-snug font-bold text-ink-900">
                  {industry.name}
                </h3>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-sand-600">
                  {industry.blurb}
                </p>

                <div className="mt-6 border-t border-sand-100 pt-5">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-sand-500 uppercase">
                    We commonly supply
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {industry.supplies.map((supply) => (
                      <li
                        key={supply}
                        className="flex items-center gap-1.5 rounded-full bg-sand-100 px-2.5 py-1 text-[11.5px] font-medium text-sand-700 transition-colors group-hover:bg-brand-50 group-hover:text-brand-800"
                      >
                        <Check
                          className="h-3 w-3 text-brand-600"
                          aria-hidden="true"
                        />
                        {supply}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <CtaBand
        title="Not sure which grade your process needs?"
        body="Tell us the application rather than the specification and we will come back with the grade that suits it — along with what other customers in your sector typically run."
      />
    </>
  );
}
