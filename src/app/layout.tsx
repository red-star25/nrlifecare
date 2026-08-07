import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";

import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import {
  IS_CANONICAL_HOST,
  SITE_URL,
  addressOneLine,
  company,
} from "@/data/company";

const sora = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-code",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "N R Life Care | API, Excipient & Specialty Chemical Supplier in Ahmedabad",
    template: "%s | N R Life Care",
  },
  description:
    "N R Life Care supplies Active Pharmaceutical Ingredients, pharmaceutical excipients, intermediates, vitamins, nutraceutical actives and specialty chemicals from Ahmedabad, Gujarat. 1000+ products with CoA and MSDS on every consignment.",
  keywords: [
    "API manufacturer India",
    "Active Pharmaceutical Ingredients supplier",
    "pharmaceutical excipients supplier Ahmedabad",
    "bulk drug exporter Gujarat",
    "pharmaceutical intermediates India",
    "nutraceutical ingredients supplier",
    "specialty chemicals Ahmedabad",
    "caffeine anhydrous supplier",
    "N R Life Care",
  ],
  authors: [{ name: company.name }],
  creator: company.name,
  publisher: company.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: company.name,
    title:
      "N R Life Care | API, Excipient & Specialty Chemical Supplier in Ahmedabad",
    description:
      "Active Pharmaceutical Ingredients, excipients, intermediates, vitamins and specialty chemicals — supplied from Ahmedabad to formulators worldwide.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${company.name} — pharmaceutical ingredient supplier`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "N R Life Care | Pharmaceutical Ingredients, Sourced Right",
    description:
      "APIs, excipients, intermediates, nutraceuticals and specialty chemicals from Ahmedabad, Gujarat.",
    images: ["/opengraph-image"],
  },
  robots: IS_CANONICAL_HOST
    ? {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large" },
      }
    : { index: false, follow: false },
  category: "Chemical & Pharmaceutical Supply",
};

export const viewport: Viewport = {
  themeColor: "#0b0620",
  width: "device-width",
  initialScale: 1,
};

const organizationSchema = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: company.name,
  alternateName: "NR Lifecare",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  description:
    "Manufacturer, importer, exporter and wholesale supplier of Active Pharmaceutical Ingredients, pharmaceutical excipients, intermediates, vitamins, nutraceutical ingredients and specialty chemicals.",
  foundingDate: String(company.founded),
  founder: { "@type": "Person", name: company.proprietor },
  vatID: company.gst,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${company.address.line1}, ${company.address.line2}`,
    addressLocality: company.address.city,
    addressRegion: company.address.state,
    postalCode: company.address.postalCode,
    addressCountry: "IN",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: company.phonePrimary,
      email: company.email,
      contactType: "sales",
      areaServed: "Worldwide",
      availableLanguage: ["English", "Hindi", "Gujarati"],
    },
  ],
  sameAs: [
    "https://www.tradeindia.com/nr-life-care-8042676/",
    "https://www.indiamart.com/",
  ],
};

const websiteSchema = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: company.name,
  publisher: { "@id": `${SITE_URL}/#organization` },
};

const localBusinessSchema = {
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#localbusiness`,
  name: company.name,
  image: `${SITE_URL}/opengraph-image`,
  url: SITE_URL,
  telephone: company.phonePrimary,
  email: company.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: addressOneLine,
    addressLocality: company.address.city,
    addressRegion: company.address.state,
    postalCode: company.address.postalCode,
    addressCountry: "IN",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "09:00",
      closes: "18:00",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${sora.variable} ${inter.variable} ${jetBrainsMono.variable}`}
    >
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-ink-900 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>

        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <WhatsAppFab />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                organizationSchema,
                websiteSchema,
                localBusinessSchema,
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
