/**
 * Editorial metadata for each catalogue category.
 *
 * Product rows live in the CMS (Sanity) and are pulled into
 * products.generated.ts. Adding a category here makes its slug valid.
 */

export type CategoryMeta = {
  slug: string;
  name: string;
  short: string;
  tagline: string;
  description: string;
  applications: string[];
  packing: string;
};

export const categoryMeta: CategoryMeta[] = [
  {
    slug: "active-pharmaceutical-ingredients",
    name: "Active Pharmaceutical Ingredients",
    short: "APIs & Bulk Drugs",
    tagline: "The molecules that do the work",
    description:
      "Bulk drug substances across anti-infectives, cardiovascular, analgesic, anti-diabetic, dermatological and related classes. Supplied against IP, BP, USP and EP monographs with batch-specific Certificates of Analysis.",
    applications: [
      "Oral solid dosage manufacturing",
      "Injectables and sterile formulations",
      "Topical creams, gels and ointments",
      "Contract and third-party manufacturing",
    ],
    packing:
      "25 kg HDPE drums with double LDPE liner; 1 kg and 5 kg foil packs for actives requiring moisture protection.",
  },
  {
    slug: "antibiotic-powders",
    name: "Antibiotic Powders",
    short: "Antibiotics",
    tagline: "Antibacterial actives by class",
    description:
      "Antibiotic and antibacterial API powders arranged by class for formulators and bulk-drug manufacturers — including penicillins, cephalosporins, macrolides, fluoroquinolones and related actives.",
    applications: [
      "Oral antibiotic tablets and capsules",
      "Injectable antibiotic formulations",
      "Veterinary antibiotic preparations",
      "Contract manufacturing of anti-infectives",
    ],
    packing:
      "25 kg HDPE drums with double liner; sterile and non-sterile grades packed separately on request.",
  },
  {
    slug: "human-steroid-apis",
    name: "Human Steroid APIs",
    short: "Steroid APIs",
    tagline: "Hormonal and steroid actives",
    description:
      "Corticosteroids, sex hormones and related steroid APIs for licensed pharmaceutical manufacturers and qualified B2B buyers. Supplied with documentation support subject to applicable law and destination-country requirements.",
    applications: [
      "Corticosteroid tablets, injectables and topicals",
      "Hormonal therapy formulations",
      "Respiratory and ophthalmic steroid products",
      "Licensed pharmaceutical manufacturing only",
    ],
    packing:
      "1 kg to 25 kg HDPE drums or foil packs depending on potency and light/moisture sensitivity.",
  },
  {
    slug: "pharmaceutical-materials",
    name: "Pharmaceutical Materials",
    short: "Pharma Materials",
    tagline: "Supporting materials for formulation",
    description:
      "Pharmaceutical raw materials and supporting inputs used alongside APIs and excipients in solid, liquid and topical dosage manufacturing.",
    applications: [
      "Solid oral dosage manufacture",
      "Liquid and semi-solid formulations",
      "Coating and processing aids",
      "General pharmaceutical production",
    ],
    packing:
      "25 kg drums and bags; specialty materials in smaller packs on request.",
  },
  {
    slug: "pharmaceutical-excipients",
    name: "Pharmaceutical Excipients",
    short: "Excipients",
    tagline: "Everything around the active",
    description:
      "Binders, diluents, disintegrants, lubricants, coating systems, glidants and preservatives — the functional materials that decide whether a formulation compresses, dissolves and stays stable on the shelf.",
    applications: [
      "Tablet compression and granulation",
      "Capsule filling and pellet coating",
      "Suspensions, syrups and topical bases",
      "Sustained and delayed-release systems",
    ],
    packing:
      "25 kg paper-laminate bags and fibre drums; food and pharma grades packed separately.",
  },
  {
    slug: "pharmaceutical-intermediates",
    name: "API Intermediates",
    short: "Intermediates",
    tagline: "Building blocks for synthesis",
    description:
      "Advanced intermediates and key starting materials for API synthesis — supplied to bulk drug manufacturers and custom synthesis houses with specification sheets on request.",
    applications: [
      "API route development and scale-up",
      "Custom and contract synthesis",
      "Fine chemical manufacturing",
      "Agrochemical and specialty routes",
    ],
    packing:
      "25 kg / 50 kg HDPE drums; moisture- and light-sensitive intermediates packed under nitrogen where required.",
  },
  {
    slug: "food-and-agro-chemicals",
    name: "Food Ingredients & Raw Materials",
    short: "Food & Agro",
    tagline: "Food-grade, agro-ready",
    description:
      "Preservatives, acidulants, sweeteners, hydrocolloids, fortification inputs and related food raw materials meeting FSSAI and FCC requirements where applicable.",
    applications: [
      "Beverage, bakery and dairy processing",
      "Staple food fortification",
      "Sauces, seasonings and preserved foods",
      "Agro and crop-input formulations",
    ],
    packing:
      "25 kg / 50 kg food-grade bags and drums; liquids in barrels and IBC tanks.",
  },
  {
    slug: "nutraceutical-ingredients",
    name: "Nutraceutical Powders",
    short: "Nutraceuticals",
    tagline: "Actives for the wellness shelf",
    description:
      "Amino acids, proteins, botanical extracts, joint-health actives and functional powders for supplement brands, sports nutrition and functional food formulators.",
    applications: [
      "Sports and performance nutrition",
      "Dietary supplement tablets and gummies",
      "Functional beverages and food",
      "Beauty-from-within formulations",
    ],
    packing:
      "25 kg kraft bags with food-grade inner liner; proteins in 20–25 kg bulk sacks.",
  },
  {
    slug: "vitamins-and-minerals",
    name: "Vitamins",
    short: "Vitamins",
    tagline: "Micronutrients in bulk",
    description:
      "Water- and fat-soluble vitamins, related salts and premix inputs for pharmaceutical, nutraceutical, food and feed applications.",
    applications: [
      "Multivitamin tablets, capsules and syrups",
      "Food and staple fortification premixes",
      "Sports and clinical nutrition",
      "Animal feed vitamin premixes",
    ],
    packing:
      "25 kg fibre drums with aluminium liner for oxidation-sensitive vitamins; smaller packs available.",
  },
  {
    slug: "chemical-powders",
    name: "Chemical Powders",
    short: "Chemical Powders",
    tagline: "Powders for process and formulation",
    description:
      "Inorganic salts, pigment and coating powders, and specialty chemical powders for industrial, food-adjacent and process applications.",
    applications: [
      "General industrial processing",
      "Pigment and coating manufacture",
      "Water treatment and utility chemistry",
      "Food and cosmetic adjacent uses where graded",
    ],
    packing:
      "25 kg / 50 kg bags and drums depending on grade and volume.",
  },
  {
    slug: "industrial-and-specialty-chemicals",
    name: "Industrial Chemicals",
    short: "Industrial",
    tagline: "Process chemicals at scale",
    description:
      "Bulk alkalis, acids, solvents, surfactants, pigments and water-treatment chemicals for paint, ceramic, textile, paper, mining and related industries.",
    applications: [
      "Paint, ink, pigment and coating manufacture",
      "Textile processing and dyeing",
      "Water treatment and pool sanitation",
      "Oil field, mining and drilling chemistry",
    ],
    packing:
      "50 kg bags, 200 kg barrels, 1000 L IBC totes and tankers depending on volume.",
  },
  {
    slug: "organic-and-inorganic-chemicals",
    name: "Organic & Inorganic Chemicals",
    short: "Org. & Inorg.",
    tagline: "Broad chemical portfolio",
    description:
      "A wide range of organic and inorganic chemicals for manufacturing, water treatment, and food/pharma/cosmetic-grade inputs where specified.",
    applications: [
      "General chemical manufacturing",
      "Water treatment and utilities",
      "Food, pharma and cosmetic grade inputs",
      "Specialty organic synthesis support",
    ],
    packing:
      "Bags, drums and IBCs matched to hazard class and order size.",
  },
  {
    slug: "veterinary-and-feed-additives",
    name: "Veterinary & Feed Additives",
    short: "Vet & Feed",
    tagline: "Animal health and nutrition",
    description:
      "Veterinary actives, feed enzymes, choline and mineral inputs for animal health formulators, feed millers and premix manufacturers.",
    applications: [
      "Poultry and livestock feed premixes",
      "Veterinary formulations",
      "Aqua feed nutrition",
      "Farm hygiene inputs",
    ],
    packing:
      "25 kg bags and drums; liquids in barrels.",
  },
];
