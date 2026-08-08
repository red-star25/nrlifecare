"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { ArrowRight, Close, Search } from "@/components/icons";
import { allProducts, approxProductCountLabel, categories } from "@/data/catalog";
import { company } from "@/data/company";

const PAGE_SIZE = 48;

function normalise(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function CatalogExplorer() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const deferredQuery = useDeferredValue(query);

  const searchIndex = useMemo(
    () =>
      allProducts.map((product) => ({
        product,
        haystack: normalise(
          [product.name, product.cas, product.grade, product.use, product.categoryName]
            .filter(Boolean)
            .join(" "),
        ),
      })),
    [],
  );

  const results = useMemo(() => {
    const needle = normalise(deferredQuery);

    return searchIndex
      .filter(({ product, haystack }) => {
        const categoryMatch =
          activeCategory === "all" || product.categorySlug === activeCategory;
        if (!categoryMatch) return false;
        if (!needle) return true;
        return haystack.includes(needle);
      })
      .map(({ product }) => product);
  }, [searchIndex, deferredQuery, activeCategory]);

  const shown = results.slice(0, visible);
  const hasMore = results.length > visible;

  const resetVisible = () => setVisible(PAGE_SIZE);

  return (
    <div>
      {/* Search + filters */}
      <div className="sticky top-[72px] z-30 -mx-5 border-b border-sand-200 bg-sand-50/92 px-5 py-5 backdrop-blur-xl md:-mx-8 md:px-8">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-sand-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              resetVisible();
            }}
            placeholder={`Search ${allProducts.length} products by name, CAS number, grade or application…`}
            aria-label="Search the product catalogue"
            className="h-14 w-full rounded-2xl border border-sand-200 bg-white pr-12 pl-13 text-[15px] text-ink-900 shadow-sm transition-colors outline-none placeholder:text-sand-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                resetVisible();
              }}
              aria-label="Clear search"
              className="absolute top-1/2 right-4 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-sand-500 transition-colors hover:bg-sand-100 hover:text-ink-900"
            >
              <Close className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="mask-fade-x mt-4 -mx-1 overflow-x-auto pb-1">
          <div className="flex gap-2 px-1">
            <FilterChip
              active={activeCategory === "all"}
              onClick={() => {
                setActiveCategory("all");
                resetVisible();
              }}
              count={allProducts.length}
            >
              All products
            </FilterChip>

            {categories.map((category) => (
              <FilterChip
                key={category.slug}
                active={activeCategory === category.slug}
                onClick={() => {
                  setActiveCategory(category.slug);
                  resetVisible();
                }}
                count={category.products.length}
              >
                {category.short}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>

      {/* Result meta */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-sand-600">
          Showing{" "}
          <span className="font-mono font-semibold text-ink-900">
            {shown.length}
          </span>{" "}
          of{" "}
          <span className="font-mono font-semibold text-ink-900">
            {results.length}
          </span>{" "}
          products
          {activeCategory !== "all" ? (
            <>
              {" "}
              in{" "}
              <Link
                href={`/products/${activeCategory}`}
                className="font-semibold text-brand-700 underline underline-offset-4"
              >
                {categories.find((c) => c.slug === activeCategory)?.name}
              </Link>
            </>
          ) : null}
        </p>

        <p className="text-[13px] text-sand-500">
          Cannot find an item? We stock over 1000 — just ask.
        </p>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <EmptyState query={query} />
      ) : (
        <>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {shown.map((product) => (
                <motion.li
                  key={`${product.categorySlug}-${product.name}`}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                >
                  <ProductCard product={product} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {hasMore ? (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((count) => count + PAGE_SIZE)}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-sand-300 bg-white px-7 text-[14px] font-semibold text-ink-900 transition-colors hover:border-brand-400 hover:text-brand-700"
              >
                Load {Math.min(PAGE_SIZE, results.length - visible)} more
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function FilterChip({
  children,
  active,
  count,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[13.5px] font-medium whitespace-nowrap transition-all ${
        active
          ? "border-ink-900 bg-ink-900 text-white"
          : "border-sand-200 bg-white text-sand-700 hover:border-brand-300 hover:text-brand-700"
      }`}
    >
      {children}
      <span
        className={`font-mono text-[11px] ${active ? "text-brand-300" : "text-sand-400"}`}
      >
        {count}
      </span>
    </button>
  );
}

function ProductCard({
  product,
}: {
  product: (typeof allProducts)[number];
}) {
  return (
    <Link
      href={product.href}
      className="group flex h-full flex-col rounded-2xl border border-sand-200 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[0_18px_40px_-24px_rgba(11,6,32,0.4)]"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15px] leading-snug font-semibold text-ink-900 transition-colors group-hover:text-brand-700">
          {product.name}
        </h3>
        {product.grade ? (
          <span className="shrink-0 rounded-md bg-brand-50 px-2 py-1 font-mono text-[10px] font-medium text-brand-700 ring-1 ring-brand-100">
            {product.grade}
          </span>
        ) : null}
      </div>

      {product.cas ? (
        <p className="mt-2.5 font-mono text-[12px] text-sand-500">
          CAS {product.cas}
        </p>
      ) : null}

      {product.use ? (
        <p className="mt-2 flex-1 text-[13px] leading-relaxed text-sand-600">
          {product.use}
        </p>
      ) : (
        <div className="flex-1" />
      )}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-sand-100 pt-3.5">
        <span className="truncate text-[11.5px] font-medium text-sand-500">
          {product.categoryShort}
        </span>
        <span className="shrink-0 text-[12.5px] font-semibold text-brand-700 opacity-0 transition-opacity group-hover:opacity-100">
          View details →
        </span>
      </div>
    </Link>
  );
}

function EmptyState({ query }: { query: string }) {
  const subject = encodeURIComponent(`Product enquiry: ${query}`);

  return (
    <div className="mt-10 rounded-3xl border border-dashed border-sand-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sand-100 text-sand-500">
        <Search className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-[19px] font-bold text-ink-900">
        No catalogue match for “{query}”
      </h3>
      <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-sand-600">
        This site lists a working selection of our range — {approxProductCountLabel}{" "}
        online, with more available on request. If it is a pharmaceutical or
        industrial raw material, there is a good chance we can source it.
      </p>
      <a
        href={`mailto:${company.email}?subject=${subject}`}
        className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-brand-600 px-7 text-[14px] font-semibold text-white transition-colors hover:bg-brand-700"
      >
        Ask us about {query.trim() ? `“${query.trim()}”` : "this product"}
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}
