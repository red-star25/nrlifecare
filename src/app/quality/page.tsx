import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { Check, Document, Shield } from "@/components/icons";
import { CredentialsGrid } from "@/components/credentials-grid";
import { company, process, qualityCommitments } from "@/data/company";

export const metadata: Metadata = {
  title: "Quality & Compliance — CoA, MSDS and Pharmacopoeial Grades",
  description:
    "How N R Life Care assures quality: batch-specific Certificates of Analysis, MSDS with every shipment, IP/BP/USP/EP pharmacopoeial grades, supplier qualification and protective packing. Drug Licence holder, GST 24ADVPN9611L2ZU.",
  alternates: { canonical: "/quality" },
};

const standards = [
  {
    code: "IP",
    name: "Indian Pharmacopoeia",
    note: "The default reference for material supplied into the Indian domestic market.",
  },
  {
    code: "BP",
    name: "British Pharmacopoeia",
    note: "Widely specified by export customers across the UK, Africa and the Middle East.",
  },
  {
    code: "USP-NF",
    name: "United States Pharmacopeia",
    note: "Including the National Formulary monographs that cover most excipients.",
  },
  {
    code: "EP",
    name: "European Pharmacopoeia",
    note: "Requested by formulators supplying into EU and EEA regulated markets.",
  },
  {
    code: "FCC",
    name: "Food Chemicals Codex",
    note: "Applied to food-grade acidulants, preservatives, sweeteners and hydrocolloids.",
  },
  {
    code: "IH",
    name: "In-house specification",
    note: "Used where no compendial monograph exists; full specification shared upfront.",
  },
];

const documents = [
  "Batch-specific Certificate of Analysis (CoA)",
  "Material Safety Data Sheet (MSDS / SDS)",
  "Technical data sheet and specification",
  "Manufacturer details and country of origin",
  "GST invoice and packing list",
  "Export documentation for overseas consignments",
];

export default function QualityPage() {
  return (
    <>
      <PageHero
        eyebrow="Quality & compliance"
        title="A rejected batch costs more than the material ever did"
        lede="We are a trading and supply house, not a testing laboratory — so we are precise about what we do control: who we buy from, what documentation travels with the goods, and whether the grade on the invoice matches the grade in the drum."
        crumbs={[{ label: "Quality" }]}
      />

      {/* Registrations & certifications */}
      <section className="shell py-16 md:py-24">
        <SectionHeading
          eyebrow="Registrations & certifications"
          title="Licensed, certified, and happy to prove it"
          lede="Every registration below is listed with its number and the issuing authority, and the certificate itself is one click away. Verify any of them independently before you place an order."
        />

        <div className="mt-12">
          <CredentialsGrid />
        </div>

        <Reveal className="mt-8 rounded-2xl border border-sand-200 bg-sand-100/60 p-6">
          <p className="text-[13.5px] leading-relaxed text-sand-600">
            Drug licences can be verified at{" "}
            <a
              href="https://xln.gujarat.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-700 underline underline-offset-2"
            >
              xln.gujarat.gov.in
            </a>{" "}
            using the Third Party Approval Verification tool, and the ISO 22000
            certificate at{" "}
            <a
              href="https://www.mqacertification.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-700 underline underline-offset-2"
            >
              mqacertification.com
            </a>
            . {company.legalName} is a {company.constitution.toLowerCase()}{" "}
            registered in Gujarat, India.
          </p>
        </Reveal>
      </section>

      {/* Commitments */}
      <section className="border-t border-sand-200 bg-white py-16 md:py-24">
        <div className="shell">
        <SectionHeading
          eyebrow="Our commitments"
          title="Six things we guarantee on every consignment"
        />

        <Stagger className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {qualityCommitments.map((item) => (
            <StaggerItem key={item.title}>
              <article className="h-full rounded-3xl border border-sand-200 bg-white p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                  <Shield className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-[17px] leading-snug font-bold text-ink-900">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-sand-600">
                  {item.body}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
        </div>
      </section>

      {/* Standards */}
      <section className="border-y border-sand-200 bg-sand-50 py-16 md:py-24">
        <div className="shell">
          <SectionHeading
            eyebrow="Pharmacopoeial standards"
            title="The monographs we supply against"
            lede="Every quotation states the standard the material meets. Where a product carries no compendial monograph, we say so and share the in-house specification instead of implying compliance that does not exist."
          />

          <Stagger className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {standards.map((standard) => (
              <StaggerItem key={standard.code}>
                <div className="flex h-full gap-5 rounded-3xl border border-sand-200 p-6">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink-900 font-mono text-[12px] font-bold text-brand-300">
                    {standard.code}
                  </span>
                  <div>
                    <h3 className="text-[15.5px] font-bold text-ink-900">
                      {standard.name}
                    </h3>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-sand-600">
                      {standard.note}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Documentation + process */}
      <section className="shell py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
              <Document className="h-5 w-5" />
            </span>
            <h2 className="mt-6 text-[clamp(1.6rem,3vw,2.2rem)] leading-tight font-bold text-ink-900">
              What arrives with your material
            </h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-sand-600">
              Your QA team should be able to clear an inbound consignment
              without emailing us for a missing document. This is the standard
              pack that accompanies a shipment.
            </p>

            <ul className="mt-8 space-y-3">
              {documents.map((document) => (
                <li key={document} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-[15px] text-sand-700">{document}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9 rounded-3xl border border-sand-200 bg-white p-6">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-sand-500 uppercase">
                Statutory registration
              </p>
              <dl className="mt-4 space-y-3">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-[13.5px] text-sand-600">GSTIN</dt>
                  <dd className="font-mono text-[13.5px] font-medium text-ink-900">
                    {company.gst}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-[13.5px] text-sand-600">Certification</dt>
                  <dd className="text-[13.5px] font-medium text-ink-900">
                    Drug Licence
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-[13.5px] text-sand-600">Established</dt>
                  <dd className="font-mono text-[13.5px] font-medium text-ink-900">
                    {company.founded}
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] leading-tight font-bold text-ink-900">
              How an order runs
            </h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-sand-600">
              Four steps, one named contact, and validation before dispatch
              rather than after.
            </p>

            <ol className="mt-9 space-y-2">
              {process.map((step) => (
                <li
                  key={step.step}
                  className="flex gap-5 rounded-3xl border border-sand-200 bg-white p-6"
                >
                  <span className="font-display text-[26px] leading-none font-extrabold text-brand-200">
                    {step.step}
                  </span>
                  <div>
                    <h3 className="text-[16px] font-bold text-ink-900">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-sand-600">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* Honest disclaimer */}
      <section className="shell pb-16 md:pb-24">
        <Reveal className="rounded-3xl border border-sand-300 border-dashed bg-sand-100/60 p-7 md:p-9">
          <h2 className="text-[18px] font-bold text-ink-900">
            What we do not claim
          </h2>
          <p className="mt-3 max-w-3xl text-[14.5px] leading-relaxed text-sand-600">
            {company.name} is a supplier and trading house. Manufacturing
            certifications such as WHO-GMP, ISO or USFDA registration belong to
            the plants that produce the material, not to us — and we will name
            the manufacturer and share their certifications on request rather
            than present them as our own. Where a customer requires audited
            source documentation or a specific regulatory filing, tell us before
            you order so we can confirm whether the material can meet it.
          </p>
        </Reveal>
      </section>

      <CtaBand
        title="Send your specification. We will confirm what we can meet."
        body="Share the monograph, assay limits and any regulatory requirement upfront. We would rather decline an order than deliver material your QA team has to reject."
      />
    </>
  );
}
