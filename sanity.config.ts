import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { deleteProductAction } from "./src/sanity/actions/deleteProductAction";
import { schemaTypes } from "./src/sanity/schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "nrlifecare",
  title: "N R Life Care",
  projectId: projectId || "placeholder",
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Catalogue")
          .items([
            S.documentTypeListItem("product").title("Products"),
            S.documentTypeListItem("category").title("Categories"),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
  document: {
    actions: (prev, { schemaType }) => {
      if (schemaType !== "product") return prev;

      // Replace the built-in Delete with a clearer “Delete product” action,
      // and keep it near the top of the Actions menu (right after Publish).
      const withoutDelete = prev.filter((action) => action.action !== "delete");
      const publish = withoutDelete.find((action) => action.action === "publish");
      const rest = withoutDelete.filter((action) => action.action !== "publish");

      return [publish, deleteProductAction, ...rest].filter(
        (action): action is NonNullable<typeof action> => Boolean(action),
      );
    },
  },
});
