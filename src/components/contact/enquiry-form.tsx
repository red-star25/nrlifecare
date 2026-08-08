"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ArrowRight, Check, WhatsApp } from "@/components/icons";
import { categories } from "@/data/catalog";
import { company } from "@/data/company";

type FormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  category: string;
  product: string;
  quantity: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  country: "",
  category: "",
  product: "",
  quantity: "",
  message: "",
};

const fieldClass =
  "h-12 w-full rounded-xl border border-sand-200 bg-white px-4 text-[14.5px] text-ink-900 outline-none transition-colors placeholder:text-sand-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100";

const labelClass =
  "block text-[12.5px] font-semibold tracking-[0.06em] text-sand-600 uppercase";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string; showMailto: boolean };

/**
 * Posts to /api/enquiry, which emails the desk. If delivery is unavailable the
 * form says so plainly and offers the mail-client route instead — silently
 * losing an enquiry is far worse than an ugly fallback.
 */
export function EnquiryForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [honeypot, setHoneypot] = useState("");

  const update =
    (field: keyof FormState) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((current) => ({ ...current, [field]: event.target.value }));

  const composeBody = () =>
    [
      `Name: ${form.name}`,
      form.company ? `Company: ${form.company}` : null,
      `Email: ${form.email}`,
      form.phone ? `Phone: ${form.phone}` : null,
      form.country ? `Country / destination: ${form.country}` : null,
      "",
      form.category ? `Category: ${form.category}` : null,
      `Product / CAS number: ${form.product}`,
      form.quantity ? `Quantity required: ${form.quantity}` : null,
      "",
      form.message ? `Additional details:\n${form.message}` : null,
    ]
      .filter((line) => line !== null)
      .join("\n");

  const openMailClient = () => {
    const subject = encodeURIComponent(
      `Enquiry from ${form.name}${form.company ? ` (${form.company})` : ""} — ${form.product}`,
    );
    window.location.href = `mailto:${company.email}?subject=${subject}&body=${encodeURIComponent(composeBody())}`;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status.kind === "sending") return;

    setStatus({ kind: "sending" });

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website: honeypot }),
      });

      if (response.ok) {
        setStatus({ kind: "sent" });
        setForm(initialState);
        return;
      }

      const data = await response.json().catch(() => ({}));

      if (response.status === 429) {
        setStatus({
          kind: "error",
          message:
            data.error ?? "Too many enquiries just now. Please try again shortly.",
          showMailto: false,
        });
        return;
      }

      if (response.status === 400 && typeof data.error === "string") {
        setStatus({ kind: "error", message: data.error, showMailto: false });
        return;
      }

      setStatus({
        kind: "error",
        message:
          "We could not send that from here. Your details are still filled in below.",
        showMailto: true,
      });
    } catch {
      setStatus({
        kind: "error",
        message:
          "Network problem — the enquiry did not go through. Your details are still filled in below.",
        showMailto: true,
      });
    }
  };

  const sendOnWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello NR Life Care, I would like a quotation.\n\n${composeBody()}`,
    );
    window.open(`${company.whatsappHref}?text=${text}`, "_blank", "noopener");
  };

  if (status.kind === "sent") {
    return (
      <div className="rounded-3xl border border-brand-200 bg-brand-50/60 p-8 text-center sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white">
          <Check className="h-6 w-6" />
        </span>
        <h3 className="mt-6 text-[21px] font-bold text-ink-900">
          Enquiry received
        </h3>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-sand-600">
          It has landed on the desk in Ahmedabad. You will normally hear back
          within one working day — sooner if you also message on WhatsApp.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" variant="secondary" onClick={sendOnWhatsApp}>
            <WhatsApp className="h-4.5 w-4.5 text-[#25D366]" />
            Also message on WhatsApp
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStatus({ kind: "idle" })}
          >
            Send another enquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Your name <span className="text-brand-600">*</span>
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={update("name")}
            placeholder="Full name"
            autoComplete="name"
            className={`${fieldClass} mt-2`}
          />
        </div>

        <div>
          <label htmlFor="company" className={labelClass}>
            Company
          </label>
          <input
            id="company"
            value={form.company}
            onChange={update("company")}
            placeholder="Organisation name"
            autoComplete="organization"
            className={`${fieldClass} mt-2`}
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email <span className="text-brand-600">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={update("email")}
            placeholder="you@company.com"
            autoComplete="email"
            className={`${fieldClass} mt-2`}
          />
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone / WhatsApp
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={update("phone")}
            placeholder="+91 00000 00000"
            autoComplete="tel"
            className={`${fieldClass} mt-2`}
          />
        </div>

        <div>
          <label htmlFor="country" className={labelClass}>
            Delivery destination
          </label>
          <input
            id="country"
            value={form.country}
            onChange={update("country")}
            placeholder="City, country or port"
            className={`${fieldClass} mt-2`}
          />
        </div>

        <div>
          <label htmlFor="category" className={labelClass}>
            Category
          </label>
          <select
            id="category"
            value={form.category}
            onChange={update("category")}
            className={`${fieldClass} mt-2 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="none" stroke="%236b7f7e" stroke-width="1.5"><path d="m2.5 4.5 3.5 3.5 3.5-3.5"/></svg>')] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10`}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.name}>
                {category.name}
              </option>
            ))}
            <option value="Other / not listed">Other / not listed</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-[1.6fr_1fr]">
        <div>
          <label htmlFor="product" className={labelClass}>
            Product name or CAS number <span className="text-brand-600">*</span>
          </label>
          <input
            id="product"
            required
            value={form.product}
            onChange={update("product")}
            placeholder="e.g. Caffeine Anhydrous, or 58-08-2"
            className={`${fieldClass} mt-2`}
          />
        </div>

        <div>
          <label htmlFor="quantity" className={labelClass}>
            Quantity required
          </label>
          <input
            id="quantity"
            value={form.quantity}
            onChange={update("quantity")}
            placeholder="e.g. 500 kg"
            className={`${fieldClass} mt-2`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Specification & other details
        </label>
        <textarea
          id="message"
          rows={5}
          value={form.message}
          onChange={update("message")}
          placeholder="Pharmacopoeial grade required, particle size, packing preference, target timeline, or anything else that helps us quote accurately."
          className="mt-2 w-full resize-y rounded-xl border border-sand-200 bg-white px-4 py-3.5 text-[14.5px] leading-relaxed text-ink-900 outline-none transition-colors placeholder:text-sand-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
        />
      </div>

      {status.kind === "error" ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-5"
        >
          <p className="text-[14px] leading-relaxed font-medium text-red-900">
            {status.message}
          </p>
          {status.showMailto ? (
            <button
              type="button"
              onClick={openMailClient}
              className="mt-3 text-[13.5px] font-semibold text-red-900 underline underline-offset-2"
            >
              Open it in your email app instead →
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <Button
          type="submit"
          size="lg"
          className="sm:flex-1"
          disabled={status.kind === "sending"}
        >
          {status.kind === "sending" ? "Sending…" : "Send enquiry"}
          {status.kind === "sending" ? null : (
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          )}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={sendOnWhatsApp}
          className="sm:flex-1"
        >
          <WhatsApp className="h-4.5 w-4.5 text-[#25D366]" />
          Send on WhatsApp
        </Button>
      </div>

      <p className="text-[12.5px] leading-relaxed text-sand-500">
        Your enquiry goes straight to our desk in Ahmedabad and we reply to the
        address you give above. Prefer to talk?{" "}
        <a
          href={`tel:${company.phonePrimaryHref}`}
          className="font-semibold text-brand-700 underline underline-offset-2"
        >
          Call {company.phonePrimary}
        </a>
        .
      </p>
    </form>
  );
}
