import Link from "next/link";

import { ArrowUpRight, categoryIcons } from "@/components/icons";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { categories } from "@/data/catalog";

export function CategoryGrid() {
  const visible = categories.filter((category) => category.products.length > 0);

  return (
    <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {visible.map((category) => {
        const Icon =
          categoryIcons[category.slug] ??
          categoryIcons["active-pharmaceutical-ingredients"];

        return (
          <StaggerItem key={category.slug}>
            <Link
              href={`/products/${category.slug}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-sand-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_24px_50px_-26px_rgba(6,35,42,0.35)]"
            >
              <div
                className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-brand-100/60 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
              />

              <div className="relative flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white group-hover:ring-brand-600">
                  <Icon className="h-5 w-5" />
                </span>
                <ArrowUpRight className="h-5 w-5 text-sand-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600" />
              </div>

              <h3 className="relative mt-6 text-[17px] leading-snug font-bold text-ink-900">
                {category.name}
              </h3>
              <p className="relative mt-2.5 flex-1 text-[13.5px] leading-relaxed text-sand-600">
                {category.tagline}
              </p>

              <p className="relative mt-5 border-t border-sand-200 pt-4 font-mono text-[11.5px] tracking-wide text-sand-500 uppercase">
                {category.products.length} products listed
              </p>
            </Link>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
