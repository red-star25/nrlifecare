import Image from "next/image";

type LogoProps = {
  className?: string;
  variant?: "dark" | "light";
  /** Rendered height in pixels. Width follows the logo's 293:72 ratio. */
  height?: number;
  /** Set true for the site header / hero LCP image. Leave false in grids. */
  priority?: boolean;
};

const NATIVE_WIDTH = 293;
const NATIVE_HEIGHT = 72;

export function Logo({
  className = "",
  variant = "dark",
  height = 44,
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
      className={`w-auto ${className}`}
      style={{ height }}
      sizes="240px"
    />
  );
}
