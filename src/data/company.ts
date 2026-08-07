export { CANONICAL_SITE_URL, IS_CANONICAL_HOST, SITE_URL } from "./site";

export const company = {
  name: "N R Life Care",
  legalName: "N R Life Care",
  shortName: "NR Life Care",
  tagline: "Pharmaceutical ingredients, sourced right.",
  /** The registered tagline that appears in the company logo. */
  officialTagline: "Your Global Link To Trusted Pharma APIs",
  proposition:
    "A single, accountable supply partner for Active Pharmaceutical Ingredients, excipients, intermediates and specialty chemicals — shipped from Ahmedabad to formulators worldwide.",
  founded: 2014,
  experienceYears: 30,
  proprietor: "Jitendra Nakum",
  proprietorLegalName: "Jitendrakumar Varsingbhai Nakum",
  proprietorRole: "Managing Director",
  constitution: "Proprietorship",
  gst: "24ADVPN9611L2ZU",
  businessType: [
    "Manufacturer",
    "Importer",
    "Exporter",
    "Wholesale Trader",
    "Supplier",
  ],
  address: {
    line1: "44, First Floor, Takshashila Habitat",
    line2: "Nr. Eco Park, Odhav–Vastral, S. P. Ring Road",
    city: "Ahmedabad",
    state: "Gujarat",
    postalCode: "382415",
    country: "India",
  },
  phonePrimary: "+91 97232 13272",
  phonePrimaryHref: "+919723213272",
  phoneSecondary: "080 4580 3588",
  phoneSecondaryHref: "08045803588",
  email: "nrlifecare@gmail.com",
  whatsappHref: "https://wa.me/919723213272",
  hours: "Monday – Saturday, 9:00 AM – 6:00 PM IST",
} as const;

/**
 * Registrations and certifications, each transcribed from the certificate PDF
 * served at /documents. Only entries we can evidence are listed — the FSSAI
 * licence and IEC are deliberately omitted pending current copies.
 */
export const credentials = [
  {
    name: "Drug Licence — Form 20B",
    number: "GJ-ADC-117408",
    issuer: "Food & Drugs Control Administration, Gujarat",
    detail:
      "Licence to sell, stock and distribute by wholesale, drugs other than those in Schedules C, C(1) and X.",
    validity: "Issued 09 Jul 2024 · valid perpetually subject to review",
    document: "/documents/drug-licence-form-20b.pdf",
  },
  {
    name: "Drug Licence — Form 21B",
    number: "GJ-ADC-117409",
    issuer: "Food & Drugs Control Administration, Gujarat",
    detail:
      "Licence to sell, stock and distribute by wholesale, drugs specified in Schedules C and C(1), excluding those requiring cold storage.",
    validity: "Issued 09 Jul 2024 · valid perpetually subject to review",
    document: "/documents/drug-licence-form-21b.pdf",
  },
  {
    name: "ISO 22000:2018",
    number: "FSMS/24M03870",
    issuer: "MQA Certification Services, accredited by UKAF",
    detail:
      "Food Safety Management System certification covering APIs, excipients, chemicals, intermediates, vitamins, minerals and food & agro products.",
    validity: "Certified 11 Jul 2024 · recertification due 10 Jul 2027",
    document: "/documents/iso-22000-certificate.pdf",
  },
  {
    name: "GST Registration",
    number: "24ADVPN9611L2ZU",
    issuer: "Government of India",
    detail:
      "Regular GST registration for N R Life Care, Ahmedabad, Gujarat.",
    validity: "Effective 31 May 2019 · no expiry",
    document: "/documents/gst-registration-certificate.pdf",
  },
  {
    name: "Trade Mark",
    number: "5935859",
    issuer: "Trade Marks Registry, Government of India",
    detail:
      "N R Life Care registered in Class 5 — pharmaceutical, veterinary and sanitary preparations, and chemicals for pharmaceutical use.",
    validity: "Registered 13 May 2023 · 10-year term",
    document: "/documents/trademark-certificate.pdf",
  },
  {
    name: "Udyam Registration",
    number: "UDYAM-GJ-01-0063018",
    issuer: "Ministry of Micro, Small and Medium Enterprises",
    detail:
      "Registered manufacturing enterprise under NIC 21001 — medicinal substances used in the manufacture of pharmaceuticals.",
    validity: "Registered 15 Apr 2021",
    document: "/documents/udyam-registration-certificate.pdf",
  },
] as const;

/** Printable catalogues buyers can circulate internally. */
export const catalogueDownloads = [
  {
    name: "API & Pharmaceutical Catalogue",
    description:
      "Active pharmaceutical ingredients, excipients, intermediates and vitamins with CAS numbers and grades.",
    href: "/documents/nr-life-care-api-catalogue.pdf",
    size: "1.4 MB",
  },
  {
    name: "Food & Agro Catalogue",
    description:
      "Food-grade raw materials, nutraceutical ingredients, agrochemicals and specialty additives.",
    href: "/documents/nr-life-care-food-catalogue.pdf",
    size: "1.8 MB",
  },
] as const;

/** Verbatim from the Managing Director's message on the company's own site. */
export const proprietorMessage = [
  "At NR Lifecare, we are committed to excellence in trading and exporting high-quality Active Pharmaceutical Ingredients, food raw materials, chemicals, excipients, and agrochemical products. Our mission is to build lasting partnerships based on trust, quality, and reliability.",
  "We believe in delivering trust through quality. From pharma APIs and food raw materials to chemicals, excipients, and agrochemicals — we're here to serve industries that touch lives every day.",
] as const;

export const addressOneLine = [
  company.address.line1,
  company.address.line2,
  `${company.address.city} – ${company.address.postalCode}`,
  `${company.address.state}, ${company.address.country}`,
].join(", ");

