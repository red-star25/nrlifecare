import { ButtonLink } from "@/components/ui/button";
import { MolecularBackdrop } from "@/components/molecular-backdrop";
import { ArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[78dvh] items-center overflow-hidden bg-ink-950 pt-24">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" />
      <MolecularBackdrop className="opacity-60" />
      <div
        className="glow pointer-events-none absolute top-1/4 left-1/3 h-96 w-96 opacity-20"
        aria-hidden="true"
      />

      <div className="shell relative py-20 text-center">
        <p className="font-mono text-[13px] tracking-[0.2em] text-brand-400 uppercase">
          Error 404
        </p>
        <h1 className="mx-auto mt-6 max-w-2xl text-[clamp(2rem,5vw,3.2rem)] leading-[1.05] font-extrabold text-white">
          This page is not in the catalogue
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-sand-400">
          The page you were looking for has moved or never existed. The product
          you were looking for probably still does — try searching the
          catalogue.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/products" size="lg">
            Search the catalogue
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </ButtonLink>
          <ButtonLink href="/" variant="onDark" size="lg">
            Back to home
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
