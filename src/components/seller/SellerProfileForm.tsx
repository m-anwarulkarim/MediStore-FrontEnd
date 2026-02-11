"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SellerProfile } from "../types/seller";
import { sellerService } from "@/services/seller/sellerProfile.service";

// ✅ single form shape (all fields included)
const baseSchema = z.object({
  shopName: z.string().optional(),
  shopDescription: z.string().optional(),
  shopLogo: z.string().optional(),
  licenseNumber: z.string().optional(),
});

//  separate create/update rules
// const formSchema = baseSchema.superRefine((val, ctx) => {
//   // create mode detect: if no initialProfile then create
//   // mode will be passed dynamically below
// });

type SellerFormValues = z.infer<typeof baseSchema>;

export default function SellerProfileForm({
  initialProfile,
  onUpdated,
}: {
  initialProfile: SellerProfile | null;
  onUpdated?: (profile: SellerProfile) => void;
}) {
  const [loading, setLoading] = useState(false);
  const isUpdate = !!initialProfile;

  // ✅ build schema based on mode
  const schema = useMemo(() => {
    return baseSchema.superRefine((val, ctx) => {
      if (!isUpdate) {
        // -------- CREATE RULES --------
        if (!val.shopName || val.shopName.trim().length < 2) {
          ctx.addIssue({
            code: "custom",
            path: ["shopName"],
            message: "Shop name must be at least 2 characters",
          });
        }
        if (!val.licenseNumber || val.licenseNumber.trim().length < 3) {
          ctx.addIssue({
            code: "custom",
            path: ["licenseNumber"],
            message: "Please provide a license number",
          });
        }
      } else {
        // -------- UPDATE RULES --------
        if (val.shopLogo && val.shopLogo.trim().length > 0) {
          const ok = z.string().url().safeParse(val.shopLogo);
          if (!ok.success) {
            ctx.addIssue({
              code: "custom",
              path: ["shopLogo"],
              message: "Please provide a valid logo URL",
            });
          }
        }

        const nothingToUpdate =
          !val.shopName?.trim() &&
          !val.shopDescription?.trim() &&
          !val.shopLogo?.trim() &&
          !val.licenseNumber?.trim();

        if (nothingToUpdate) {
          ctx.addIssue({
            code: "custom",
            path: ["shopName"],
            message: "Please update at least one field (Nothing to update)",
          });
        }
      }
    });
  }, [isUpdate]);

  const defaultValues: SellerFormValues = useMemo(() => {
    if (!initialProfile) {
      return {
        shopName: "",
        shopDescription: "",
        shopLogo: "",
        licenseNumber: "",
      };
    }

    return {
      shopName: initialProfile.shopName ?? "",
      shopDescription: initialProfile.shopDescription ?? "",
      shopLogo: initialProfile.shopLogo ?? "",
      licenseNumber: initialProfile.licenseNumber ?? "",
    };
  }, [initialProfile]);

  const form = useForm<SellerFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const submit = async (values: SellerFormValues) => {
    try {
      setLoading(true);

      if (!isUpdate) {
        const payload = {
          shopName: values.shopName?.trim() ?? "",
          shopDescription: values.shopDescription?.trim() || undefined,
          licenseNumber: values.licenseNumber?.trim() ?? "",
        };

        const res = await sellerService.createProfile(payload);

        if (res.error) {
          toast.error(res.error.message || "Something went wrong");
          return;
        }

        const profile = res.data?.data;
        if (!profile) {
          toast.error("Profile data not found");
          return;
        }

        toast.success("Seller profile created");
        onUpdated?.(profile);
        return;
      }

      const payload: Record<string, string> = {};
      if (values.shopName?.trim()) payload.shopName = values.shopName.trim();
      if (values.shopDescription?.trim())
        payload.shopDescription = values.shopDescription.trim();
      if (values.shopLogo?.trim()) payload.shopLogo = values.shopLogo.trim();
      if (values.licenseNumber?.trim())
        payload.licenseNumber = values.licenseNumber.trim();

      const res = await sellerService.updateProfile(payload);

      if (res.error) {
        toast.error(res.error.message || "Something went wrong");
        return;
      }

      const profile = res.data?.data;
      if (!profile) {
        toast.error("Profile data not found");
        return;
      }

      toast.success("Seller profile updated");
      onUpdated?.(profile);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {isUpdate ? "Update Profile" : "Create Profile"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <form className="space-y-5" onSubmit={form.handleSubmit(submit)}>
          <div className="space-y-2">
            <Label>Shop Name</Label>
            <Input
              placeholder="e.g. MediStore Pharmacy"
              {...form.register("shopName")}
            />
            {form.formState.errors.shopName?.message ? (
              <p className="text-sm text-destructive">
                {String(form.formState.errors.shopName.message)}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label>Shop Description</Label>
            <Textarea
              placeholder="Write a short description about your shop..."
              className="min-h-24"
              {...form.register("shopDescription")}
            />
            {form.formState.errors.shopDescription?.message ? (
              <p className="text-sm text-destructive">
                {String(form.formState.errors.shopDescription.message)}
              </p>
            ) : null}
          </div>

          {isUpdate ? (
            <div className="space-y-2">
              <Label>Shop Logo URL</Label>
              <Input placeholder="https://..." {...form.register("shopLogo")} />
              {form.formState.errors.shopLogo?.message ? (
                <p className="text-sm text-destructive">
                  {String(form.formState.errors.shopLogo.message)}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="space-y-2">
            <Label>License Number</Label>
            <Input
              placeholder="License number"
              {...form.register("licenseNumber")}
            />
            {form.formState.errors.licenseNumber?.message ? (
              <p className="text-sm text-destructive">
                {String(form.formState.errors.licenseNumber.message)}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button type="submit" disabled={loading} className="sm:w-fit">
              {loading
                ? "Saving..."
                : isUpdate
                  ? "Save Changes"
                  : "Create Profile"}
            </Button>

            <p className="text-xs text-muted-foreground">
              {isUpdate
                ? "Tip: Only update the fields you want to change."
                : "Tip: After creating, it will switch to update mode."}
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
