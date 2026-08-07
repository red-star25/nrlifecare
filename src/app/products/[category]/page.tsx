import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ArrowRight, Check, Document, Truck, categoryIcons } from "@/components/icons";
import { categories, getCategory, slugify } from "@/data/catalog";
import { SITE_URL, company } from "@/data/company";

type PageProps = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return categories.map((item) => ({ category: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);

  if (!category) return {};

  return {
    title: `${category.name} Supplier & Exporter`,
    description: `${category.description.slice(0, 155)}…`,
    alternates: { canonical: `/products/${category.slug}` },
    openGraph: {
      title: `${category.name} | ${company.name}`,
      description: category.description.slice(0, 200),
      url: `${SITE_URL}/products/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);

  if (!category) notFound();

  const Icon =
    categoryIcons[category.slug] ??
    categoryIcons["active-pharmaceutical-ingredients"];

  const others = categories.filter((item) => item.slug !== category.slug);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description,
    url: `${SITE_URL}/products/${category.slug}`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: category.products.length,
      itemListElement: category.products.slice(0, 40).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.name,
          ...(product.cas ? { productID: `CAS:${product.cas}` } : {}),
          category: category.name,
          brand: { "@type": "Brand", name: company.name },
        },
      })),
    },
  };

  return (
    <>
      <PageHero
        eyebrow={category.tagline}
        title={category.name}
        lede={category.description}
        crumbs={[
          { label: "Products", href: "/products" },
          { label: category.short },
        ]}
      >
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[13px] font-medium text-sand-300 backdrop-blur">
            <Icon className="h-4 w-4 text-brand-400" />
            {category.products.length} products listed
          </span>
          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[13px] font-medium text-sand-300 backdrop-blur">
            <Document className="h-4 w-4 text-brand-400" />
            CoA & MSDS supplied
          </span>
        </div>
      </PageHero>

      {/* Applications + packing */}
      <section className="shell py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <Reveal>
            <h2 className="text-[22px] font-bold text-ink-900">
              Typical applications
            </h2>
            <ul className="mt-5 space-y-3">
              {category.applications.map((application) => (
                <li key={application} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-[15px] text-sand-700">
                    {application}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-3xl border border-sand-200 bg-white p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                  <Truck className="h-5 w-5" />
                </span>
                <h2 className="text-[17px] font-bold text-ink-900">
                  Packing & dispatch
                </h2>
              </div>
              <p className="mt-4 text-[14.5px] leading-relaxed text-sand-600">
                {category.packing}
              </p>
              <p className="mt-4 text-[14.5px] leading-relaxed text-sand-600">
                Alternative pack sizes can be arranged for trial quantities and
                scheduled bulk contracts. Export consignments are documented and
                palletised to suit the destination port.
              </p>
              <Link
                href="/contact"
                className="group mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-brand-700 hover:text-brand-800"
              >
                Discuss packing for your order
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Product table */}
      <section className="border-y border-sand-200 bg-white py-16 md:py-20">
        <div className="shell">
          <SectionHeading
            eyebrow="Full listing"
            title={`${category.products.length} products in ${category.short}`}
            lede="Grades shown are the standards we most commonly supply against. Confirm your required monograph and specification when raising an enquiry."
          />

          <Reveal delay={0.08} className="mt-10">
            <div className="overflow-hidden rounded-3xl border border-sand-200">
              {/* Desktop table */}
              <table className="hidden w-full border-collapse text-left md:table">
                <thead>
                  <tr className="bg-sand-100">
                    <th className="px-6 py-4 text-[11.5px] font-semibold tracking-[0.12em] text-sand-600 uppercase">
                      Product
                    </th>
                    <th className="px-6 py-4 text-[11.5px] font-semibold tracking-[0.12em] text-sand-600 uppercase">
                      CAS No.
                    </th>
                    <th className="px-6 py-4 text-[11.5px] font-semibold tracking-[0.12em] text-sand-600 uppercase">
                      Grade
                    </th>
                    <th className="px-6 py-4 text-[11.5px] font-semibold tracking-[0.12em] text-sand-600 uppercase">
                      Typical use
                    </th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody>
                  {category.products.map((product) => (
                    <tr
                      key={product.name}
                      className="group border-t border-sand-200 transition-colors hover:bg-brand-50/40"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/products/${category.slug}/${slugify(product.name)}`}
                          className="text-[14.5px] font-semibold text-ink-900 transition-colors group-hover:text-brand-700"
                        >
                          {product.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 font-mono text-[13px] text-sand-600">
                        {product.cas ?? "—"}
                      </td>
                      <td className="px-6 py-4">
                        {product.grade ? (
                          <span className="rounded-md bg-brand-50 px-2 py-1 font-mono text-[11px] font-medium text-brand-700 ring-1 ring-brand-100">
                            {product.grade}
                          </span>
                        ) : (
                          <span className="text-sand-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[13.5px] text-sand-600">
                        {product.use ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/products/${category.slug}/${slugify(product.name)}`}
                          className="text-[13px] font-semibold whitespace-nowrap text-brand-700 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                        >
                          View details →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile list */}
              <ul className="divide-y divide-sand-200 md:hidden">
                {category.products.map((product) => (
                  <li key={product.name} className="bg-white">
                    <Link
                      href={`/products/${category.slug}/${slugify(product.name)}`}
                      className="block p-5"
                    >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[15px] font-semibold text-ink-900">
                        {product.name}
                      </p>
                      {product.grade ? (
                        <span className="shrink-0 rounded-md bg-brand-50 px-2 py-1 font-mono text-[10px] font-medium text-brand-700 ring-1 ring-brand-100">
                          {product.grade}
                        </span>
                      ) : null}
                    </div>
                    {product.cas ? (
                      <p className="mt-2 font-mono text-[12px] text-sand-500">
                        CAS {product.cas}
                      </p>
                    ) : null}
                    {product.use ? (
                      <p className="mt-1.5 text-[13px] text-sand-600">
                        {product.use}
                      </p>
                    ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-8">
            <p className="text-[14px] text-sand-600">
              Looking for something outside this list?{" "}
              <Link
                href="/contact"
                className="font-semibold text-brand-700 underline underline-offset-4"
              >
                Send us the name or CAS number
              </Link>{" "}
              — our sourcing network extends well past the published catalogue.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Other categories */}
      <section className="shell py-16 md:py-20">
        <SectionHeading eyebrow="Also available" title="Other categories" />
        <Stagger className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((item) => {
            const OtherIcon =
              categoryIcons[item.slug] ??
              categoryIcons["active-pharmaceutical-ingredients"];
            return (
              <StaggerItem key={item.slug}>
                <Link
                  href={`/products/${item.slug}`}
                  className="group flex h-full items-start gap-4 rounded-2xl border border-sand-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                    <OtherIcon className="h-4.5 w-4.5" />
                  </span>
                  <span>
                    <span className="block text-[14.5px] font-semibold text-ink-900">
                      {item.short}
                    </span>
                    <span className="mt-1 block font-mono text-[11.5px] text-sand-500">
                      {item.products.length} products
                    </span>
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      <CtaBand />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
