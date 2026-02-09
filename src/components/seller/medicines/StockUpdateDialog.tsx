/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { toast } from "sonner";
import { Loader2, PackagePlus } from "lucide-react";

import { clientFetch } from "@/lib/fetch/clientFetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export function StockUpdateDialog({
  medicineId,
  medicineName,
  currentStock,
  onSuccess,
}: {
  medicineId: string;
  medicineName: string;
  currentStock: number;
  onSuccess: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [stock, setStock] = React.useState<string>(String(currentStock ?? 0));

  React.useEffect(() => {
    if (open) setStock(String(currentStock ?? 0));
  }, [open, currentStock]);

  const handleSave = async () => {
    const next = Number(stock);

    if (Number.isNaN(next) || next < 0) {
      toast.error("Stock অবশ্যই 0 বা তার বেশি হতে হবে");
      return;
    }

    setSaving(true);
    try {
      const res = await clientFetch(`/api/medicines/${medicineId}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: next }),
      });

      if ((res as any).error) throw new Error((res as any).error.message);

      toast.success("Stock updated successfully!");
      setOpen(false);
      onSuccess();
    } catch (e: any) {
      toast.error(e?.message || "Failed to update stock");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PackagePlus className="mr-2 h-4 w-4" />
          Stock
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Stock</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Medicine: <span className="font-medium">{medicineName}</span>
          </p>

          <div className="grid gap-2">
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              inputMode="numeric"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="e.g. 50"
            />
            <p className="text-xs text-muted-foreground">
              0 দিলে out of stock হিসেবে ধরা যাবে।
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => setOpen(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            className="w-full sm:w-auto"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
