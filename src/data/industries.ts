export type Industry = {
  name: string;
  blurb: string;
  supplies: string[];
};

export const industries: Industry[] = [
  {
    name: "Pharmaceutical Formulation",
    blurb:
      "Bulk drug substances and the full excipient stack behind them, so a formulation team can raise one purchase order instead of nine.",
    supplies: ["APIs & bulk drugs", "Excipients", "Intermediates", "Empty capsules"],
  },
  {
    name: "Nutraceuticals & Supplements",
    blurb:
      "Amino acids, proteins, joint actives and botanical extracts for brands building supplement, gummy and functional-beverage lines.",
    supplies: ["Whey & plant proteins", "Vitamins", "Herbal extracts", "Amino acids"],
  },
  {
    name: "Food, Beverage & Dairy",
    blurb:
      "FCC and FSSAI-compliant preservatives, acidulants, sweeteners and hydrocolloids for processors and fortification programmes.",
    supplies: ["Preservatives", "Sweeteners", "Hydrocolloids", "Fortification premixes"],
  },
  {
    name: "Cosmetics & Personal Care",
    blurb:
      "Actives, emulsifiers, thickeners and preservatives for skincare, haircare and colour cosmetics manufacturers.",
    supplies: ["Carbomers", "Preservatives", "Actives", "Clays & powders"],
  },
  {
    name: "Veterinary & Animal Feed",
    blurb:
      "Veterinary APIs, coccidiostats, feed enzymes and mineral inputs for animal health formulators and feed millers.",
    supplies: ["Vet APIs", "Feed enzymes", "Choline chloride", "Mineral phosphates"],
  },
  {
    name: "Agrochemicals & Agriculture",
    blurb:
      "Fertiliser inputs, micronutrients, soil conditioners and agro intermediates for crop-input manufacturers.",
    supplies: ["Fertiliser salts", "Micronutrients", "Humic acid", "Intermediates"],
  },
  {
    name: "Paint, Ink & Coatings",
    blurb:
      "Pigments, resins, anhydrides and solvents for decorative, industrial and protective coating manufacturers.",
    supplies: ["Titanium dioxide", "Pigments", "Anhydrides", "Solvents"],
  },
  {
    name: "Textile & Dyes",
    blurb:
      "Processing chemicals, surfactants, bleaching agents and dye intermediates for mills, processors and dye houses.",
    supplies: ["Surfactants", "Bleaching agents", "Alkalis", "Dye intermediates"],
  },
  {
    name: "Plastic, Rubber & Polymer",
    blurb:
      "Monomers, plasticiser feedstocks, antioxidants and fillers for polymer compounders and converters.",
    supplies: ["Adipic acid", "Phthalic anhydride", "BHT", "Fillers"],
  },
  {
    name: "Water Treatment & Sanitation",
    blurb:
      "Chlorination, oxidation and disinfection chemistry for municipal, industrial, pool and hygiene applications.",
    supplies: ["TCCA 90", "Bleaching powder", "Potassium permanganate", "Percarbonate"],
  },
  {
    name: "Oil, Gas & Mining",
    blurb:
      "Drilling-grade polymers, scavengers and process chemicals for field operations and mineral processing.",
    supplies: ["Oil-drilling xanthan", "H2S scavengers", "Glycols", "Process salts"],
  },
  {
    name: "Ceramic, Paper & Pulp",
    blurb:
      "Bulk alkalis, clays, binders and speciality additives for ceramic bodies, glazes and paper manufacturing lines.",
    supplies: ["Kaolin & bentonite", "Soda ash", "Binders", "Bleaching chemicals"],
  },
];
