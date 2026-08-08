import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { CtaBand } from "@/components/cta-band";
import { ProductPhoto } from "@/components/products/product-photo";
import { ProductVisual } from "@/components/products/product-visual";
import { MolecularBackdrop } from "@/components/molecular-backdrop";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import {
  ArrowRight,
  Check,
  Document,
  Phone,
  Shield,
  Truck,
  WhatsApp,
} from "@/components/icons";
import {
  allProducts,
  getCategory,
  getProduct,
  getRelatedProducts,
} from "@/data/catalog";
import { SITE_URL, company } from "@/data/company";

type PageProps = {
  params: Promise<{ category: string; product: string }>;
};

export function generateStaticParams() {
  return allProducts.map((product) => ({
    category: product.categorySlug,
    product: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: categorySlug, product: productSlug } = await params;
  const product = getProduct(categorySlug, productSlug);

  if (!product) return {};

  const casPart = product.cas ? ` (CAS ${product.cas})` : "";
  const gradePart = product.grade ? ` ${product.grade} grade.` : "";

  return {
    title: `${product.name}${casPart} Supplier & Exporter`,
    description: `Buy ${product.name}${casPart} in bulk from N R Life Care, Ahmedabad.${gradePart} ${
      product.use ? `Used as ${product.use.toLowerCase()}. ` : ""
    }Certificate of Analysis and MSDS supplied with every consignment. Request pricing and lead time.`,
    alternates: { canonical: product.href },
    openGraph: {
      title: `${product.name}${casPart} | ${company.name}`,
      description: `Bulk ${product.name} supplied from Ahmedabad with CoA and MSDS. Request a quotation.`,
      url: `${SITE_URL}${product.href}`,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { category: categorySlug, product: productSlug } = await params;

  const product = getProduct(categorySlug, productSlug);
  const category = getCategory(categorySlug);

  if (!product || !category) notFound();

  const related = getRelatedProducts(categorySlug, productSlug);

  const enquirySubject = encodeURIComponent(
    `Quotation request: ${product.name}${product.cas ? ` (CAS ${product.cas})` : ""}`,
  );
  const enquiryBody = encodeURIComponent(
    `Hello N R Life Care,\n\nPlease send a quotation for the following:\n\nProduct: ${product.name}\n${
      product.cas ? `CAS No: ${product.cas}\n` : ""
    }${product.grade ? `Grade: ${product.grade}\n` : ""}Quantity required: \nDelivery destination: \nRequired by: \n\nThank you.`,
  );
  const whatsappText = encodeURIComponent(
    `Hello N R Life Care, I would like a quotation for ${product.name}${
      product.cas ? ` (CAS ${product.cas})` : ""
    }.`,
  );

  const specs = [
    { label: "Product name", value: product.name },
    { label: "CAS number", value: product.cas ?? "On request", mono: true },
    { label: "Pharmacopoeial grade", value: product.grade ?? "On request" },
    { label: "Category", value: category.name },
    { label: "Typical application", value: product.use ?? "On request" },
    { label: "Country of origin", value: "India" },
    { label: "Minimum order quantity", value: "On request" },
    { label: "Packing", value: category.packing },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: `${product.name}${product.cas ? ` (CAS ${product.cas})` : ""} supplied in bulk by ${company.name}, Ahmedabad.${
      product.use ? ` Typical application: ${product.use}.` : ""
    }`,
    ...(product.cas ? { productID: `CAS:${product.cas}` } : {}),
    category: category.name,
    url: `${SITE_URL}${product.href}`,
    brand: { "@type": "Brand", name: company.name },
    manufacturer: { "@id": `${SITE_URL}/#organization` },
    ...(product.cas
      ? {
          additionalProperty: [
            {
              "@type": "PropertyValue",
              name: "CAS Number",
              value: product.cas,
            },
            ...(product.grade
              ? [
                  {
                    "@type": "PropertyValue",
                    name: "Grade",
                    value: product.grade,
                  },
                ]
              : []),
          ],
        }
      : {}),
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "INR",
      priceSpecification: {
        "@type": "PriceSpecification",
        valueAddedTaxIncluded: false,
      },
      seller: { "@id": `${SITE_URL}/#organization` },
      url: `${SITE_URL}${product.href}`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${SITE_URL}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: `${SITE_URL}/products/${category.slug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `${SITE_URL}${product.href}`,
      },
    ],
  };

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-ink-950 pt-[112px] pb-16 md:pt-[136px] md:pb-20">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" />
        <MolecularBackdrop className="opacity-40" />
        <div
          className="glow pointer-events-none absolute -top-24 right-1/4 h-[360px] w-[360px] opacity-20"
          aria-hidden="true"
        />

        <div className="shell relative">
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-2 text-[12.5px] text-sand-500">
              <li>
                <Link href="/" className="transition-colors hover:text-brand-300">
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                <Link
                  href="/products"
                  className="transition-colors hover:text-brand-300"
                >
                  Products
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                <Link
                  href={`/products/${category.slug}`}
                  className="transition-colors hover:text-brand-300"
                >
                  {category.short}
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                <span className="text-sand-300">{product.name}</span>
              </li>
            </ol>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
            <Reveal>
              <p className="eyebrow text-brand-300">
                <span className="h-px w-6 bg-brand-300/60" aria-hidden="true" />
                {category.short}
              </p>

              <h1 className="mt-5 text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.05] font-extrabold text-white">
                {product.name}
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                {product.cas ? (
                  <span className="rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 font-mono text-[13px] text-brand-300 backdrop-blur">
                    CAS {product.cas}
                  </span>
                ) : null}
                {product.grade ? (
                  <span className="rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 font-mono text-[13px] text-sand-300 backdrop-blur">
                    {product.grade}
                  </span>
                ) : null}
              </div>

              <p className="mt-7 max-w-xl text-[16.5px] leading-relaxed text-sand-300/85">
                {company.name} supplies {product.name} in bulk from Ahmedabad,
                Gujarat
                {product.use ? `, where it is typically used as ${product.use.toLowerCase()}` : ""}
                . Every consignment ships with a batch-specific Certificate of
                Analysis and MSDS, packed to protect the material in transit.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href={`mailto:${company.email}?subject=${enquirySubject}&body=${enquiryBody}`}
                  size="lg"
                >
                  Request a quotation
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </ButtonLink>
                <ButtonLink
                  href={`${company.whatsappHref}?text=${whatsappText}`}
                  variant="onDark"
                  size="lg"
                >
                  <WhatsApp className="h-4.5 w-4.5" />
                  Ask on WhatsApp
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              {product.image ? (
                <div className="relative">
                  <div
                    className="glow pointer-events-none absolute -inset-8 opacity-25"
                    aria-hidden="true"
                  />
                  <div className="relative overflow-hidden rounded-4xl border border-white/12 bg-white/[0.055] p-2 backdrop-blur-xl">
                    <div className="overflow-hidden rounded-3xl bg-white">
                      <ProductPhoto
                        image={product.image}
                        name={product.name}
                        priority
                        className="h-auto w-full"
                      />
                    </div>
                    <dl className="grid grid-cols-3 gap-2 px-2 py-4">
                      {[
                        { label: "CAS", value: product.cas ?? "On request" },
                        { label: "Grade", value: product.grade ?? "On request" },
                        { label: "Origin", value: "India" },
                      ].map((item) => (
                        <div key={item.label} className="text-center">
                          <dt className="text-[10.5px] tracking-[0.1em] text-sand-500 uppercase">
                            {item.label}
                          </dt>
                          <dd className="mt-1 font-mono text-[12px] break-all text-sand-300">
                            {item.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              ) : (
                <ProductVisual
                  name={product.name}
                  cas={product.cas}
                  grade={product.grade}
                />
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Specification */}
      <section className="shell py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Reveal>
            <h2 className="text-[clamp(1.5rem,3vw,2.1rem)] font-bold text-ink-900">
              Specification
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-sand-600">
              Confirm your required monograph, assay limits and particle size
              when raising an enquiry — we will match the specification or tell
              you plainly that we cannot.
            </p>

            <dl className="mt-8 overflow-hidden rounded-3xl border border-sand-200">
              {specs.map((spec, index) => (
                <div
                  key={spec.label}
                  className={`grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-4 px-5 py-4 sm:px-6 ${
                    index % 2 === 0 ? "bg-white" : "bg-sand-100/60"
                  }`}
                >
                  <dt className="text-[13.5px] font-medium text-sand-600">
                    {spec.label}
                  </dt>
                  <dd
                    className={`text-[13.5px] text-ink-900 ${spec.mono ? "font-mono" : ""}`}
                  >
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="space-y-4">
            <Reveal delay={0.06}>
              <div className="rounded-3xl border border-sand-200 bg-white p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                  <Document className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-[17px] font-bold text-ink-900">
                  Documentation supplied
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {[
                    "Batch-specific Certificate of Analysis",
                    "Material Safety Data Sheet (MSDS)",
                    "Technical data sheet & specification",
                    "Manufacturer details and country of origin",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="text-[14px] text-sand-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="rounded-3xl border border-sand-200 bg-white p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                  <Truck className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-[17px] font-bold text-ink-900">
                  Packing & dispatch
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-sand-600">
                  {category.packing}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="rounded-3xl bg-ink-950 p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
                  <Shield className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-[17px] font-bold text-white">
                  For manufacturing use
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-sand-400">
                  This material is supplied to licensed pharmaceutical,
                  nutraceutical and industrial manufacturers in bulk quantities.
                  It is not sold for direct consumer use or self-medication.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="border-y border-sand-200 bg-white py-16 md:py-20">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow text-brand-700">
                <span className="h-px w-6 bg-brand-400/70" aria-hidden="true" />
                Where it is used
              </p>
              <h2 className="mt-4 text-[clamp(1.5rem,3vw,2.1rem)] leading-tight font-bold text-ink-900">
                Where {category.short} are used
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-sand-600">
                {category.description}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <ul className="grid gap-3 sm:grid-cols-2">
                {category.applications.map((application) => (
                  <li
                    key={application}
                    className="rounded-2xl border border-sand-200 p-5"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                      <Check className="h-4 w-4" />
                    </span>
                    <p className="mt-4 text-[14.5px] font-medium text-ink-900">
                      {application}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Quick enquiry strip */}
      <section className="shell py-16 md:py-20">
        <Reveal className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-sand-200 bg-white p-7 md:flex-row md:items-center md:p-9">
          <div>
            <h2 className="text-[19px] font-bold text-ink-900">
              Need pricing for {product.name}?
            </h2>
            <p className="mt-2 text-[14.5px] text-sand-600">
              Tell us the quantity and destination — quotation usually returns
              within one working day.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <ButtonLink
              href={`mailto:${company.email}?subject=${enquirySubject}&body=${enquiryBody}`}
            >
              Request quotation
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink
              href={`tel:${company.phonePrimaryHref}`}
              variant="secondary"
            >
              <Phone className="h-4 w-4 text-brand-700" />
              {company.phonePrimary}
            </ButtonLink>
          </div>
        </Reveal>
      </section>

      {/* Related */}
      {related.length ? (
        <section className="border-t border-sand-200 bg-white py-16 md:py-20">
          <div className="shell">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="eyebrow text-brand-700">
                  <span
                    className="h-px w-6 bg-brand-400/70"
                    aria-hidden="true"
                  />
                  Related products
                </p>
                <h2 className="mt-4 text-[clamp(1.5rem,3vw,2.1rem)] font-bold text-ink-900">
                  Also in {category.short}
                </h2>
              </div>
              <Link
                href={`/products/${category.slug}`}
                className="group inline-flex items-center gap-2 text-[14.5px] font-semibold text-brand-700 hover:text-brand-800"
              >
                View all {category.products.length}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            <Stagger className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <StaggerItem key={item.slug}>
                  <Link
                    href={item.href}
                    className="group flex h-full flex-col rounded-2xl border border-sand-200 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[0_18px_40px_-24px_rgba(11,6,32,0.4)]"
                  >
                    <h3 className="text-[14.5px] leading-snug font-semibold text-ink-900 group-hover:text-brand-700">
                      {item.name}
                    </h3>
                    {item.cas ? (
                      <p className="mt-2 font-mono text-[11.5px] text-sand-500">
                        CAS {item.cas}
                      </p>
                    ) : null}
                    {item.use ? (
                      <p className="mt-2 flex-1 text-[12.5px] text-sand-600">
                        {item.use}
                      </p>
                    ) : (
                      <div className="flex-1" />
                    )}
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      ) : null}

      <CtaBand />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
