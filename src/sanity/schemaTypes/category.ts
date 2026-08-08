import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
      description:
        "Must match a slug defined in the website code (src/data/categories.ts).",
    }),
    defineField({
      name: "short",
      title: "Short label",
      type: "string",
      description: "Shown on cards and breadcrumbs, e.g. “APIs & Bulk Drugs”.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
  },
});
