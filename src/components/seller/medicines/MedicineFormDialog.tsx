/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, Pencil } from "lucide-react";

import { clientFetch } from "@/lib/fetch/clientFetch";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import type { SellerMedicine } from "@/components/types/medicine";

type Mode = "create" | "edit";

type CategoryOption = { id: string; name: string };

type CategoriesApiResponse = {
  success: boolean;
  data: CategoryOption[];
};

type MedicineFormValues = {
  name: string;
  description: string;
  manufacturer: string;
  price: string;
  categoryId: string;
  discountPrice: string;
  dosageForm: string;
  strength: string;
  prescriptionRequired: boolean;
  imagesText: string; // Comma separated URLs
};

function joinImages(images?: string[] | null): string {
  if (!images?.length) return "";
  return images.join(", ");
}

function splitImages(text: string): string[] | undefined {
  const arr = text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter(
      (s) =>
        s.startsWith("http://") ||
        s.startsWith("https://") ||
        s.startsWith("/"),
    );

  return arr.length ? arr : undefined;
}

function toFormDefaults(initial?: any): MedicineFormValues {
  return {
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    manufacturer: initial?.manufacturer ?? "",
    price: initial?.price != null ? String(initial.price) : "",
    categoryId: initial?.categoryId ?? initial?.category?.id ?? "",
    discountPrice:
      initial?.discountPrice != null ? String(initial.discountPrice) : "",
    dosageForm: initial?.dosageForm ?? "",
    strength: initial?.strength ?? "",
    prescriptionRequired: Boolean(initial?.prescriptionRequired ?? false),
    imagesText: joinImages(initial?.images),
  };
}

export function MedicineFormDialog({
  mode,
  initial,
  onSuccess,
  trigger,
}: {
  mode: Mode;
  initial?:
    | (SellerMedicine & {
        description?: string | null;
        manufacturer?: string | null;
        discountPrice?: number | null;
        dosageForm?: string | null;
        strength?: string | null;
        prescriptionRequired?: boolean | null;
        images?: string[] | null;
        categoryId?: string;
      })
    | any;
  onSuccess: () => void;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [catLoading, setCatLoading] = useState(false);

  const isEdit = mode === "edit";
  const title = isEdit ? "Edit Medicine" : "Add Medicine";

  const [form, setForm] = useState<MedicineFormValues>(() =>
    toFormDefaults(initial),
  );

  // Reset form when dialog opens or initial data changes
  useEffect(() => {
    if (open) setForm(toFormDefaults(initial));
  }, [open, initial]);

  /**
   * Client-side validation logic
   */
  const canSubmit = useMemo(() => {
    if (!form.name.trim()) return false;
    if (!form.description.trim()) return false;
    if (!form.manufacturer.trim()) return false;
    if (!form.categoryId.trim()) return false;

    const price = Number(form.price);
    if (!form.price.trim() || Number.isNaN(price) || price <= 0) return false;

    if (form.discountPrice.trim()) {
      const d = Number(form.discountPrice);
      if (Number.isNaN(d) || d <= 0) return false;
      if (d >= price) return false; // Discount must be less than price
    }

    return true;
  }, [form]);

  const loadCategories = async () => {
    setCatLoading(true);
    try {
      const res = await clientFetch<CategoriesApiResponse>("/api/categories", {
        method: "GET",
      });
      if (res.error) throw new Error(res.error.message);

      const list = res.data?.data ?? [];
      setCategories(Array.isArray(list) ? list : []);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load categories");
      setCategories([]);
    } finally {
      setCatLoading(false);
    }
  };

  useEffect(() => {
    if (open) loadCategories();
  }, [open]);

  const onChange = (key: keyof MedicineFormValues, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error(
        "Please fill required fields correctly (Discount price must be less than price).",
      );
      return;
    }

    const payload: any = {
      name: form.name.trim(),
      description: form.description.trim(),
      manufacturer: form.manufacturer.trim(),
      price: Number(form.price),
      categoryId: form.categoryId,
      prescriptionRequired: Boolean(form.prescriptionRequired),
    };

    if (form.discountPrice.trim())
      payload.discountPrice = Number(form.discountPrice);
    if (form.dosageForm.trim()) payload.dosageForm = form.dosageForm.trim();
    if (form.strength.trim()) payload.strength = form.strength.trim();

    const imagesArr = splitImages(form.imagesText);
    if (imagesArr) payload.images = imagesArr;

    setSaving(true);
    try {
      if (isEdit) {
        const id = initial?.id;
        if (!id) throw new Error("Medicine ID missing");

        const res = await clientFetch(`/api/medicines/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if ((res as any).error) throw new Error((res as any).error.message);
        toast.success("Medicine updated successfully!");
      } else {
        const res = await clientFetch(`/api/medicines`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if ((res as any).error) throw new Error((res as any).error.message);
        toast.success("Medicine created successfully!");
      }

      setOpen(false);
      onSuccess();
    } catch (e: any) {
      toast.error(e?.message || "Failed to save medicine");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : isEdit ? (
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Button>
        ) : (
          <Button size="sm">Add Medicine</Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="e.g. Napa Extra"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="manufacturer">Manufacturer *</Label>
            <Input
              id="manufacturer"
              value={form.manufacturer}
              onChange={(e) => onChange("manufacturer", e.target.value)}
              placeholder="e.g. Beximco Pharmaceuticals"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={form.categoryId}
              onValueChange={(v) => onChange("categoryId", v)}
              disabled={catLoading}
            >
              <SelectTrigger id="category">
                <SelectValue
                  placeholder={catLoading ? "Loading..." : "Select a category"}
                />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder="Enter detailed medicine description..."
              className="min-h-[110px]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                inputMode="decimal"
                value={form.price}
                onChange={(e) => onChange("price", e.target.value)}
                placeholder="e.g. 30"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="discountPrice">Discount Price (Optional)</Label>
              <Input
                id="discountPrice"
                type="number"
                inputMode="decimal"
                value={form.discountPrice}
                onChange={(e) => onChange("discountPrice", e.target.value)}
                placeholder="e.g. 25"
              />
              <p className="text-xs text-muted-foreground">
                Discount price must be less than the original price.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="dosageForm">Dosage Form (Optional)</Label>
              <Input
                id="dosageForm"
                value={form.dosageForm}
                onChange={(e) => onChange("dosageForm", e.target.value)}
                placeholder="e.g. Tablet / Syrup / Injection"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="strength">Strength (Optional)</Label>
              <Input
                id="strength"
                value={form.strength}
                onChange={(e) => onChange("strength", e.target.value)}
                placeholder="e.g. 500mg / 5ml"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border p-3">
            <Checkbox
              checked={form.prescriptionRequired}
              onCheckedChange={(v: any) =>
                onChange("prescriptionRequired", Boolean(v))
              }
              id="prescriptionRequired"
            />
            <Label
              htmlFor="prescriptionRequired"
              className="cursor-pointer font-medium"
            >
              Is a prescription required for this medicine?
            </Label>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="images">Images (Optional)</Label>
            <Textarea
              id="images"
              value={form.imagesText}
              onChange={(e) => onChange("imagesText", e.target.value)}
              placeholder="Paste image URLs separated by commas"
              className="min-h-[80px]"
            />
            <p className="text-xs text-muted-foreground">
              Example: https://example.com/img1.jpg,
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={saving || !canSubmit}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
