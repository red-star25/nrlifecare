import Link from "next/link";

import { Structure, hasStructure } from "@/components/structure";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight } from "@/components/icons";
import { allProducts } from "@/data/catalog";

/**
 * Molecules recognisable enough that a formulator scanning the page sees
 * something they actually buy, spread across therapeutic classes rather than
 * clustered in one.
 */
const PREFERRED = [
  "paracetamol",
  "azithromycin-dihydrate",
  "ibuprofen",
  "metformin-hydrochloride",
  "atorvastatin-calcium",
  "omeprazole",
];

const SLOTS = 6;

const drawable = allProducts.filter((product) => hasStructure(product.slug));

/**
 * Renaming a product in the sheet changes its slug, which would silently drop
 * it from the list above. Topping up from whatever else is drawable keeps the
 * grid full rather than leaving a hole in the layout.
 */
const featured = (() => {
  const chosen = PREFERRED.map((slug) =>
    drawable.find((product) => product.slug === slug),
  ).filter((product): product is NonNullable<typeof product> =>
    Boolean(product),
  );

  const taken = new Set(chosen.map((product) => product.slug));
  for (const product of drawable) {
    if (chosen.length >= SLOTS) break;
    if (!taken.has(product.slug)) chosen.push(product);
  }

  return chosen.slice(0, SLOTS);
})();

/** A wide strip of structures used purely as texture behind the heading. */
const backdrop = drawable.slice(0, 28);

export function MoleculeShowcase() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-20 md:py-28">
      {/* Structure wallpaper — texture, not content. */}
      <div
        className="pointer-events-none absolute -inset-x-24 -top-16 flex flex-wrap items-center justify-center gap-10 opacity-[0.10]"
        aria-hidden="true"
      >
        {backdrop.map((product) => (
          <Structure
            key={product.slug}
            slug={product.slug}
            name=""
            size={200}
            className="h-[170px] w-[170px] shrink-0"
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/55 to-ink-950" />

      <div className="shell relative">
        <div className="max-w-2xl">
          <Reveal>
            <p className="eyebrow text-brand-300">Every molecule, specified</p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4.2vw,3.1rem)] leading-[1.05] font-extrabold text-white">
              We can draw what we sell.
            </h2>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-sand-400">
              Every entry in the catalogue carries its CAS number, its
              pharmacopoeial grade and its structure. Not a photograph of an
              anonymous white powder — the actual molecule your formulation
              depends on.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {featured.map((product, index) => (
            <Reveal key={product.slug} delay={index * 0.06}>
              <Link
                href={product.href}
                className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/50 hover:bg-white/[0.08]"
              >
                <div className="flex flex-1 items-center justify-center py-2">
                  <Structure
                    slug={product.slug}
                    name={product.name}
                    size={320}
                    className="h-32 w-32 transition-transform duration-500 group-hover:scale-[1.07] md:h-40 md:w-40"
                  />
                </div>

                <div className="mt-4 border-t border-white/10 pt-4">
                  <p className="text-[15px] leading-snug font-bold text-white">
                    {product.name}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:justify-between">
                    {product.cas ? (
                      <span className="font-mono text-[11.5px] whitespace-nowrap text-brand-300">
                        CAS {product.cas}
                      </span>
                    ) : null}
                    {product.grade ? (
                      <span className="rounded-full bg-white/8 px-2.5 py-1 font-mono text-[10.5px] whitespace-nowrap text-sand-400">
                        {product.grade}
                      </span>
                    ) : null}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-12">
          <ButtonLink href="/products" variant="onDark" size="lg">
            Browse all {allProducts.length} products
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
