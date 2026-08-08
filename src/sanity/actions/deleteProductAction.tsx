"use client";

import { useCallback, useState } from "react";
import { TrashIcon } from "@sanity/icons";
import { useDocumentOperation, type DocumentActionComponent } from "sanity";

/**
 * Prominent delete action for products — dad/employees should not have to
 * hunt through an overflow menu labelled only “Delete”.
 */
export const deleteProductAction: DocumentActionComponent = (props) => {
  const { id, type, onComplete } = props;
  const { delete: deleteOp } = useDocumentOperation(id, type);
  const [dialogOpen, setDialogOpen] = useState(false);

  const onConfirm = useCallback(() => {
    deleteOp.execute();
    setDialogOpen(false);
    onComplete();
  }, [deleteOp, onComplete]);

  if (type !== "product") return null;

  return {
    label: "Delete product",
    icon: TrashIcon,
    tone: "critical",
    disabled: Boolean(deleteOp.disabled),
    title: deleteOp.disabled
      ? "Publish or discard changes before deleting, or check you have delete permission."
      : "Permanently remove this product from the CMS",
    onHandle: () => setDialogOpen(true),
    dialog: dialogOpen
      ? {
          type: "confirm",
          tone: "critical",
          message:
            "Delete this product permanently from Sanity? After the next catalogue pull it will also disappear from the website.",
          onCancel: () => {
            setDialogOpen(false);
            onComplete();
          },
          onConfirm,
        }
      : undefined,
  };
};

// Marks this as the delete action so Studio treats it as the built-in slot.
deleteProductAction.action = "delete";
