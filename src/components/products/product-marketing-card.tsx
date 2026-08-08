import { Logo } from "@/components/logo";
import { Globe, Shield } from "@/components/icons";

type ProductMarketingCardProps = {
  name: string;
  categoryLabel?: string;
  cas?: string;
  grade?: string;
  /** `hero` for product pages; `compact` for catalogue / homepage grids. */
  variant?: "hero" | "compact";
  /** Prefer true on the product detail hero so the logo can be LCP. */
  priority?: boolean;
};

function FlaskIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 3h6M10 3v5.2L5.8 16a3.2 3.2 0 0 0 2.7 4.8h7a3.2 3.2 0 0 0 2.7-4.8L14 8.2V3" />
      <path d="M8.2 14h7.6" />
    </svg>
  );
}

function DropletIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3s6 6.2 6 10.2A6 6 0 0 1 6 13.2C6 9.2 12 3 12 3Z" />
    </svg>
  );
}

/**
 * Branded product card used as the default visual for every product.
 * Layout echoes the company's marketing flyers: light clinical surface
 * and trust signals.
 */
export function ProductMarketingCard({
  name,
  categoryLabel = "Premium quality API",
  cas,
  grade,
  variant = "hero",
  priority = false,
}: ProductMarketingCardProps) {
  const features = [
    { icon: FlaskIcon, label: "Premium quality" },
    { icon: Shield, label: "Lab tested" },
    { icon: DropletIcon, label: "High purity" },
    { icon: Globe, label: "Global supply" },
  ];

  const isCompact = variant === "compact";

  return (
    <div
      className={`relative flex w-full flex-col overflow-hidden border border-brand-200/80 bg-white ${
        isCompact
          ? "rounded-2xl shadow-[0_14px_36px_-24px_rgba(15,23,42,0.28)]"
          : "rounded-3xl shadow-[0_20px_50px_-28px_rgba(15,23,42,0.3)]"
      }`}
      role="img"
      aria-label={`${name} product card`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #0f6b63 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-brand-200/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-brand-100/80 blur-3xl"
        aria-hidden="true"
      />

      <svg
        className={`pointer-events-none absolute text-brand-900 opacity-[0.08] ${
          isCompact ? "top-8 right-2 h-24 w-24" : "top-14 right-4 h-36 w-36"
        }`}
        viewBox="0 0 120 120"
        fill="currentColor"
        aria-hidden="true"
      >
        <circle cx="28" cy="36" r="7" />
        <circle cx="62" cy="22" r="6" />
        <circle cx="92" cy="48" r="7" />
        <circle cx="54" cy="68" r="8" />
        <circle cx="86" cy="90" r="6" />
        <circle cx="30" cy="88" r="6" />
        <path
          d="M28 36 62 22M62 22 92 48M92 48 54 68M54 68 28 36M54 68 86 90M54 68 30 88"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
      </svg>

      <div
        className={`relative flex flex-col ${isCompact ? "p-4" : "p-5 sm:p-6"}`}
      >
        <header className="flex items-start justify-between gap-3">
          <div>
            <Logo height={isCompact ? 26 : 34} priority={priority} />
            {!isCompact ? (
              <p className="mt-1.5 max-w-[14rem] text-[9.5px] font-semibold tracking-[0.14em] text-brand-800/70 uppercase">
                Your global link to trusted pharma APIs
              </p>
            ) : null}
          </div>
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] text-brand-800 uppercase ring-1 ring-brand-200">
            Bulk
          </span>
        </header>

        <div className={isCompact ? "mt-4 space-y-2.5" : "mt-7 space-y-3"}>
          <h3
            className={`font-display leading-[1.1] font-extrabold tracking-tight text-brand-900 uppercase ${
              isCompact
                ? "line-clamp-2 text-[1.05rem]"
                : "text-[clamp(1.35rem,3.4vw,1.85rem)]"
            }`}
          >
            {name}
          </h3>

          <p className="inline-flex max-w-full rounded-md bg-ink-900 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-white uppercase">
            {categoryLabel}
          </p>

          <dl
            className={`grid grid-cols-2 gap-x-3 gap-y-1.5 ${
              isCompact ? "text-[11.5px]" : "pt-1 text-[12.5px]"
            }`}
          >
            <div>
              <dt className="text-[10px] font-semibold tracking-[0.12em] text-sand-500 uppercase">
                CAS No.
              </dt>
              <dd className="mt-0.5 font-mono font-semibold text-brand-800">
                {cas ?? "On request"}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold tracking-[0.12em] text-sand-500 uppercase">
                Grade
              </dt>
              <dd className="mt-0.5 font-semibold text-ink-900">
                {grade ?? "On request"}
              </dd>
            </div>
          </dl>

          {!isCompact ? (
            <ul className="grid grid-cols-2 gap-2 pt-1">
              {features.map((feature) => (
                <li
                  key={feature.label}
                  className="flex items-center gap-2 text-[11.5px] font-semibold text-ink-800"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                    <feature.icon className="h-3.5 w-3.5" />
                  </span>
                  {feature.label}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <footer
          className={`mt-3 flex items-center justify-between gap-2 rounded-xl bg-ink-900 font-semibold tracking-[0.12em] text-white/90 uppercase ${
            isCompact
              ? "px-2.5 py-2 text-[8.5px]"
              : "mt-4 px-3 py-2.5 text-[9.5px]"
          }`}
        >
          <span>High purity</span>
          <span className="text-white/30">·</span>
          <span>Trusted partner</span>
          <span className="text-white/30">·</span>
          <span>Serving globally</span>
        </footer>
      </div>
    </div>
  );
}