export const stats = [
  {
    value: "1000+",
    label: "Products supplied",
    detail: "APIs, excipients, intermediates, nutraceuticals and chemicals.",
  },
  {
    value: "30+",
    label: "Years of trade experience",
    detail: "Relationships built across three decades in bulk pharma.",
  },
  {
    value: "17",
    label: "Industries served",
    detail: "From regulated pharma to food, agro, textile and oil & gas.",
  },
  {
    value: "2014",
    label: "Established in Ahmedabad",
    detail: "Operating from Gujarat, India's chemical manufacturing heartland.",
  },
] as const;

export const differentiators = [
  {
    title: "One desk, one thousand line items",
    body: "Stop juggling a dozen vendors for a single formulation. We consolidate APIs, excipients, actives and solvents into one purchase order, one invoice and one point of accountability.",
    accent: "Consolidated sourcing",
  },
  {
    title: "Paperwork that clears QA the first time",
    body: "Every consignment travels with its Certificate of Analysis, MSDS and batch documentation. Where a customer's QA team needs additional support, we go back to the manufacturer for it.",
    accent: "Documentation-first",
  },
  {
    title: "Pharmacopoeial grades, stated plainly",
    body: "IP, BP, USP, EP and food-grade material is listed against the standard it actually meets — so what your team specifies is what lands on your dock.",
    accent: "Grade transparency",
  },
  {
    title: "Vetted manufacturing partners",
    body: "Sources are selected after stringent market and quality analysis, then held to the same standard on every repeat order. We do not chase the cheapest lot at the cost of a rejected batch.",
    accent: "Supplier vetting",
  },
  {
    title: "Pricing built for repeat buyers",
    body: "Competitive landed cost on trial quantities and scheduled bulk contracts alike, with transparent MOQs rather than quotes that move every time you ask.",
    accent: "Honest commercials",
  },
  {
    title: "Delivered inside the promised window",
    body: "Export documentation, packing and freight coordination handled in-house, so committed timelines are timelines we can actually hold.",
    accent: "Reliable logistics",
  },
] as const;

export const process = [
  {
    step: "01",
    title: "Share your requirement",
    body: "Send the product name or CAS number, the pharmacopoeial grade you need, quantity and destination. A rough specification is enough to start.",
  },
  {
    step: "02",
    title: "Receive a firm quotation",
    body: "We confirm availability with our manufacturing partners and come back with pricing, MOQ, lead time and packing details — typically within one working day.",
  },
  {
    step: "03",
    title: "Validate the material",
    body: "Certificate of Analysis and MSDS are shared for your QA review before dispatch. Where your process demands it, we arrange samples for trial.",
  },
  {
    step: "04",
    title: "Dispatch and follow-through",
    body: "Order is packed, documented and shipped with export paperwork in order. You get tracking, and a named contact who stays with the order until it lands.",
  },
] as const;

export const qualityCommitments = [
  {
    title: "Certificate of Analysis with every batch",
    body: "Batch-specific CoA covering assay, identification, purity and physical parameters accompanies each consignment, traceable back to the manufacturing lot.",
  },
  {
    title: "Material Safety Data Sheets",
    body: "MSDS supplied for every chemical we ship, so your EHS and warehousing teams can plan handling and storage before the truck arrives.",
  },
  {
    title: "Pharmacopoeial compliance",
    body: "Materials offered against IP, BP, USP, EP and JP monographs, with the applicable standard stated on the quotation rather than assumed.",
  },
  {
    title: "Drug Licence holder",
    body: "N R Life Care trades under a valid drug licence and GST registration (24ADVPN9611L2ZU), with statutory documentation available for customer due diligence.",
  },
  {
    title: "Supplier qualification",
    body: "Manufacturing partners are assessed on quality systems and consistency before onboarding, and reviewed on the strength of their delivered batches.",
  },
  {
    title: "Protective packing for transit",
    body: "Moisture barriers, sealed liners, tamper-evident drums and light-protected packing selected to suit the material and the length of the journey.",
  },
] as const;

export const timeline = [
  {
    year: "Before 2014",
    title: "Three decades in bulk pharma",
    body: "Jitendra Nakum spends over thirty years inside India's bulk drug trade, building direct working relationships with API and excipient manufacturers across Gujarat and beyond.",
  },
  {
    year: "2014",
    title: "N R Life Care is founded",
    body: "The firm is established in Ahmedabad as a proprietorship, supplying pharmaceutical raw materials to formulators who wanted a supplier that answered the phone.",
  },
  {
    year: "2016 – 2019",
    title: "The catalogue widens",
    body: "Excipients, vitamins, nutraceutical actives and food-grade ingredients are added alongside APIs, so a customer's whole bill of materials can come from one source.",
  },
  {
    year: "2020 – 2022",
    title: "Beyond pharma",
    body: "Demand from cosmetics, food and beverage, agro, paint, textile and industrial customers pushes the range past a thousand line items across seventeen industries.",
  },
  {
    year: "Today",
    title: "Supplying customers worldwide",
    body: "From the Odhav facility on Ahmedabad's S. P. Ring Road, N R Life Care ships pharmaceutical and specialty ingredients to buyers in India and overseas markets.",
  },
] as const;

export const values = [
  {
    title: "Say what the material is",
    body: "No inflated grades, no vague specifications. If a product is technical grade, we call it technical grade.",
  },
  {
    title: "Answer the phone",
    body: "A live person who knows your order, not a ticket queue. Most enquiries get a response the same working day.",
  },
  {
    title: "Earn the reorder",
    body: "We would rather hold a customer for ten years than win one order on a promise we cannot keep.",
  },
] as const;
