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
    initial: reduceMotion ? false : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.8,
      delay,
      ease: [0.21, 0.47, 0.32, 0.98] as const,
    },
  });

  return (
    <section className="relative isolate overflow-hidden bg-sand-50 pt-[124px] pb-20 md:pt-[150px] md:pb-28">
      <LightAtmosphere variant="hero" />

      <div className="shell relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div>
            <motion.div {...fadeUp(0)}>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-sand-200 bg-white/80 py-1.5 pr-4 pl-1.5 shadow-sm backdrop-blur">
                <span className="rounded-full bg-ink-900 px-2.5 py-1 text-[10.5px] font-bold tracking-[0.1em] whitespace-nowrap text-white uppercase">
                  Est. {company.founded}
                </span>
                <span className="text-[12.5px] font-medium whitespace-nowrap text-sand-600">
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
              className="mt-7 max-w-xl text-[clamp(2.15rem,5.2vw,3.55rem)] leading-[1.06] font-extrabold text-ink-900"
            >
              Your global link to{" "}
              <span className="text-gradient">trusted pharma APIs.</span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.16)}
              className="mt-6 max-w-xl text-[17px] leading-relaxed text-sand-600"
            >
              {approxProductCountLabel} catalogue lines — APIs, excipients,
              vitamins and specialty chemicals — with{" "}
              {company.experienceYears} years behind every source, CoA and MSDS
              on every batch, and a named contact who quotes, follows and
              delivers.
            </motion.p>

            <motion.div
              {...fadeUp(0.24)}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <ButtonLink href="/contact" size="lg">
                Request a quotation
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </ButtonLink>
              <ButtonLink href="/products" variant="secondary" size="lg">
                Browse the catalogue
              </ButtonLink>
            </motion.div>

            <motion.ul
              {...fadeUp(0.32)}
              className="mt-11 flex flex-wrap gap-x-7 gap-y-3.5 border-t border-sand-200 pt-7"
            >
              {credentials.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2.5 text-[13px] font-medium text-sand-600"
                >
                  <item.icon className="h-4 w-4 shrink-0 text-brand-600" />
                  {item.label}
                </li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 34, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.9,
              delay: 0.18,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-4xl border border-sand-200/90 bg-white p-2 shadow-[0_28px_70px_-36px_rgba(15,23,42,0.28)]">
              <div className="flex items-center justify-between px-4 pt-3 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
                  <span className="text-[11px] font-semibold tracking-[0.16em] text-sand-500 uppercase">
                    Star products
                  </span>
                </div>
                <Link
                  href="/star-products"
                  className="font-mono text-[11px] text-brand-700 transition-colors hover:text-brand-800"
                >
                  View all →
                </Link>
              </div>

              <div className="rounded-3xl bg-sand-50 p-2.5 ring-1 ring-sand-100">
                {showcase.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={reduceMotion ? false : { opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.55,
                      delay: 0.45 + index * 0.09,
                      ease: "easeOut",
                    }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center justify-between gap-4 rounded-2xl px-4 py-3.5 transition-colors hover:bg-white"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-semibold text-ink-900">
                          {item.name}
                        </p>
                        <p className="mt-1 font-mono text-[11.5px] text-brand-700">
                          {item.cas ? `CAS ${item.cas}` : "CAS on request"}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full border border-sand-200 bg-white px-2.5 py-1 font-mono text-[10.5px] text-sand-600">
                        {item.grade ?? "On request"}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 px-4 py-4">
                <p className="text-[12.5px] text-sand-500">
                  {approxProductCountLabel} lines in the full catalogue.
                </p>
                <div className="flex -space-x-1.5" aria-hidden="true">
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
