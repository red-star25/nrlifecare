import { LightAtmosphere } from "@/components/light-atmosphere";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[78dvh] items-center overflow-hidden bg-sand-50 pt-24">
      <LightAtmosphere variant="quiet" />

      <div className="shell relative py-20 text-center">
        <p className="font-mono text-[13px] tracking-[0.2em] text-brand-700 uppercase">
          Error 404
        </p>
        <h1 className="mx-auto mt-6 max-w-2xl text-[clamp(2rem,5vw,3.2rem)] leading-[1.05] font-extrabold text-ink-900">
          This page is not in the catalogue
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-sand-600">
          The page you were looking for has moved or never existed. The product
          you were looking for probably still does — try searching the
          catalogue.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/products" size="lg">
            Search the catalogue
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="/" variant="secondary" size="lg">
            Back to home
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
