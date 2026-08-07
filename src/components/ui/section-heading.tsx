import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  tone = "light",
  className = "",
}: SectionHeadingProps) {
  const isDark = tone === "dark";

  return (
    <Reveal
      className={`${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}
    >
      {eyebrow ? (
        <p
          className={`eyebrow ${isDark ? "text-brand-300" : "text-brand-600"}`}
        >
          <span
            className={`h-px w-6 ${isDark ? "bg-brand-300/60" : "bg-brand-400/70"}`}
            aria-hidden="true"
          />
          {eyebrow}
        </p>
      ) : null}

      <h2
        className={`mt-4 text-[clamp(1.85rem,4vw,3rem)] leading-[1.08] font-bold ${
          isDark ? "text-white" : "text-ink-900"
        }`}
      >
        {title}
      </h2>

      {lede ? (
        <p
          className={`mt-5 text-[16.5px] leading-relaxed ${
            isDark ? "text-sand-300/85" : "text-sand-600"
          }`}
        >
          {lede}
        </p>
      ) : null}
    </Reveal>
  );
}
