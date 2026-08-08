import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Sanity → this route → GitHub Actions (cms-pull).
 *
 * Configure in Sanity → API → Webhooks:
 *   URL:    https://<your-domain>/api/cms-webhook
 *   Header: x-webhook-secret: <same value as SANITY_WEBHOOK_SECRET>
 *   Trigger on create / update / delete for product (and category if you like)
 *
 * Vercel env:
 *   SANITY_WEBHOOK_SECRET  — shared secret you invent
 *   GH_DISPATCH_TOKEN      — GitHub PAT that can create repository_dispatch
 *   GH_REPO                — optional, defaults to red-star25/nrlifecare
 */
export async function POST(request: Request) {
  const provided =
    request.headers.get("x-webhook-secret")?.trim() ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();

  const expected = process.env.SANITY_WEBHOOK_SECRET?.trim();
  if (!expected || !provided || provided !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const token = process.env.GH_DISPATCH_TOKEN?.trim();
  const repo = process.env.GH_REPO?.trim() || "red-star25/nrlifecare";

  if (!token) {
    console.error("[cms-webhook] GH_DISPATCH_TOKEN is not set");
    return NextResponse.json({ error: "not-configured" }, { status: 503 });
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repo}/dispatches`,
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({ event_type: "sanity-catalogue-changed" }),
      },
    );

    // GitHub returns 204 No Content on success.
    if (!response.ok && response.status !== 204) {
      const detail = await response.text();
      console.error("[cms-webhook] GitHub dispatch failed:", response.status, detail);
      return NextResponse.json({ error: "dispatch-failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (cause) {
    console.error("[cms-webhook] Unexpected failure:", cause);
    return NextResponse.json({ error: "dispatch-failed" }, { status: 502 });
  }
}
