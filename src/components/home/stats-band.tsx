import { Structure, hasStructure } from "@/components/structure";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { allProducts } from "@/data/catalog";
import { stats } from "@/data/company";

/** One large structure per stat, used as a watermark rather than as content. */
const watermarks = allProducts
  .filter((product) => hasStructure(product.slug))
  .filter((_, index) => index % 17 === 0)
  .slice(0, stats.length);

export function StatsBand() {
  return (
    <section className="relative overflow-hidden border-y border-sand-200 bg-sand-50">
      <Stagger className="shell grid gap-px py-0 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const watermark = watermarks[index];

          return (
            <StaggerItem key={stat.label}>
              <div className="relative h-full overflow-hidden px-6 py-12 md:px-8 md:py-16">
                {watermark ? (
                  <div
                    className="pointer-events-none absolute -top-4 -right-6 opacity-[0.07] invert"
                    aria-hidden="true"
                  >
                    <Structure
                      slug={watermark.slug}
                      name=""
                      size={190}
                      className="h-[130px] w-[130px]"
                    />
                  </div>
                ) : null}

                <div className="relative">
                  <p className="font-display text-[clamp(2.4rem,4.4vw,3.3rem)] leading-none font-extrabold text-brand-800">
                    {stat.value}
                  </p>
                  <p className="mt-3.5 text-[14.5px] font-bold text-ink-900">
                    {stat.label}
                  </p>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-sand-600">
                    {stat.detail}
                  </p>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}
