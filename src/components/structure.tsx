import Image from "next/image";

import { structureSlugs } from "@/data/structures.generated";

type StructureProps = {
  /** Product slug, as produced by slugify() in data/catalog. */
  slug: string;
  name: string;
  className?: string;
  /** Rendered edge length in pixels. Diagrams are square. */
  size?: number;
  priority?: boolean;
};

export function hasStructure(slug: string) {
  return structureSlugs.has(slug);
}

/**
 * A 2D chemical structure diagram, drawn as white line art on transparency so
 * it can be tinted by the surrounding text colour.
 *
 * Diagrams come from PubChem and are factual rather than decorative — unlike
 * stock imagery there is nothing here that misrepresents what actually ships.
 * Polymers, minerals and biologics have no single structure, so callers must
 * check hasStructure() and provide their own fallback.
 */
export function Structure({
  slug,
  name,
  className = "",
  size = 240,
  priority = false,
}: StructureProps) {
  if (!hasStructure(slug)) return null;

  return (
    <Image
      src={`/structures/${slug}.png`}
      alt={name ? `Chemical structure of ${name}` : ""}
      width={size}
      height={size}
      priority={priority}
      className={className}
      // These are ~6 KB of sparse line art already sized for display. Running
      // them through the optimiser saves nothing and re-encoding to AVIF has
      // been observed to smear the alpha channel into a visible grey box.
      unoptimized
    />
  );
}
