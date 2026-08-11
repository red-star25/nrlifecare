import Image from "next/image";

type LogoProps = {
  className?: string;
  variant?: "dark" | "light";
  /** Rendered height in pixels. Prefer Tailwind `h-*` classes for responsive sizing. */
  height?: number;
  /** Set true for the site header / hero LCP image. Leave false in grids. */
  priority?: boolean;
};

const NATIVE_WIDTH = 293;
const NATIVE_HEIGHT = 72;

export function Logo({
  className = "",
  variant = "dark",
  height,
  priority = false,
}: LogoProps) {
  const source =
    variant === "light"
      ? "/logo-nrlifecare-light.png"
      : "/logo-nrlifecare.png";

  return (
    <Image
      src={source}
      alt="NR Life Care — Your Global Link To Trusted Pharma APIs"
      width={NATIVE_WIDTH}
      height={NATIVE_HEIGHT}
      priority={priority}
      className={`h-auto w-auto max-w-full object-contain object-left ${className}`}
      style={height !== undefined ? { height } : undefined}
      sizes="(max-width: 640px) 180px, 240px"
    />
  );
}
