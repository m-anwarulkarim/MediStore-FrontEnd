/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import type { Address } from "../types/api/address";
import { addressApi } from "@/actions/address.service";

type Props = {
  children: React.ReactNode;
  mode: "create" | "edit";
  initialValue?: Address;
  onCreated?: (a: Address) => void;
  onUpdated?: (a: Address) => void;
};

type FormState = {
  fullName: string;
  phone: string;
  city: string;
  area: string;
  postalCode: string;
  addressLine: string;
  isDefault: boolean;
};

export default function AddressFormDialog({
  children,
  mode,
  initialValue,
  onCreated,
  onUpdated,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  //  initialValue থেকে derived defaults (stable)
  const defaults: FormState = useMemo(
    () => ({
      fullName: initialValue?.fullName ?? "",
      phone: initialValue?.phone ?? "",
      city: initialValue?.city ?? "",
      area: initialValue?.area ?? "",
      postalCode: initialValue?.postalCode ?? "",
      addressLine: initialValue?.addressLine ?? "",
      isDefault: initialValue?.isDefault ?? false,
    }),
    [initialValue],
  );

  const [form, setForm] = useState<FormState>(defaults);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((s) => ({ ...s, [key]: value }));
  };

  const validate = () => {
    if (!form.fullName.trim()) return "Full name is required";
    if (!form.phone.trim()) return "Phone is required";
    if (!form.city.trim()) return "City is required";
    if (!form.area.trim()) return "Area is required";
    if (!form.postalCode.trim()) return "Postal code is required";
    if (!form.addressLine.trim()) return "Address line is required";
    return null;
  };

  const handleOpenChange = (next: boolean) => {
    if (next) setForm(defaults);
    setOpen(next);
  };

  const submit = async () => {
    const err = validate();
    if (err) return toast.error(err);

    setLoading(true);

    const payload = {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      area: form.area.trim(),
      postalCode: form.postalCode.trim(),
      addressLine: form.addressLine.trim(),
      isDefault: form.isDefault,
      country: "Bangladesh",
    };

    const res =
      mode === "create"
        ? await addressApi.create(payload as any)
        : await addressApi.update(initialValue!.id, payload as any);

    setLoading(false);

    if (res?.error) {
      toast.error(res.error.message);
      return;
    }

    const addr = res?.data?.data as Address | undefined;
    if (!addr) {
      toast.error("Unexpected response from server");
      return;
    }

    if (mode === "create") onCreated?.(addr);
    else onUpdated?.(addr);

    toast.success(res?.data?.message ?? "Saved");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !loading && handleOpenChange(v)}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Address" : "Edit Address"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Full name *</Label>
              <Input
                value={form.fullName}
                onChange={(e) => setField("fullName", e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone *</Label>
              <Input
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="01XXXXXXXXX"
              />
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>City *</Label>
              <Input
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
                placeholder="Dhaka"
              />
            </div>
            <div className="space-y-2">
              <Label>Area *</Label>
              <Input
                value={form.area}
                onChange={(e) => setField("area", e.target.value)}
                placeholder="Mirpur"
              />
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Postal code *</Label>
              <Input
                value={form.postalCode}
                onChange={(e) => setField("postalCode", e.target.value)}
                placeholder="1216"
              />
            </div>
            <div className="space-y-2">
              <Label>Address line *</Label>
              <Input
                value={form.addressLine}
                onChange={(e) => setField("addressLine", e.target.value)}
                placeholder="House, Road..."
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              checked={form.isDefault}
              onCheckedChange={(v) => setField("isDefault", Boolean(v))}
            />
            <Label>Set as default</Label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={submit} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
