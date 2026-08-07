/**
 * Editorial metadata for each catalogue category.
 *
 * Products themselves live in the Google Sheet and are generated into
 * products.generated.ts — this file holds the prose that rarely changes.
 * Adding a category here makes its slug valid in the sheet.
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
      "Bulk drug substances across anti-infectives, cardiovascular, analgesic, anti-diabetic, dermatological and hormone therapy classes. Supplied against IP, BP, USP and EP monographs with batch-specific Certificates of Analysis, in quantities from trial lots through scheduled bulk contracts.",
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
    slug: "pharmaceutical-excipients",
    name: "Pharmaceutical Excipients",
    short: "Excipients",
    tagline: "Everything around the active",
    description:
      "Binders, diluents, disintegrants, lubricants, coating systems, glidants and preservatives — the functional materials that decide whether a formulation compresses, dissolves and stays stable on the shelf. Multi-compendial grades supplied with full documentation.",
    applications: [
      "Tablet compression and granulation",
      "Capsule filling and pellet coating",
      "Suspensions, syrups and topical bases",
      "Sustained and delayed-release systems",
    ],
    packing:
      "25 kg paper-laminate bags and fibre drums; food and pharma grades packed separately to prevent cross-contact.",
  },
  {
    slug: "pharmaceutical-intermediates",
    name: "Pharmaceutical Intermediates",
    short: "Intermediates",
    tagline: "Building blocks for synthesis",
    description:
      "Advanced intermediates and key starting materials for API synthesis — including sartan, gliptin, gliflozin, coxib and cephalosporin routes. Supplied to bulk drug manufacturers and custom synthesis houses with specification sheets and route documentation on request.",
    applications: [
      "API route development and scale-up",
      "Custom and contract synthesis",
      "Agrochemical and dye intermediates",
      "Fine chemical manufacturing",
    ],
    packing:
      "25 kg / 50 kg HDPE drums; moisture- and light-sensitive intermediates packed under nitrogen where required.",
  },
  {
    slug: "vitamins-and-minerals",
    name: "Vitamins & Minerals",
    short: "Vitamins",
    tagline: "Micronutrients in bulk",
    description:
      "Water- and fat-soluble vitamins, mineral salts and amino acid chelates for pharmaceutical formulations, dietary supplements, fortified foods and premixes. Available in plain, coated, oily and cold water dispersible forms depending on the application.",
    applications: [
      "Multivitamin tablets, capsules and syrups",
      "Food and staple fortification premixes",
      "Sports and clinical nutrition",
      "Animal feed and veterinary premixes",
    ],
    packing:
      "25 kg fibre drums with aluminium liner for oxidation-sensitive vitamins; 5 kg and 1 kg packs available.",
  },
  {
    slug: "nutraceutical-ingredients",
    name: "Nutraceutical Ingredients",
    short: "Nutraceuticals",
    tagline: "Actives for the wellness shelf",
    description:
      "Amino acids, proteins, botanical extracts, joint-health actives and functional carbohydrates for supplement brands, sports nutrition manufacturers and functional food formulators. Supplied with specification, CoA and origin documentation.",
    applications: [
      "Sports and performance nutrition",
      "Dietary supplement tablets and gummies",
      "Functional beverages and food",
      "Cosmeceutical and beauty-from-within",
    ],
    packing:
      "25 kg kraft bags with food-grade inner liner; protein powders in 20 kg / 25 kg bulk sacks.",
  },
  {
    slug: "food-and-agro-chemicals",
    name: "Food & Agro Chemicals",
    short: "Food & Agro",
    tagline: "Food-grade, agro-ready",
    description:
      "Preservatives, acidulants, sweeteners, hydrocolloids, fortification premixes and agricultural inputs meeting FSSAI and FCC requirements. Supplied to food processors, beverage manufacturers, dairies and agro-input formulators.",
    applications: [
      "Beverage, bakery and dairy processing",
      "Staple food fortification programmes",
      "Sauces, seasonings and preserved foods",
      "Crop nutrition and agro formulations",
    ],
    packing:
      "25 kg / 50 kg food-grade bags and drums; liquid grades in 200 kg HDPE barrels and IBC tanks.",
  },
  {
    slug: "industrial-and-specialty-chemicals",
    name: "Industrial & Specialty Chemicals",
    short: "Industrial",
    tagline: "Process chemicals at scale",
    description:
      "Bulk alkalis, acids, solvents, surfactants, pigments and water-treatment chemicals for paint, ceramic, plastic, rubber, textile, dye, paper, mining and oil & gas customers. Available in bags, drums, barrels and tanker loads.",
    applications: [
      "Paint, ink, pigment and coating manufacture",
      "Textile processing, dyeing and printing",
      "Water treatment and pool sanitation",
      "Oil field, mining and drilling chemistry",
    ],
    packing:
      "50 kg bags, 200 kg barrels, 1000 L IBC totes and road tankers depending on volume and grade.",
  },
  {
    slug: "veterinary-and-feed-additives",
    name: "Veterinary & Feed Additives",
    short: "Vet & Feed",
    tagline: "Animal health and nutrition",
    description:
      "Veterinary actives, coccidiostats, antiparasitics, feed enzymes, choline chloride and mineral feed inputs for animal health formulators, feed millers and premix manufacturers across poultry, dairy, aqua and livestock.",
    applications: [
      "Poultry and livestock feed premixes",
      "Veterinary bolus, injectable and oral formulations",
      "Aqua feed and hatchery nutrition",
      "Farm hygiene and biosecurity",
    ],
    packing:
      "25 kg bags and drums; liquid choline and enzymes in 250 kg barrels.",
  },
];
