/**
 * Star-list products that are not yet in the PDF/Sanity catalogue dump.
 * Merged in catalog.ts so a cms:pull of products.generated.ts cannot drop them.
 */
import type { ProductRow } from "./products.generated";

export const starProductAdditions: ProductRow[] = [
  { category: "human-steroid-apis", name: "Drostanolone Propionate" },
  {
    category: "human-steroid-apis",
    name: "Trenbolone Hexahydrobenzyl Carbonate",
  },
  { category: "human-steroid-apis", name: "Trenbolone Acetate" },
  { category: "human-steroid-apis", name: "Trenbolone Enanthate" },
  { category: "human-steroid-apis", name: "Testosterone Suspension" },
  { category: "human-steroid-apis", name: "Testosterone Acetate" },
  { category: "human-steroid-apis", name: "Testosterone Decanoate" },
  { category: "human-steroid-apis", name: "Testosterone Phenylpropionate" },
  { category: "human-steroid-apis", name: "Testosterone Isocaproate" },
  { category: "human-steroid-apis", name: "Betamethasone Valerate" },
  { category: "human-steroid-apis", name: "Betamethasone Sodium Phosphate" },

  {
    category: "active-pharmaceutical-ingredients",
    name: "Clenbuterol Hydrochloride",
  },
  { category: "active-pharmaceutical-ingredients", name: "Dutasteride" },
  { category: "active-pharmaceutical-ingredients", name: "Letrozole" },
  { category: "active-pharmaceutical-ingredients", name: "Carboplatin" },
  { category: "active-pharmaceutical-ingredients", name: "Anastrozole" },
  { category: "active-pharmaceutical-ingredients", name: "Pregabalin" },
  {
    category: "active-pharmaceutical-ingredients",
    name: "Cyproheptadine Hydrochloride",
  },
  { category: "active-pharmaceutical-ingredients", name: "Telmisartan" },
  { category: "active-pharmaceutical-ingredients", name: "Tadalafil" },
  {
    category: "active-pharmaceutical-ingredients",
    name: "Metformin Hydrochloride",
  },
  { category: "active-pharmaceutical-ingredients", name: "Artemether" },
  { category: "active-pharmaceutical-ingredients", name: "Lumefantrine" },
  { category: "active-pharmaceutical-ingredients", name: "Quinine Sulphate" },
  {
    category: "active-pharmaceutical-ingredients",
    name: "Chloroquine Phosphate",
  },
  { category: "active-pharmaceutical-ingredients", name: "Empagliflozin" },
  { category: "active-pharmaceutical-ingredients", name: "Sitagliptin" },
  { category: "active-pharmaceutical-ingredients", name: "Sucralfate" },
  { category: "active-pharmaceutical-ingredients", name: "Itraconazole" },
  { category: "active-pharmaceutical-ingredients", name: "Voriconazole" },
  {
    category: "active-pharmaceutical-ingredients",
    name: "Sildenafil Citrate",
  },
  {
    category: "active-pharmaceutical-ingredients",
    name: "Ondansetron Hydrochloride",
  },
  { category: "active-pharmaceutical-ingredients", name: "Domperidone" },
  { category: "active-pharmaceutical-ingredients", name: "Apixaban" },
  { category: "active-pharmaceutical-ingredients", name: "Acyclovir" },

  { category: "antibiotic-powders", name: "Cefixime" },
  { category: "antibiotic-powders", name: "Cefixime Trihydrate" },
  { category: "antibiotic-powders", name: "Ceftriaxone Sodium" },

  {
    category: "vitamins-and-minerals",
    name: "Cholecalciferol",
    use: "Vitamin D3",
  },
  { category: "nutraceutical-ingredients", name: "Caffeine Anhydrous" },
  { category: "nutraceutical-ingredients", name: "Natural Caffeine" },
  {
    category: "nutraceutical-ingredients",
    name: "Whey Protein Concentrate 80",
  },
  { category: "nutraceutical-ingredients", name: "Benfotiamine" },

  { category: "pharmaceutical-excipients", name: "Povidone K-25" },
];
