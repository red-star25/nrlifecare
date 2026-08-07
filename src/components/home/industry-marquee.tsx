import { industries } from "@/data/industries";

export function IndustryMarquee() {
  const items = industries.map((industry) => industry.name);
  const track = [...items, ...items];

  return (
    <section
      className="border-y border-sand-200 bg-white py-7"
      aria-label="Industries we supply"
    >
      <div className="shell">
        <p className="text-center text-[11px] font-semibold tracking-[0.2em] text-sand-500 uppercase">
          Supplying manufacturers across
        </p>
      </div>

      <div className="mask-fade-x mt-5 overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-3">
          {track.map((name, index) => (
            <span
              key={`${name}-${index}`}
              className="flex items-center gap-3 rounded-full border border-sand-200 bg-sand-50 px-5 py-2 text-[13.5px] font-medium whitespace-nowrap text-sand-700"
            >
              <span
                className="h-1.5 w-1.5 rounded-full bg-brand-400"
                aria-hidden="true"
              />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
