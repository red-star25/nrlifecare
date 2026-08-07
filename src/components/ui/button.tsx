import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "onDark";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-[0_10px_30px_-12px_rgba(87,61,174,0.75)] hover:bg-brand-700 hover:shadow-[0_16px_36px_-14px_rgba(87,61,174,0.9)]",
  secondary:
    "bg-white text-ink-900 ring-1 ring-sand-300 hover:ring-brand-400 hover:text-brand-700 shadow-sm",
  ghost:
    "text-ink-800 hover:text-brand-700 hover:bg-brand-50 ring-1 ring-transparent hover:ring-brand-200",
  onDark:
    "bg-white/10 text-white ring-1 ring-white/25 backdrop-blur hover:bg-white/20 hover:ring-white/45",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[14px]",
  lg: "h-13 px-7 text-[15px]",
};

const shared =
  "group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: ButtonLinkProps) {
  const classes = `${shared} ${variants[variant]} ${sizes[size]} ${className}`;
  const isExternal = /^(https?:|mailto:|tel:)/.test(href);

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
} & ComponentProps<"button">;

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${shared} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
