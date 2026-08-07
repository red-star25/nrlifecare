import type { Metadata } from "next";
import Image from "next/image";

import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { Check, MapPin, Phone } from "@/components/icons";
import {
  addressOneLine,
  company,
  proprietorMessage,
  stats,
  timeline,
  values,
} from "@/data/company";

export const metadata: Metadata = {
  title: "About Us — Pharmaceutical Ingredient Suppliers Since 2014",
  description:
    "N R Life Care was founded in Ahmedabad in 2014 by Jitendra Nakum, backed by over 30 years in India's bulk drug trade. Learn how we source APIs, excipients and specialty chemicals for manufacturers worldwide.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About N R Life Care"
        title="Thirty years of relationships, distilled into one supply desk"
        lede="We are a proprietorship in Ahmedabad that buys pharmaceutical and industrial raw materials well, and sells them honestly. That is the entire business model, and it has kept customers for a decade."
        crumbs={[{ label: "About" }]}
      />

      {/* Story */}
      <section className="shell py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Our story"
              title="Built by someone who knew the manufacturers personally"
            />

            <Reveal delay={0.06} className="mt-7 space-y-5">
              <p className="text-[16px] leading-relaxed text-sand-700">
                Before {company.name} existed, {company.proprietor} spent more
                than {company.experienceYears} years inside India&apos;s bulk
                drug trade — learning which plants ran consistent batches, which
                ones cut corners when the market tightened, and which would pick
                up the phone at eleven at night when a customer&apos;s line had
                stopped.
              </p>
              <p className="text-[16px] leading-relaxed text-sand-700">
                In {company.founded} he put those relationships to work under his
                own name. The firm was established in Ahmedabad, in the heart of
                Gujarat&apos;s chemical manufacturing belt, supplying Active
                Pharmaceutical Ingredients to formulators who were tired of
                brokers that disappeared once the invoice was raised.
              </p>
              <p className="text-[16px] leading-relaxed text-sand-700">
                What began with APIs widened into excipients, then vitamins,
                nutraceutical actives, food-grade ingredients and industrial
                chemicals — largely because customers kept asking. A formulator
                who trusts you with the active molecule would rather buy the
                magnesium stearate from you too. Today the catalogue runs past a
                thousand line items across seventeen industries, and the firm
                exports to buyers well beyond India.
              </p>
              <p className="text-[16px] leading-relaxed text-sand-700">
                It is still a small team. That is deliberate. It means the person
                who quotes your order is the person who chases it, and the
                owner&apos;s name is on the outcome.
              </p>
            </Reveal>
          </div>

          {/* Owner card */}
          <Reveal delay={0.12}>
            <div className="sticky top-28 overflow-hidden rounded-4xl border border-sand-200 bg-white">
              <div className="relative overflow-hidden bg-ink-950 px-7 py-10">
                <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" />
                <div
                  className="glow pointer-events-none absolute -top-16 -right-10 h-56 w-56 opacity-25"
                  aria-hidden="true"
                />
                <div className="relative">
                  <div className="overflow-hidden rounded-3xl ring-1 ring-white/12">
                    <Image
                      src="/jitendra-nakum.png"
                      alt={`${company.proprietor}, ${company.proprietorRole} of ${company.name}`}
                      width={296}
                      height={389}
                      className="h-auto w-full"
                      sizes="(min-width: 1024px) 320px, 100vw"
                    />
                  </div>
                  <p className="mt-6 font-display text-[21px] font-bold text-white">
                    {company.proprietor}
                  </p>
                  <p className="mt-1 text-[13.5px] text-brand-300">
                    {company.proprietorRole}
                  </p>
                  <p className="mt-5 text-[14px] leading-relaxed text-sand-400">
                    &ldquo;{proprietorMessage[1]}&rdquo;
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-7">
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  <p className="text-[13.5px] leading-relaxed text-sand-600">
                    {addressOneLine}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  <a
                    href={`tel:${company.phonePrimaryHref}`}
                    className="text-[14px] font-semibold text-ink-900 hover:text-brand-700"
                  >
                    {company.phonePrimary}
                  </a>
                </div>
                <div className="rounded-2xl bg-sand-100 p-4">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-sand-500 uppercase">
                    Nature of business
                  </p>
                  <p className="mt-2 text-[13.5px] text-sand-700">
                    {company.businessType.join(" · ")}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-sand-200 bg-white py-14 md:py-16">
        <div className="shell">
          <Stagger className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div>
                  <p className="font-display text-[clamp(2rem,3.5vw,2.6rem)] leading-none font-extrabold text-brand-600">
                    {stat.value}
                  </p>
                  <p className="mt-3 text-[14.5px] font-semibold text-ink-900">
                    {stat.label}
                  </p>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-sand-600">
                    {stat.detail}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Timeline */}
      <section className="shell py-16 md:py-24">
        <SectionHeading
          eyebrow="How we got here"
          title="A decade of widening the shelf"
          lede="Each expansion came from a customer asking for one more thing we did not yet stock."
        />

        <div className="relative mt-14">
          <div
            className="absolute top-2 bottom-2 left-[7px] w-px bg-sand-200 md:left-1/2"
            aria-hidden="true"
          />

          <Stagger className="space-y-10">
            {timeline.map((entry, index) => (
              <StaggerItem key={entry.year}>
                <div
                  className={`relative pl-9 md:grid md:grid-cols-2 md:gap-14 md:pl-0 ${
                    index % 2 === 0 ? "" : "md:[&>*:first-child]:col-start-2"
                  }`}
                >
                  <span
                    className="absolute top-1.5 left-0 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 ring-4 ring-sand-50 md:left-1/2 md:-translate-x-1/2"
                    aria-hidden="true"
                  />
                  <div
                    className={
                      index % 2 === 0
                        ? "md:pr-4 md:text-right"
                        : "md:col-start-2 md:pl-4"
                    }
                  >
                    <p className="font-mono text-[12.5px] font-medium text-brand-600">
                      {entry.year}
                    </p>
                    <h3 className="mt-2 text-[19px] font-bold text-ink-900">
                      {entry.title}
                    </h3>
                    <p className="mt-2.5 text-[14.5px] leading-relaxed text-sand-600">
                      {entry.body}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-sand-200 bg-white py-16 md:py-24">
        <div className="shell">
          <SectionHeading
            eyebrow="How we work"
            title="Three rules we do not bend"
            align="center"
          />

          <Stagger className="mt-12 grid gap-4 md:grid-cols-3">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <article className="h-full rounded-3xl border border-sand-200 p-7">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                    <Check className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-[18px] font-bold text-ink-900">
                    {value.title}
                  </h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-sand-600">
                    {value.body}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
