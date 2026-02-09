/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

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

export function DeleteMedicineDialog({
  medicineId,
  medicineName,
  onSuccess,
}: {
  medicineId: string;
  medicineName: string;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await clientFetch(`/api/medicines/${medicineId}`, {
        method: "DELETE",
      });

      if ((res as any).error) throw new Error((res as any).error.message);

      toast.success("Medicine deleted successfully!");
      onSuccess();
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete medicine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={loading}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete medicine?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium">{medicineName}</span> medicine? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
