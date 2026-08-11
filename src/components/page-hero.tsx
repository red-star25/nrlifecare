import Link from "next/link";
import type { ReactNode } from "react";

import { LightAtmosphere } from "@/components/light-atmosphere";
import { Reveal } from "@/components/ui/reveal";

type Crumb = { label: string; href?: string };

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  lede: ReactNode;
  crumbs?: Crumb[];
  children?: ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  lede,
  crumbs = [],
  children,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-x-clip bg-sand-50 pt-[108px] pb-14 md:pt-[142px] md:pb-24">
      <LightAtmosphere variant="page" />

      {/* Soft brand mark — atmosphere, not a card */}
      <div
        className="pointer-events-none absolute top-[28%] right-[4%] hidden h-[22rem] w-[22rem] lg:block"
        aria-hidden="true"
      >
        <div className="absolute inset-0 rounded-full border border-brand-200/50" />
        <div className="absolute inset-8 rounded-full border border-brand-200/35" />
        <div className="absolute inset-16 rounded-full border border-sky-200/40" />
        <div className="absolute inset-[5.5rem] rounded-full bg-gradient-to-br from-brand-100/80 via-white/40 to-sky-100/60 blur-sm" />
      </div>

      <div className="shell relative min-w-0">
        {crumbs.length ? (
          <nav aria-label="Breadcrumb" className="mb-5 md:mb-7">
            <ol className="flex flex-wrap items-center gap-2 text-[12px] text-sand-500 sm:text-[12.5px]">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-brand-700"
                >
                  Home
                </Link>
              </li>
              {crumbs.map((crumb) => (
                <li key={crumb.label} className="flex items-center gap-2">
                  <span aria-hidden="true">/</span>
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="transition-colors hover:text-brand-700"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-ink-800">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <Reveal>
          <p className="eyebrow text-brand-700">
            <span className="h-px w-6 bg-brand-500/70" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl text-[clamp(1.85rem,7vw,3.6rem)] leading-[1.06] font-extrabold text-ink-900 sm:mt-5 sm:leading-[1.03]">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-sand-600 sm:mt-6 sm:text-[17px]">
            {lede}
          </p>
        </Reveal>

        {children ? <Reveal delay={0.1}>{children}</Reveal> : null}
      </div>
    </section>
  );
}
