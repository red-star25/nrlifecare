import { Document, Shield } from "@/components/icons";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { credentials } from "@/data/company";

export function CredentialsGrid() {
  return (
    <Stagger className="grid gap-4 md:grid-cols-2">
      {credentials.map((credential) => (
        <StaggerItem key={credential.number}>
          <article className="flex h-full flex-col rounded-3xl border border-sand-200 bg-white p-7">
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                <Shield className="h-5 w-5" />
              </span>
              <span className="rounded-full bg-gold-400/12 px-3 py-1 text-[11px] font-semibold tracking-wide text-gold-500 uppercase ring-1 ring-gold-400/25">
                Certificate on file
              </span>
            </div>

            <h3 className="mt-5 text-[17px] font-bold text-ink-900">
              {credential.name}
            </h3>

            <p className="mt-2 font-mono text-[13px] break-all text-brand-700">
              {credential.number}
            </p>

            <p className="mt-3 flex-1 text-[14px] leading-relaxed text-sand-600">
              {credential.detail}
            </p>

            <dl className="mt-5 space-y-1.5 border-t border-sand-100 pt-4">
              <div className="flex gap-2">
                <dt className="shrink-0 text-[12px] text-sand-500">
                  Issued by
                </dt>
                <dd className="text-[12px] font-medium text-sand-700">
                  {credential.issuer}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="shrink-0 text-[12px] text-sand-500">Validity</dt>
                <dd className="text-[12px] font-medium text-sand-700">
                  {credential.validity}
                </dd>
              </div>
            </dl>

            <a
              href={credential.document}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex items-center gap-2 text-[13.5px] font-semibold text-brand-700 transition-colors hover:text-brand-800"
            >
              <Document className="h-4 w-4" />
              View certificate
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              >
                →
              </span>
            </a>
          </article>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export function CredentialsStrip() {
  return (
    <Reveal className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2.5">
      {credentials.map((credential) => (
        <span
          key={credential.number}
          className="rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-[12.5px] font-medium text-sand-300 backdrop-blur"
        >
          {credential.name}
        </span>
      ))}
    </Reveal>
  );
}
