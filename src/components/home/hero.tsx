"use client";

import { motion, useReducedMotion } from "motion/react";

import { ButtonLink } from "@/components/ui/button";
import { MolecularBackdrop } from "@/components/molecular-backdrop";
import { ArrowRight, Document, Phone, Shield } from "@/components/icons";
import { company } from "@/data/company";
import { totalProductCount } from "@/data/catalog";

const showcase = [
  { name: "Caffeine Anhydrous", cas: "58-08-2", grade: "IP / BP / USP / EP" },
  { name: "Microcrystalline Cellulose", cas: "9004-34-6", grade: "USP-NF" },
  { name: "Azithromycin Dihydrate", cas: "117772-70-0", grade: "IP / USP" },
  { name: "Methylcobalamin", cas: "13422-55-4", grade: "USP" },
  { name: "Xanthan Gum", cas: "11138-66-2", grade: "IP / USP-NF" },
];

const credentials = [
  { icon: Shield, label: "Drug Licence holder" },
  { icon: Document, label: "CoA & MSDS with every batch" },
  { icon: Phone, label: "Same-day quotations" },
];

export function Hero() {
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
    <section className="relative isolate overflow-hidden bg-ink-950 pt-[124px] pb-20 md:pt-[150px] md:pb-28">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" />
      <MolecularBackdrop className="opacity-70" />

      <div
        className="glow pointer-events-none absolute -top-24 -left-24 h-[420px] w-[420px] animate-drift opacity-30"
        aria-hidden="true"
      />
      <div
        className="glow pointer-events-none absolute -right-32 bottom-0 h-[520px] w-[520px] opacity-20"
        aria-hidden="true"
      />

      <div className="shell relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div>
            <motion.div {...fadeUp(0)}>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.06] py-1.5 pr-4 pl-1.5 backdrop-blur">
                <span className="rounded-full bg-brand-500 px-2.5 py-1 text-[10.5px] font-bold tracking-[0.1em] whitespace-nowrap text-ink-950 uppercase">
                  Est. {company.founded}
                </span>
                <span className="text-[12.5px] font-medium whitespace-nowrap text-sand-300">
                  Ahmedabad, India
                  <span className="hidden sm:inline"> · Supplying worldwide</span>
                </span>
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.08)}
              className="mt-7 text-[clamp(2.5rem,6vw,4.35rem)] leading-[0.99] font-extrabold text-white"
            >
              Pharmaceutical
              <br />
              ingredients,
              <br />
              <span className="text-gradient">sourced right.</span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.16)}
              className="mt-7 max-w-xl text-[17px] leading-relaxed text-sand-300/85"
            >
              Over a thousand line items across APIs, excipients,
              intermediates, vitamins and specialty chemicals — backed by{" "}
              {company.experienceYears} years of relationships with India&apos;s
              bulk drug manufacturers. One partner, one purchase order, one
              person who answers the phone.
            </motion.p>

            <motion.div
              {...fadeUp(0.24)}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <ButtonLink href="/contact" size="lg">
                Request a quotation
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </ButtonLink>
              <ButtonLink href="/products" variant="onDark" size="lg">
                Browse the catalogue
              </ButtonLink>
            </motion.div>

            <motion.ul
              {...fadeUp(0.32)}
              className="mt-11 flex flex-wrap gap-x-7 gap-y-3.5 border-t border-white/10 pt-7"
            >
              {credentials.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2.5 text-[13px] font-medium text-sand-400"
                >
                  <item.icon className="h-4 w-4 shrink-0 text-brand-400" />
                  {item.label}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Catalogue preview panel — communicates depth and data quality at a glance */}
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
            <div
              className="glow pointer-events-none absolute -inset-8 opacity-25"
              aria-hidden="true"
            />

            <div className="relative overflow-hidden rounded-4xl border border-white/12 bg-white/[0.055] p-2 backdrop-blur-xl">
              <div className="flex items-center justify-between px-4 pt-3 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-400" />
                  <span className="text-[11px] font-semibold tracking-[0.16em] text-sand-400 uppercase">
                    Product catalogue
                  </span>
                </div>
                <span className="font-mono text-[11px] text-sand-500">
                  {totalProductCount} listed
                </span>
              </div>

              <div className="rounded-3xl bg-ink-900/70 p-2.5">
                {showcase.map((item, index) => (
                  <motion.div
                    key={item.cas}
                    initial={reduceMotion ? false : { opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.55,
                      delay: 0.45 + index * 0.09,
                      ease: "easeOut",
                    }}
                    className="flex items-center justify-between gap-4 rounded-2xl px-4 py-3.5 transition-colors hover:bg-white/[0.05]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-white">
                        {item.name}
                      </p>
                      <p className="mt-1 font-mono text-[11.5px] text-brand-400">
                        CAS {item.cas}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 font-mono text-[10.5px] text-sand-400">
                      {item.grade}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 px-4 py-4">
                <p className="text-[12.5px] text-sand-400">
                  Every line ships with its Certificate of Analysis.
                </p>
                <div className="flex -space-x-1.5" aria-hidden="true">
                  {["IP", "BP", "USP", "EP"].map((standard) => (
                    <span
                      key={standard}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-ink-950 bg-brand-600 font-mono text-[9px] font-bold text-white"
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
