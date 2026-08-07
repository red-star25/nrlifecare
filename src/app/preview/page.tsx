import Link from "next/link";
import type { Metadata } from "next";

import { Hero } from "@/components/home/hero";
import { IndustryMarquee } from "@/components/home/industry-marquee";
import { MoleculeShowcase } from "@/components/home/molecule-showcase";
import { StatsBand } from "@/components/home/stats-band";
import { CategoryGrid } from "@/components/category-grid";
import { CtaBand } from "@/components/cta-band";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight, Document, Globe, Shield } from "@/components/icons";
import { differentiators, process } from "@/data/company";
import { totalProductCount } from "@/data/catalog";

/** A working mockup, kept out of search results and the sitemap. */
export const metadata: Metadata = {
  title: "Preview — homepage direction",
  robots: { index: false, follow: false },
};

const assurances = [
  {
    icon: Document,
    title: "Certificate of Analysis",
    body: "Batch-specific, traceable to the manufacturing lot, shared before dispatch for your QA review.",
  },
  {
    icon: Shield,
    title: "Pharmacopoeial grades",
    body: "IP, BP, USP, EP and food-grade material stated on the quotation — never assumed or implied.",
  },
  {
    icon: Globe,
    title: "Export-ready paperwork",
    body: "Documentation, packing and freight coordination handled in-house for overseas consignments.",
  },
];

export default function PreviewPage() {
  return (
    <>
      <Hero />
      <IndustryMarquee />

      <StatsBand />

      <MoleculeShowcase />

      {/* Categories */}
      <section className="bg-white py-16 md:py-24">
        <div className="shell">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="What we supply"
              title={
                <>
                  Eight categories.
                  <br />
                  {totalProductCount} listed online.
                </>
              }
              lede="From the active molecule to the excipient that carries it, the intermediate that builds it and the chemical that cleans the vessel afterwards — catalogued with CAS numbers and pharmacopoeial grades so your procurement team can specify precisely."
            />
            <Reveal delay={0.1} className="shrink-0">
              <ButtonLink href="/products" variant="secondary" size="lg">
                Search the catalogue
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </ButtonLink>
            </Reveal>
          </div>

          <div className="mt-12">
            <CategoryGrid />
          </div>
        </div>
      </section>

      {/* Why us — now on the dark ground, so the light run is broken twice. */}
      <section className="relative overflow-hidden bg-ink-900 py-16 md:py-24">
        <div className="shell">
          <SectionHeading
            eyebrow="Why buyers stay"
            title="Trading companies are easy to find. Ones that hold their word are not."
            lede="N R Life Care was built by someone who spent thirty years watching formulators get let down by vague specifications and quotes that moved after the order was placed. We run the opposite way."
            tone="dark"
          />

          <Stagger className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {differentiators.map((item) => (
              <StaggerItem key={item.title}>
                <article className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur transition-colors duration-300 hover:border-brand-400/40 hover:bg-white/[0.07]">
                  <p className="eyebrow text-brand-300">{item.accent}</p>
                  <h3 className="mt-4 text-[18px] leading-snug font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-sand-400">
                    {item.body}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Process */}
      <section className="relative overflow-hidden border-b border-sand-200 bg-white py-16 md:py-24">
        <div
          className="grid-lines-light pointer-events-none absolute inset-0 opacity-70"
          aria-hidden="true"
        />
        <div className="shell relative">
          <SectionHeading
            eyebrow="How it works"
            title="From enquiry to delivered drum, in four steps"
            lede="No portals, no bidding rounds, no chasing. A named contact takes your requirement and stays with it until the material lands."
            align="center"
          />

          <Stagger className="mt-14 grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
            {process.map((step) => (
              <StaggerItem key={step.step}>
                <div className="relative">
                  <span className="font-display text-[52px] leading-none font-extrabold text-brand-100">
                    {step.step}
                  </span>
                  <h3 className="mt-3 text-[17px] font-bold text-ink-900">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-sand-600">
                    {step.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Quality assurances */}
      <section className="shell py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <SectionHeading
            eyebrow="Quality & documentation"
            title="A batch your QA team can actually sign off"
            lede="Rejected consignments cost more than the material ever did. Every shipment leaves here with the paperwork that lets your quality team clear it without a phone call."
          />

          <Stagger className="grid gap-3">
            {assurances.map((item) => (
              <StaggerItem key={item.title}>
                <div className="flex gap-5 rounded-3xl border border-sand-200 bg-white p-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-[16px] font-bold text-ink-900">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-sand-600">
                      {item.body}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}

            <Reveal delay={0.15}>
              <Link
                href="/quality"
                className="group mt-1 inline-flex items-center gap-2 text-[14.5px] font-semibold text-brand-700 hover:text-brand-800"
              >
                Read our quality commitments
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </Stagger>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
