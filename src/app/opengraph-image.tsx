import { ImageResponse } from "next/og";

import { company } from "@/data/company";
import { approxProductCountLabel } from "@/data/catalog";

export const alt = `${company.name} — Active Pharmaceutical Ingredients, excipients and specialty chemicals`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const subline = `${approxProductCountLabel} catalogued APIs, excipients, intermediates, vitamins and specialty chemicals — shipped worldwide since ${company.founded}.`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #1e1654 0%, #2a1f6b 55%, #5b45c0 160%)",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              width: 62,
              height: 62,
              borderRadius: 16,
              background: "rgba(143,124,216,0.18)",
              border: "1px solid rgba(179,168,232,0.45)",
              alignItems: "center",
              justifyContent: "center",
              color: "#d5cff3",
              fontSize: 26,
              fontWeight: 800,
            }}
          >
            NR
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                color: "#ffffff",
                fontSize: 27,
                fontWeight: 800,
                letterSpacing: 1,
              }}
            >
              NR LIFE CARE
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 15,
                letterSpacing: 3,
                marginTop: 5,
              }}
            >
              AHMEDABAD · GUJARAT · INDIA
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#ffffff",
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            Your global link to
          </div>
          <div
            style={{
              color: "#7ebfb8",
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            trusted pharma APIs.
          </div>
          <div
            style={{
              display: "flex",
              color: "rgba(255,255,255,0.62)",
              fontSize: 25,
              marginTop: 26,
              maxWidth: 900,
            }}
          >
            {subline}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {["IP", "BP", "USP", "EP", "FCC"].map((standard) => (
            <div
              key={standard}
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.78)",
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {standard}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
