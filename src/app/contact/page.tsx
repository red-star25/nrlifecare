import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";
import { EnquiryForm } from "@/components/contact/enquiry-form";
import { Reveal } from "@/components/ui/reveal";
import { Clock, Globe, Mail, MapPin, Phone, WhatsApp } from "@/components/icons";
import { SITE_URL, addressOneLine, company } from "@/data/company";

export const metadata: Metadata = {
  title: "Contact & Enquiry — Request a Quotation",
  description: `Contact NR Life Care in Ahmedabad for pricing on APIs, excipients, intermediates and specialty chemicals. Call ${company.phonePrimary} or email ${company.email}. Open ${company.hours}.`,
  alternates: { canonical: "/contact" },
};

const mapQuery = encodeURIComponent(
  `${company.address.line1}, ${company.address.line2}, ${company.address.city}, ${company.address.state} ${company.address.postalCode}, India`,
);

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  url: `${SITE_URL}/contact`,
  name: `Contact ${company.name}`,
  mainEntity: { "@id": `${SITE_URL}/#organization` },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact & enquiry"
        title="Send the product. Get the price."
        lede="Share a product name or CAS number with your quantity and destination, and you will have pricing, MOQ, lead time and packing details back — usually inside one working day."
        crumbs={[{ label: "Contact" }]}
      />

      <section className="relative overflow-hidden border-y border-sand-200/80 bg-white py-14 md:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden="true"
        >
          <div className="light-wash--quiet absolute inset-0" />
        </div>
        <div className="shell relative">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          {/* Form */}
          <Reveal>
            <div className="rounded-4xl border border-sand-200 bg-white/95 p-6 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.28)] backdrop-blur-sm md:p-9">
              <h2 className="text-[22px] font-bold text-ink-900">
                Request a quotation
              </h2>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-sand-600">
                Fields marked with an asterisk are the minimum we need to quote.
                Everything else helps us get it right the first time.
              </p>

              <div className="mt-8">
                <EnquiryForm />
              </div>
            </div>
          </Reveal>

          {/* Details */}
          <div className="space-y-4">
            <Reveal delay={0.06}>
              <div className="rounded-4xl border border-sand-200 bg-white p-7 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.28)] md:p-8">
                <p className="eyebrow text-brand-700">
                  <span
                    className="h-px w-6 bg-brand-500/70"
                    aria-hidden="true"
                  />
                  Direct line
                </p>

                <ul className="mt-7 space-y-6">
                  <li>
                    <a
                      href={`tel:${company.phonePrimaryHref}`}
                      className="group flex gap-4"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                        <Phone className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-[11px] font-semibold tracking-[0.14em] text-sand-500 uppercase">
                          Call
                        </span>
                        <span className="mt-1 block text-[17px] font-bold text-ink-900 transition-colors group-hover:text-brand-700">
                          {company.phonePrimary}
                        </span>
                        <span className="mt-0.5 block text-[12.5px] text-sand-500">
                          {company.proprietor} · {company.proprietorRole}
                        </span>
                      </span>
                    </a>
                  </li>

                  <li>
                    <a
                      href={`mailto:${company.email}`}
                      className="group flex gap-4"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                        <Mail className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[11px] font-semibold tracking-[0.14em] text-sand-500 uppercase">
                          Email
                        </span>
                        <span className="mt-1 block truncate text-[16px] font-semibold text-ink-900 transition-colors group-hover:text-brand-700">
                          {company.email}
                        </span>
                      </span>
                    </a>
                  </li>

                  <li>
                    <a
                      href={company.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex gap-4"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                        <WhatsApp className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-[11px] font-semibold tracking-[0.14em] text-sand-500 uppercase">
                          WhatsApp
                        </span>
                        <span className="mt-1 block text-[16px] font-semibold text-ink-900 transition-colors group-hover:text-brand-700">
                          Message us directly
                        </span>
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="rounded-4xl border border-sand-200 bg-white p-7">
                <div className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-bold text-ink-900">
                      Office & dispatch
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-sand-600">
                      {addressOneLine}
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-[13.5px] font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-800"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>

                <div className="mt-6 flex gap-4 border-t border-sand-100 pt-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                    <Clock className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-bold text-ink-900">
                      Working hours
                    </h3>
                    <p className="mt-2 text-[14px] text-sand-600">
                      {company.hours}
                    </p>
                    <p className="mt-1 text-[13px] text-sand-500">
                      Closed Sundays and public holidays.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-4 border-t border-sand-100 pt-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                    <Globe className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-bold text-ink-900">
                      Export enquiries
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-sand-600">
                      Include your destination port and any regulatory
                      documentation you need. We handle export paperwork and
                      freight coordination in-house.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-sand-100 p-4">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-sand-500 uppercase">
                    GSTIN
                  </p>
                  <p className="mt-1.5 font-mono text-[13.5px] text-ink-900">
                    {company.gst}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
        </div>
      </section>

      {/* Map */}
      <section className="shell pb-16 md:pb-24">
        <Reveal className="overflow-hidden rounded-4xl border border-sand-200">
          <iframe
            title={`Map showing ${company.name} in Ahmedabad`}
            src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
            className="h-[380px] w-full md:h-[440px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
    </>
  );
}
