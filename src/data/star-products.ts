/**
 * Star products — ordered from the proprietor’s list
 * (“STAR PRODUCTS OF NR LIFE CARE.docx”).
 *
 * Drives the homepage hero panel and /star-products.
 * Independent of Sanity’s “Show on homepage” checkbox (that powers
 * the homepage featured grid further down the page).
 */

export const STAR_PRODUCT_NAMES = [
  "Nandrolone Decanoate",
  "Boldenone Undecylenate",
  "Drostanolone Propionate",
  "Nandrolone Phenylpropionate",
  "Trenbolone Hexahydrobenzyl Carbonate",
  "Methenolone Enanthate",
  "Testosterone Cypionate",
  "Testosterone Enanthate",
  "Testosterone Propionate",
  "Testosterone Suspension",
  "Trenbolone Acetate",
  "Trenbolone Enanthate",
  "Stanozolol",
  "Clenbuterol Hydrochloride",
  "Methandienone",
  "Oxandrolone",
  "Testosterone Acetate",
  "Testosterone Decanoate",
  "Testosterone Phenylpropionate",
  "Testosterone Isocaproate",
  "Methyltestosterone",
  "Dutasteride",
  "Clobetasol Propionate",
  "Letrozole",
  "Progesterone",
  "Methylprednisolone",
  "Betamethasone Valerate",
  "Betamethasone Sodium Phosphate",
  "Carboplatin",
  "Dydrogesterone",
  "Oxymetholone",
  "Vitamin D3",
  "Anastrozole",
  "Azithromycin",
  "Erythromycin Stearate",
  "Caffeine Anhydrous",
  "Natural Caffeine",
  "Aceclofenac",
  "Pregabalin",
  "Paracetamol",
  "Xanthan Gum",
  "Cefixime",
  "Ethyl Cellulose",
  "Cyproheptadine Hydrochloride",
  "Povidone K-25",
  "Montelukast Sodium",
  "Telmisartan",
  "Tadalafil",
  "Ibuprofen",
  "Amoxicillin Trihydrate",
  "Omeprazole",
  "Metformin Hydrochloride",
  "Whey Protein Concentrate 80",
  "Benfotiamine",
  "Trimethoprim",
  "Artemether",
  "Lumefantrine",
  "Sodium Stearyl Fumarate",
  "Quinine Sulphate",
  "Clindamycin Hydrochloride",
  "Chloroquine Phosphate",
  "Cefixime Trihydrate",
  "Ciprofloxacin",
  "Empagliflozin",
  "Atorvastatin Calcium",
  "Sitagliptin",
  "Rosuvastatin Calcium",
  "Aspirin",
  "Ceftriaxone Sodium",
  "Levofloxacin",
  "Ofloxacin",
  "Pantoprazole Sodium",
  "Esomeprazole Magnesium",
  "Rabeprazole Sodium",
  "Sucralfate",
  "Gabapentin",
  "Diclofenac Sodium",
  "Etoricoxib",
  "Fluconazole",
  "Clotrimazole",
  "Ketoconazole",
  "Itraconazole",
  "Voriconazole",
  "Cetirizine Dihydrochloride",
  "Ambroxol Hydrochloride",
  "Ascorbic Acid",
  "Vitamin B12",
  "Folic Acid",
  "Sildenafil Citrate",
  "Albendazole",
  "Benzoyl Peroxide",
  "Ondansetron Hydrochloride",
  "Domperidone",
  "Acyclovir",
  "Apixaban",
] as const;

/** How many star products to lead with on the homepage. */
export const HOMEPAGE_STAR_COUNT = 9;

/** Normalise a product name for fuzzy matching. */
export function normaliseProductName(value: string) {
  let s = value.toLowerCase();
  s = s
    .replace(/hydrochloride/g, "hcl")
    .replace(/sulphate/g, "sulfate");
  s = s.replace(/[^a-z0-9]+/g, "");
  for (const suffix of ["uspip", "usp", "bp", "ip", "ep", "fcc"]) {
    if (s.endsWith(suffix) && s.length > suffix.length + 3) {
      s = s.slice(0, -suffix.length);
    }
  }
  return s;
}

/**
 * Map alternate spellings from the Word doc / trade names onto catalogue keys.
 * Both sides should be compared after {@link normaliseProductName}.
 */
export const STAR_NAME_ALIASES: Record<string, string> = {
  methandione: "methandienone",
  metandienone: "methandienone",
  projesterone: "progesterone",
  ehtylcellulose: "ethylcellulose",
  pvpk25: "povidonek25",
  wpc80: "wheyproteinconcentrate80",
  benfortiamine: "benfotiamine",
  trimethoprime: "trimethoprimpowder",
  trimethoprim: "trimethoprimpowder",
  lumrfrnatrine: "lumefantrine",
  clindamycinehcl: "clindamycinhcl",
  amoxicilintrihydrate: "amoxicillintrihydrate",
  ceffiximetrihydratecompacted: "cefiximetrihydrate",
  sipagliptin: "sitagliptin",
  atarvastotincalcium: "atorvastatincalcium",
  aspirn: "aspirin",
  ceftriafonesodium: "ceftriaxonesodium",
  siprofloxacin: "ciprofloxacinhcl",
  ciprofloxacin: "ciprofloxacinhcl",
  etoricofid: "etoricoxib",
  paracetamolbp: "paracetamol",
  stanozololusp: "stanozolol",
  clenbuterol: "clenbuterolhcl",
  methyltestosterone: "methyltestosterone",
  vitamind3: "cholecalciferol",
  vitaminb12: "methylcobalamin",
  methylprednisolonebase: "methylprednisolone",
  levofloxacin: "levofloxacinhemihydrate",
  metforminhcl: "metforminhcl",
  metforminhydrochloride: "metforminhcl",
};
