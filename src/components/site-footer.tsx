import Link from "next/link";

import { Logo } from "@/components/logo";
import { Clock, Mail, MapPin, Phone, WhatsApp } from "@/components/icons";
import { categories } from "@/data/catalog";
import { addressOneLine, company } from "@/data/company";

const siteLinks = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  { label: "Product catalogue", href: "/products" },
  { label: "Star products", href: "/star-products" },
  { label: "Industries served", href: "/industries" },
  { label: "Quality & compliance", href: "/quality" },
  { label: "Contact & enquiry", href: "/contact" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink-950 text-sand-300">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.45]" />
      <div className="glow pointer-events-none absolute -top-32 left-1/4 h-72 w-72 opacity-20" />

      <div className="shell relative py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr_1fr_1.15fr]">
          <div>
            <Logo variant="light" height={52} />

            <p className="mt-6 font-display text-[15px] font-semibold text-brand-300 italic">
              &ldquo;{company.officialTagline}&rdquo;
            </p>

            <p className="mt-4 max-w-sm text-[14.5px] leading-relaxed text-sand-400">
              Manufacturer, importer, exporter and wholesale supplier of Active
              Pharmaceutical Ingredients, excipients, intermediates,
              nutraceuticals and specialty chemicals — from Ahmedabad, Gujarat,
              since {company.founded}.
            </p>

            <dl className="mt-7 space-y-3 text-[13.5px]">
              <div className="flex gap-3">
                <dt className="mt-0.5 shrink-0 text-brand-400">
                  <MapPin className="h-4 w-4" />
                  <span className="sr-only">Address</span>
                </dt>
                <dd className="text-sand-400">{addressOneLine}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="mt-0.5 shrink-0 text-brand-400">
                  <Clock className="h-4 w-4" />
                  <span className="sr-only">Working hours</span>
                </dt>
                <dd className="text-sand-400">{company.hours}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="font-display text-[13px] font-semibold tracking-[0.14em] text-white uppercase">
              Catalogue
            </h3>
            <ul className="mt-5 space-y-2.5">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/products/${category.slug}`}
                    className="text-[13.5px] text-sand-400 transition-colors hover:text-brand-300"
                  >
                    {category.short}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-[13px] font-semibold tracking-[0.14em] text-white uppercase">
              Company
            </h3>
            <ul className="mt-5 space-y-2.5">
              {siteLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13.5px] text-sand-400 transition-colors hover:text-brand-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-[13px] font-semibold tracking-[0.14em] text-white uppercase">
              Talk to us
            </h3>
            <ul className="mt-5 space-y-4">
              <li>
                <a
                  href={`tel:${company.phonePrimaryHref}`}
                  className="group flex items-start gap-3"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                  <span>
                    <span className="block text-[15px] font-semibold text-white transition-colors group-hover:text-brand-300">
                      {company.phonePrimary}
                    </span>
                    <span className="text-[12.5px] text-sand-500">
                      {company.proprietor}, {company.proprietorRole}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="group flex items-start gap-3"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                  <span className="text-[14px] text-sand-300 transition-colors group-hover:text-brand-300">
                    {company.email}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={company.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3"
                >
                  <WhatsApp className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                  <span className="text-[14px] text-sand-300 transition-colors group-hover:text-brand-300">
                    Message on WhatsApp
                  </span>
                </a>
              </li>
            </ul>

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-sand-500 uppercase">
                GST Identification
              </p>
              <p className="mt-1.5 font-mono text-[13px] text-brand-300">
                {company.gst}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 text-[12.5px] text-sand-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <p className="max-w-2xl md:text-right">
            Products are supplied for pharmaceutical, nutraceutical and
            industrial manufacturing use. Bulk materials are not intended for
            direct consumer sale or self-medication.
          </p>
        </div>
      </div>
    </footer>
  );
}
