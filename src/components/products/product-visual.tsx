import { Document, Globe, Shield } from "@/components/icons";

type ProductVisualProps = {
  name: string;
  cas?: string;
  grade?: string;
};

/**
 * Stands in for product photography. Bulk chemical photos are near-identical
 * white powders, so a data-forward panel communicates more than a stock image —
 * and there is no risk of showing material that is not the actual batch.
 */
export function ProductVisual({ name, cas, grade }: ProductVisualProps) {
  const initials = name
    .replace(/[^A-Za-z ]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <div className="relative">
      <div
        className="glow pointer-events-none absolute -inset-8 opacity-25"
        aria-hidden="true"
      />

      <div className="relative overflow-hidden rounded-4xl border border-white/12 bg-white/[0.055] p-2 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 pt-3 pb-4">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-400" />
            <span className="text-[11px] font-semibold tracking-[0.16em] text-sand-400 uppercase">
              Technical summary
            </span>
          </span>
          <span className="font-mono text-[11px] text-sand-500">
            Bulk supply
          </span>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-ink-900/70 px-6 py-9">
          {/* Hexagonal lattice watermark */}
          <svg
            className="pointer-events-none absolute -top-8 -right-10 h-56 w-56 opacity-[0.13]"
            viewBox="0 0 100 100"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M50 6 88 28v44L50 94 12 72V28L50 6Z"
              stroke="#b3a8e8"
              strokeWidth="1.4"
            />
            <path
              d="M50 24 72 37v26L50 76 28 63V37L50 24Z"
              stroke="#b3a8e8"
              strokeWidth="1.1"
            />
            <circle cx="50" cy="6" r="3.4" fill="#b3a8e8" />
            <circle cx="88" cy="72" r="3" fill="#b3a8e8" />
            <circle cx="12" cy="28" r="3" fill="#b3a8e8" />
          </svg>

          <div className="relative">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/18 font-display text-[19px] font-extrabold text-brand-300 ring-1 ring-brand-400/25">
              {initials || "NR"}
            </span>

            <p className="mt-6 text-[19px] leading-snug font-bold text-white">
              {name}
            </p>

            <dl className="mt-6 space-y-3.5 border-t border-white/10 pt-5">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[12px] tracking-[0.1em] text-sand-500 uppercase">
                  CAS No.
                </dt>
                <dd className="font-mono text-[14px] text-brand-300">
                  {cas ?? "On request"}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[12px] tracking-[0.1em] text-sand-500 uppercase">
                  Grade
                </dt>
                <dd className="font-mono text-[13px] text-sand-300">
                  {grade ?? "On request"}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[12px] tracking-[0.1em] text-sand-500 uppercase">
                  Origin
                </dt>
                <dd className="font-mono text-[13px] text-sand-300">India</dd>
              </div>
            </dl>
          </div>
        </div>

        <ul className="flex items-center justify-between gap-2 px-4 py-4">
          {[
            { icon: Document, label: "CoA" },
            { icon: Shield, label: "MSDS" },
            { icon: Globe, label: "Export" },
          ].map((item) => (
            <li
              key={item.label}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/[0.04] py-2.5 text-[12px] font-medium text-sand-400"
            >
              <item.icon className="h-4 w-4 text-brand-400" />
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
