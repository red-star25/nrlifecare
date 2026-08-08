"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight, Close, Menu, Phone } from "@/components/icons";
import { categoryIcons } from "@/components/icons";
import { categories } from "@/data/catalog";
import { company } from "@/data/company";

const navigation = [
  { label: "Products", href: "/products", hasMenu: true },
  { label: "Industries", href: "/industries" },
  { label: "Quality", href: "/quality" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Navigating away should dismiss any open menu, so close on any link click
  // inside the menu surfaces rather than reacting to the pathname afterwards.
  const closeOnLinkClick = (event: React.MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("a")) {
      setMenuOpen(false);
      setProductsOpen(false);
    }
  };

  // Small grace period so the pointer can travel from the trigger into the panel.
  const openProducts = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setProductsOpen(true);
  };
  const scheduleCloseProducts = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setProductsOpen(false), 140);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Every page opens on a dark hero, so the untouched header sits on dark and
  // has to invert once the light page background scrolls up behind it.
  const onDark = !scrolled && !menuOpen;

  const navLinkClass = (href: string) => {
    if (isActive(href)) return onDark ? "text-brand-300" : "text-brand-700";
    return onDark
      ? "text-sand-300 hover:text-white"
      : "text-sand-700 hover:text-ink-900";
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen
          ? "border-b border-sand-200/80 bg-sand-50/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="shell flex h-[72px] items-center justify-between gap-6">
        <Link href="/" aria-label={`${company.name} — home`} className="shrink-0">
          <Logo variant={onDark ? "light" : "dark"} priority />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) =>
            item.hasMenu ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={openProducts}
                onMouseLeave={scheduleCloseProducts}
              >
                <Link
                  href={item.href}
                  aria-expanded={productsOpen}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[14.5px] font-medium transition-colors ${navLinkClass(item.href)}`}
                >
                  {item.label}
                  <svg
                    viewBox="0 0 12 12"
                    className={`h-3 w-3 transition-transform duration-300 ${
                      productsOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <path
                      d="m2.5 4.5 3.5 3.5 3.5-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>

                <AnimatePresence>
                  {productsOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.985 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.99 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      onClick={closeOnLinkClick}
                      className="absolute top-full left-1/2 w-[680px] -translate-x-1/2 pt-3"
                    >
                      <div className="overflow-hidden rounded-3xl border border-sand-200 bg-white p-3 shadow-[0_28px_70px_-30px_rgba(6,35,42,0.42)]">
                        <div className="grid grid-cols-2 gap-1">
                          {categories.map((category) => {
                            const Icon =
                              categoryIcons[category.slug] ?? categoryIcons[
                                "active-pharmaceutical-ingredients"
                              ];
                            return (
                              <Link
                                key={category.slug}
                                href={`/products/${category.slug}`}
                                className="group flex gap-3 rounded-2xl p-3 transition-colors hover:bg-sand-100"
                              >
                                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition-colors group-hover:bg-brand-600 group-hover:text-white group-hover:ring-brand-600">
                                  <Icon className="h-[18px] w-[18px]" />
                                </span>
                                <span className="min-w-0">
                                  <span className="block text-[13.5px] font-semibold text-ink-900">
                                    {category.name}
                                  </span>
                                  <span className="mt-0.5 block truncate text-[12px] text-sand-500">
                                    {category.products.length} products ·{" "}
                                    {category.tagline}
                                  </span>
                                </span>
                              </Link>
                            );
                          })}
                        </div>

                        <div className="mt-2 grid gap-1 sm:grid-cols-2">
                          <Link
                            href="/star-products"
                            className="flex items-center justify-between rounded-2xl bg-brand-600 px-4 py-3 text-white transition-colors hover:bg-brand-700"
                          >
                            <span className="text-[13.5px] font-semibold">
                              Star products
                            </span>
                            <ArrowRight className="h-4 w-4 shrink-0" />
                          </Link>
                          <Link
                            href="/products"
                            className="flex items-center justify-between rounded-2xl bg-ink-900 px-4 py-3 text-white transition-colors hover:bg-ink-800"
                          >
                            <span className="text-[13.5px] font-semibold">
                              Search full catalogue
                            </span>
                            <ArrowRight className="h-4 w-4 shrink-0" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-[14.5px] font-medium transition-colors ${navLinkClass(item.href)}`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${company.phonePrimaryHref}`}
            className={`flex items-center gap-2 text-[14px] font-semibold transition-colors ${
              onDark
                ? "text-white hover:text-brand-300"
                : "text-ink-900 hover:text-brand-700"
            }`}
          >
            <Phone
              className={`h-4 w-4 ${onDark ? "text-brand-400" : "text-brand-600"}`}
            />
            {company.phonePrimary}
          </a>
          <ButtonLink href="/contact">
            Request a quote
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className={`flex h-11 w-11 items-center justify-center rounded-full ring-1 transition-colors lg:hidden ${
            onDark
              ? "text-white ring-white/25 hover:bg-white/10"
              : "text-ink-900 ring-sand-300 hover:bg-white"
          }`}
        >
          {menuOpen ? (
            <Close className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-sand-200 bg-sand-50 lg:hidden"
          >
            <div
              onClick={closeOnLinkClick}
              className="shell max-h-[calc(100dvh-72px)] overflow-y-auto py-6"
            >
              <nav className="flex flex-col">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`border-b border-sand-200 py-3.5 font-display text-lg font-semibold ${
                      isActive(item.href) ? "text-brand-700" : "text-ink-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <Link
                href="/star-products"
                className="mt-6 flex items-center justify-between rounded-2xl bg-brand-600 px-4 py-3.5 text-white"
              >
                <span className="text-[14.5px] font-semibold">Star products</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <p className="eyebrow mt-6 text-sand-500">Product categories</p>
              <div className="mt-3 grid gap-1.5">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/products/${category.slug}`}
                    className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 ring-1 ring-sand-200"
                  >
                    <span className="text-[14px] font-medium text-ink-900">
                      {category.name}
                    </span>
                    <span className="font-mono text-[11px] text-sand-500">
                      {category.products.length}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 pb-4">
                <ButtonLink href="/contact" size="lg">
                  Request a quote
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink
                  href={`tel:${company.phonePrimaryHref}`}
                  variant="secondary"
                  size="lg"
                >
                  <Phone className="h-4 w-4" />
                  {company.phonePrimary}
                </ButtonLink>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
