"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { LightAtmosphere } from "@/components/light-atmosphere";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight, Document, Phone, Shield } from "@/components/icons";
import { company } from "@/data/company";
import { approxProductCountLabel } from "@/data/catalog";

export type HeroShowcaseItem = {
  name: string;
  cas?: string;
  grade?: string;
  href: string;
};

const credentials = [
  { icon: Shield, label: "Drug Licence holder" },
  { icon: Document, label: "CoA & MSDS with every batch" },
  { icon: Phone, label: "Same-day quotations" },
];

type HeroProps = {
  showcase: HeroShowcaseItem[];
};

export function Hero({ showcase }: HeroProps) {
  const reduceMotion = useReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.75,
      delay,
      ease: [0.21, 0.47, 0.32, 0.98] as const,
    },
  });

  return (
    <section className="relative isolate overflow-x-clip bg-sand-50 pt-[108px] pb-14 md:pt-[150px] md:pb-28">
      <LightAtmosphere variant="hero" />

      <div className="shell relative">
        <div className="grid min-w-0 items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div className="min-w-0">
            <motion.div {...fadeUp(0)}>
              <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-sand-200 bg-white/80 py-1.5 pr-3 pl-1.5 shadow-sm backdrop-blur sm:gap-2.5 sm:pr-4">
                <span className="rounded-full bg-ink-900 px-2.5 py-1 text-[10px] font-bold tracking-[0.1em] whitespace-nowrap text-white uppercase sm:text-[10.5px]">
                  Est. {company.founded}
                </span>
                <span className="truncate text-[12px] font-medium text-sand-600 sm:text-[12.5px]">
                  Ahmedabad, India
                  <span className="hidden sm:inline">
                    {" "}
                    · Supplying worldwide
                  </span>
                </span>
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.08)}
              className="mt-5 text-[clamp(1.85rem,7.5vw,3.55rem)] leading-[1.08] font-extrabold text-ink-900 sm:mt-7"
            >
              Your global link to{" "}
              <span className="text-gradient">trusted pharma APIs.</span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.16)}
              className="mt-5 max-w-xl text-[15px] leading-relaxed text-sand-600 sm:mt-6 sm:text-[17px]"
            >
              {approxProductCountLabel} catalogue lines — APIs, excipients,
              vitamins and specialty chemicals — with{" "}
              {company.experienceYears} years behind every source, CoA and MSDS
              on every batch, and a named contact who quotes, follows and
              delivers.
            </motion.p>

            <motion.div
              {...fadeUp(0.24)}
              className="mt-7 flex w-full flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center"
            >
              <ButtonLink href="/contact" size="lg" className="w-full sm:w-auto">
                Request a quotation
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </ButtonLink>
              <ButtonLink
                href="/products"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Browse the catalogue
              </ButtonLink>
            </motion.div>

            <motion.ul
              {...fadeUp(0.32)}
              className="mt-8 grid gap-3 border-t border-sand-200 pt-6 sm:mt-11 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-3.5 sm:pt-7"
            >
              {credentials.map((item) => (
                <li
                  key={item.label}
                  className="flex min-w-0 items-start gap-2.5 text-[13px] font-medium text-sand-600"
                >
                  <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  <span className="leading-snug">{item.label}</span>
                </li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.85,
              delay: 0.18,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className="relative min-w-0"
          >
            <div className="relative overflow-hidden rounded-3xl border border-sand-200/90 bg-white p-1.5 shadow-[0_28px_70px_-36px_rgba(15,23,42,0.28)] sm:rounded-4xl sm:p-2">
              <div className="flex items-center justify-between gap-3 px-3 pt-3 pb-3 sm:px-4 sm:pb-4">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-500" />
                  <span className="truncate text-[11px] font-semibold tracking-[0.16em] text-sand-500 uppercase">
                    Star products
                  </span>
                </div>
                <Link
                  href="/star-products"
                  className="shrink-0 font-mono text-[11px] text-brand-700 transition-colors hover:text-brand-800"
                >
                  View all →
                </Link>
              </div>

              <div className="rounded-2xl bg-sand-50 p-1.5 ring-1 ring-sand-100 sm:rounded-3xl sm:p-2.5">
                {showcase.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.4 + index * 0.08,
                      ease: "easeOut",
                    }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-white sm:gap-4 sm:rounded-2xl sm:px-4 sm:py-3.5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-semibold text-ink-900 sm:text-[14px]">
                          {item.name}
                        </p>
                        <p className="mt-1 font-mono text-[11px] text-brand-700 sm:text-[11.5px]">
                          {item.cas ? `CAS ${item.cas}` : "CAS on request"}
                        </p>
                      </div>
                      <span className="hidden max-w-[7.5rem] shrink-0 truncate rounded-full border border-sand-200 bg-white px-2.5 py-1 font-mono text-[10.5px] text-sand-600 sm:inline">
                        {item.grade ?? "On request"}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-4 sm:py-4">
                <p className="min-w-0 text-[12px] leading-snug text-sand-500 sm:text-[12.5px]">
                  {approxProductCountLabel} lines in the full catalogue.
                </p>
                <div className="flex shrink-0 -space-x-1.5" aria-hidden="true">
                  {["IP", "BP", "USP", "EP"].map((standard) => (
                    <span
                      key={standard}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-white bg-brand-600 font-mono text-[9px] font-bold text-white shadow-sm"
                    >
                      {standard}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
