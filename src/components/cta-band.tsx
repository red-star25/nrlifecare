import { ArrowRight, Mail, Phone } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button";
import { MolecularBackdrop } from "@/components/molecular-backdrop";
import { Reveal } from "@/components/ui/reveal";
import { company } from "@/data/company";

type CtaBandProps = {
  title?: string;
  body?: string;
};

export function CtaBand({
  title = "Tell us what you need. We will tell you what it costs.",
  body = "Send a product name or CAS number with your quantity and destination. You will have pricing, MOQ, lead time and packing details back — usually within one working day.",
}: CtaBandProps) {
  return (
    <section className="shell py-16 md:py-24">
      <Reveal className="relative isolate overflow-hidden rounded-4xl bg-ink-950 px-6 py-14 md:px-14 md:py-20">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" />
        <MolecularBackdrop className="opacity-60" />
        <div
          className="glow pointer-events-none absolute -top-20 right-0 h-80 w-80 opacity-25"
          aria-hidden="true"
        />

        <div className="relative grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow text-brand-300">
              <span className="h-px w-6 bg-brand-300/60" aria-hidden="true" />
              Start an enquiry
            </p>
            <h2 className="mt-5 max-w-2xl text-[clamp(1.85rem,4vw,2.9rem)] leading-[1.06] font-bold text-white">
              {title}
            </h2>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-sand-300/85">
              {body}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact" size="lg">
                Send an enquiry
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </ButtonLink>
              <ButtonLink
                href={company.whatsappHref}
                variant="onDark"
                size="lg"
              >
                Chat on WhatsApp
              </ButtonLink>
            </div>
          </div>

          <div className="grid gap-3">
            <a
              href={`tel:${company.phonePrimaryHref}`}
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-5 transition-colors hover:border-brand-400/40 hover:bg-white/[0.09]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
                <Phone className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold tracking-[0.14em] text-sand-500 uppercase">
                  Call directly
                </span>
                <span className="mt-1 block text-[16px] font-semibold text-white">
                  {company.phonePrimary}
                </span>
              </span>
            </a>

            <a
              href={`mailto:${company.email}`}
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-5 transition-colors hover:border-brand-400/40 hover:bg-white/[0.09]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
                <Mail className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold tracking-[0.14em] text-sand-500 uppercase">
                  Email the desk
                </span>
                <span className="mt-1 block truncate text-[16px] font-semibold text-white">
                  {company.email}
                </span>
              </span>
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
