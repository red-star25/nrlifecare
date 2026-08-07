import Link from "next/link";
import type { ReactNode } from "react";

import { MolecularBackdrop } from "@/components/molecular-backdrop";
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
    <section className="relative isolate overflow-hidden bg-ink-950 pt-[118px] pb-16 md:pt-[142px] md:pb-20">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" />
      <MolecularBackdrop className="opacity-50" />
      <div
        className="glow pointer-events-none absolute -top-32 left-1/3 h-[380px] w-[380px] opacity-20"
        aria-hidden="true"
      />

      <div className="shell relative">
        {crumbs.length ? (
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-2 text-[12.5px] text-sand-500">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-brand-300"
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
                      className="transition-colors hover:text-brand-300"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-sand-300">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <Reveal>
          <p className="eyebrow text-brand-300">
            <span className="h-px w-6 bg-brand-300/60" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className="mt-5 max-w-4xl text-[clamp(2.1rem,5vw,3.6rem)] leading-[1.03] font-extrabold text-white">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-sand-300/85">
            {lede}
          </p>
        </Reveal>

        {children ? <Reveal delay={0.1}>{children}</Reveal> : null}
      </div>
    </section>
  );
}
