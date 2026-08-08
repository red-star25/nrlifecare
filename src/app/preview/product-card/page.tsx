import { ProductMarketingCard } from "@/components/products/product-marketing-card";

/**
 * Temporary visual preview — not linked from the public nav.
 * Open /preview/product-card to review the marketing card before rollout.
 */
export default function ProductCardPreviewPage() {
  return (
    <div className="min-h-screen bg-sand-100 px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-xl">
        <p className="text-center text-[12px] font-semibold tracking-[0.16em] text-brand-700 uppercase">
          Preview only
        </p>
        <h1 className="mt-2 text-center font-display text-2xl font-bold text-ink-900">
          Product marketing card
        </h1>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-sand-600">
          Sample using Trenbolone Acetate — this is the fallback when a real
          product photo has not been uploaded yet.
        </p>

        <div className="mx-auto mt-10 max-w-[420px]">
          <ProductMarketingCard
            name="Trenbolone Acetate"
            categoryLabel="Premium quality human steroid"
            cas="10161-34-9"
            grade="USP / EP"
          />
        </div>
      </div>
    </div>
  );
}
