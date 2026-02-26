/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, PlusCircle, AlertCircle } from "lucide-react";

import { clientFetch } from "@/lib/fetch/clientFetch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
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
import { ScrollArea } from "@/components/ui/scroll-area";

import type { SellerMedicine } from "@/components/types/medicine";

// --- Types & Interfaces ---
type Mode = "create" | "edit";

interface CategoryOption {
  id: string;
  name: string;
}

interface CategoriesApiResponse {
  success: boolean;
  data: CategoryOption[];
}

interface MedicineFormValues {
  name: string;
  description: string;
  manufacturer: string;
  price: string;
  categoryId: string;
  discountPrice: string;
  dosageForm: string;
  strength: string;
  prescriptionRequired: boolean;
  imagesText: string;
}

interface MedicineFormProps {
  mode: Mode;
  initial?: Partial<SellerMedicine> & { categoryId?: string };
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

// --- Helper Functions ---
const joinImages = (images?: string[] | null): string => images?.join(", ") ?? "";

const splitImages = (text: string): string[] | undefined => {
  const urls = text
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s && (s.startsWith("http") || s.startsWith("/")));
  return urls.length > 0 ? urls : undefined;
};

const getInitialValues = (initial?: any): MedicineFormValues => ({
  name: initial?.name ?? "",
  description: initial?.description ?? "",
  manufacturer: initial?.manufacturer ?? "",
  price: initial?.price != null ? String(initial.price) : "",
  categoryId: initial?.categoryId ?? initial?.category?.id ?? "",
  discountPrice: initial?.discountPrice != null ? String(initial.discountPrice) : "",
  dosageForm: initial?.dosageForm ?? "",
  strength: initial?.strength ?? "",
  prescriptionRequired: !!initial?.prescriptionRequired,
  imagesText: joinImages(initial?.images),
});

// --- Main Component ---
export function MedicineFormDialog({
  mode,
  initial,
  onSuccess,
  trigger,
}: MedicineFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [fetchingCategories, setFetchingCategories] = useState(false);
  const [form, setForm] = useState<MedicineFormValues>(() => getInitialValues(initial));

  const isEdit = mode === "edit";

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setForm(getInitialValues(initial));
      loadCategories();
    }
  }, [open, initial]);

  const loadCategories = async () => {
    setFetchingCategories(true);
    try {
      const res = await clientFetch<CategoriesApiResponse>("api/categories");
      if (res.error) throw new Error(res.error.message);
      setCategories(res.data?.data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to load categories");
    } finally {
      setFetchingCategories(false);
    }
  };

  const handleInputChange = useCallback((key: keyof MedicineFormValues, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const validation = useMemo(() => {
    const p = Number(form.price);
    const d = Number(form.discountPrice);

    const errors: string[] = [];
    if (!form.name.trim()) errors.push("Name is required");
    if (!form.categoryId) errors.push("Category is required");
    if (isNaN(p) || p <= 0) errors.push("Valid price is required");
    if (form.discountPrice && (isNaN(d) || d >= p)) {
      errors.push("Discount price must be lower than original price");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [form]);

  const handleSubmit = async () => {
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
        images: splitImages(form.imagesText),
      };

      const endpoint = isEdit ? `/pi/medicines/${initial?.id}` : `api/medicines`;
      const method = isEdit ? "PUT" : "POST";

      const res = await clientFetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if ((res as any).error) throw new Error((res as any).error.message);

      toast.success(isEdit ? "Medicine updated!" : "Medicine added!");
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={isEdit ? "outline" : "default"} size="sm" className="gap-2">
            {isEdit ? <Pencil className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
            {isEdit ? "Edit" : "Add Medicine"}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold">
            {isEdit ? "Update Medicine Details" : "Register New Medicine"}
          </DialogTitle>
          <DialogDescription>
            Fill in the information below. Fields marked with (*) are mandatory.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh] px-6 py-4">
          <div className="grid gap-6 py-2">
            {/* Basic Info Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Medicine Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g. Napa Extra"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={form.categoryId}
                  onValueChange={(v) => handleInputChange("categoryId", v)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder={fetchingCategories ? "Loading..." : "Select Category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer *</Label>
              <Input
                id="manufacturer"
                value={form.manufacturer}
                onChange={(e) => handleInputChange("manufacturer", e.target.value)}
                placeholder="Square Pharmaceuticals Ltd."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Product Description *</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe usage, side effects, etc."
                className="resize-none h-24"
              />
            </div>

            {/* Pricing Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="price">Base Price *</Label>
                <Input
                  id="price"
                  type="number"
                  value={form.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountPrice">Discount Price</Label>
                <Input
                  id="discountPrice"
                  type="number"
                  value={form.discountPrice}
                  onChange={(e) => handleInputChange("discountPrice", e.target.value)}
                  placeholder="Optional"
                />
              </div>
            </div>

            {/* Details Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dosageForm">Dosage Form</Label>
                <Input
                  id="dosageForm"
                  value={form.dosageForm}
                  onChange={(e) => handleInputChange("dosageForm", e.target.value)}
                  placeholder="Tablet, Syrup, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="strength">Strength</Label>
                <Input
                  id="strength"
                  value={form.strength}
                  onChange={(e) => handleInputChange("strength", e.target.value)}
                  placeholder="500mg"
                />
              </div>
            </div>

            {/* Config Group */}
            <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <Checkbox
                id="prescriptionRequired"
                checked={form.prescriptionRequired}
                onCheckedChange={(checked) => handleInputChange("prescriptionRequired", !!checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="prescriptionRequired" className="text-sm font-medium leading-none cursor-pointer">
                  Prescription Required
                </Label>
                <p className="text-xs text-muted-foreground">
                  Customers must upload a prescription to purchase this item.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">Image URLs (Comma separated)</Label>
              <Textarea
                id="images"
                value={form.imagesText}
                onChange={(e) => handleInputChange("imagesText", e.target.value)}
                placeholder="https://img1.jpg, https://img2.jpg"
                className="h-20"
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-2 bg-muted/20">
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !validation.isValid}
            className="min-w-[120px]"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isEdit ? "Save Changes" : "Create Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}