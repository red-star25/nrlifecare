import { NextResponse } from "next/server";
import { Resend } from "resend";

import { company } from "@/data/company";

export const runtime = "nodejs";

const FIELD_LIMIT = 2000;

type Payload = Record<string, unknown>;

function text(payload: Payload, key: string) {
  const value = payload[key];
  return typeof value === "string" ? value.trim().slice(0, FIELD_LIMIT) : "";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Crude per-instance throttle. Not a substitute for a real rate limiter, but
 * enough to blunt a script hammering the endpoint, and it costs nothing.
 */
const recent = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(key: string) {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);

  if (recent.size > 500) {
    for (const [k, v] of recent) {
      if (v.every((t) => now - t > WINDOW_MS)) recent.delete(k);
    }
  }

  return hits.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  let payload: Payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // Honeypot: a real person never fills a field they cannot see.
  if (text(payload, "website")) {
    return NextResponse.json({ ok: true });
  }

  const name = text(payload, "name");
  const email = text(payload, "email");
  const product = text(payload, "product");

  if (!name || !email || !product) {
    return NextResponse.json(
      { error: "Name, email and product are required." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json(
      { error: "That email address does not look right." },
      { status: 400 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many enquiries just now. Please try again in a minute." },
      { status: 429 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Surfaced to the client so the form can fall back to opening a mail
    // client rather than pretending the enquiry was delivered.
    console.error("[enquiry] RESEND_API_KEY is not set — cannot send.");
    return NextResponse.json({ error: "not-configured" }, { status: 503 });
  }

  const rows: Array<[string, string]> = [
    ["Name", name],
    ["Company", text(payload, "company")],
    ["Email", email],
    ["Phone", text(payload, "phone")],
    ["Destination", text(payload, "country")],
    ["Category", text(payload, "category")],
    ["Product / CAS", product],
    ["Quantity", text(payload, "quantity")],
  ].filter(([, value]) => value !== "") as Array<[string, string]>;

  const message = text(payload, "message");

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#2a1f6b">
      <h2 style="margin:0 0 4px;color:#3b278f">New enquiry from the website</h2>
      <p style="margin:0 0 20px;color:#55536b;font-size:14px">
        ${escapeHtml(name)}${text(payload, "company") ? ` · ${escapeHtml(text(payload, "company"))}` : ""}
      </p>
      <table style="border-collapse:collapse;font-size:14px">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:6px 18px 6px 0;color:#726f8c;vertical-align:top;white-space:nowrap">${label}</td>
            <td style="padding:6px 0;font-weight:600">${escapeHtml(value)}</td>
          </tr>`,
          )
          .join("")}
      </table>
      ${
        message
          ? `<div style="margin-top:20px;padding:16px;background:#f4f3fc;border-radius:12px">
               <div style="color:#726f8c;font-size:12px;text-transform:uppercase;letter-spacing:.06em">Specification &amp; details</div>
               <div style="margin-top:8px;font-size:14px;white-space:pre-wrap">${escapeHtml(message)}</div>
             </div>`
          : ""
      }
      <p style="margin-top:24px;font-size:13px;color:#726f8c">
        Reply directly to this email to reach ${escapeHtml(name)}.
      </p>
    </div>`;

  const plain = [
    ...rows.map(([label, value]) => `${label}: ${value}`),
    ...(message ? ["", "Specification & details:", message] : []),
  ].join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.ENQUIRY_FROM || "N R Life Care <onboarding@resend.dev>",
      to: process.env.ENQUIRY_TO || company.email,
      replyTo: email,
      subject: `Enquiry: ${product} — ${name}${
        text(payload, "company") ? ` (${text(payload, "company")})` : ""
      }`,
      html,
      text: plain,
    });

    if (error) {
      console.error("[enquiry] Resend rejected the message:", error);
      return NextResponse.json({ error: "send-failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (cause) {
    console.error("[enquiry] Unexpected failure:", cause);
    return NextResponse.json({ error: "send-failed" }, { status: 502 });
  }
}
