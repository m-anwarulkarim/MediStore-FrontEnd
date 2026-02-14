"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
import { clientFetch } from "@/lib/fetch/clientFetch";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteCategoryDialog({
  categoryId,
  categoryName,
  onSuccess,
}: {
  categoryId: string;
  categoryName: string;
  onSuccess: () => void;
}) {
  const onDelete = async () => {
    try {
      const res = await clientFetch(`api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (res.error) {
        //  Show backend message
        throw new Error(res.error.message);
      }

      toast.success("Category deleted");
      onSuccess();
    } catch (e: any) {
      toast.error(
        e?.message || "Cannot delete category. It contains linked medicines.",
      );
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete category?</AlertDialogTitle>
          <AlertDialogDescription>
            “{categoryName}” cannot be restored once deleted.
            <br />
            If this category contains medicines, you must remove/transfer them
            first.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Yes, delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
