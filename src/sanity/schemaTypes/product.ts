import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "media", title: "Photo" },
    { name: "homepage", title: "Homepage" },
  ],
  // Delete lives in the document Actions menu (⋯ next to Publish):
  // “Delete product”. After deleting, run the catalogue pull so the site updates.
  fields: [
    defineField({
      name: "name",
      title: "Product name",
      type: "string",
      group: "details",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "details",
      options: { source: "name", maxLength: 120 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      group: "details",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cas",
      title: "CAS number",
      type: "string",
      group: "details",
      description: "Optional. Format like 103-90-2. Set the cell as plain text.",
    }),
    defineField({
      name: "grade",
      title: "Grade",
      type: "string",
      group: "details",
      description: "e.g. IP / BP / USP",
    }),
    defineField({
      name: "use",
      title: "Typical use",
      type: "string",
      group: "details",
      description: "Short phrase, e.g. Analgesic, antipyretic",
    }),
    defineField({
      name: "image",
      title: "Product photo",
      type: "image",
      group: "media",
      options: { hotspot: true },
      description: "Optional. Upload one clear photo of the product or packing.",
    }),
    defineField({
      name: "featured",
      title: "Show on homepage",
      type: "boolean",
      group: "homepage",
      initialValue: false,
      description:
        "Turn this ON, then Publish. Only products with this on appear under “What buyers order most”.",
    }),
    defineField({
      name: "featuredOrder",
      title: "Homepage order",
      type: "number",
      group: "homepage",
      description: "Lower numbers appear first (1, then 2, …).",
      hidden: ({ document }) => !document?.featured,
      validation: (rule) =>
        rule.custom((value, context) => {
          const featured = Boolean(
            (context.document as { featured?: boolean } | undefined)?.featured,
          );
          if (!featured) return true;
          if (value === undefined || value === null) return true;
          if (typeof value === "number" && value >= 1) return true;
          return "Use 1 or higher";
        }),
    }),
  ],
  orderings: [
    {
      title: "Name",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
    {
      title: "Featured first",
      name: "featuredFirst",
      by: [
        { field: "featured", direction: "desc" },
        { field: "featuredOrder", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category.title",
      media: "image",
      featured: "featured",
    },
    prepare({ title, subtitle, media, featured }) {
      return {
        title: featured ? `★ ${title}` : title,
        subtitle,
        media,
      };
    },
  },
});
