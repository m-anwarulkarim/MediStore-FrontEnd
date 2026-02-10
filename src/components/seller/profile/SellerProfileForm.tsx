"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  createSellerProfileSchema,
  updateSellerProfileSchema,
  type CreateSellerProfileFormValues,
  type UpdateSellerProfileFormValues,
} from "@/schemas/sellerProfile.schema";

import { useCreateSellerProfile } from "@/hooks/seller/useCreateSellerProfile";
import { useUpdateSellerProfile } from "@/hooks/seller/useUpdateSellerProfile";
import { SellerProfile } from "@/components/types/sellerProfile.type";

type Props = {
  profile: SellerProfile | null;
};

export default function SellerProfileForm({ profile }: Props) {
  const isCreateMode = useMemo(() => !profile, [profile]);

  const createMutation = useCreateSellerProfile();
  const updateMutation = useUpdateSellerProfile();

  // CREATE FORM
  const createForm = useForm<CreateSellerProfileFormValues>({
    resolver: zodResolver(createSellerProfileSchema),
    defaultValues: {
      shopName: "",
      shopDescription: "",
      licenseNumber: "",
    },
  });

  // UPDATE FORM
  const updateForm = useForm<UpdateSellerProfileFormValues>({
    resolver: zodResolver(updateSellerProfileSchema),
    defaultValues: {
      shopName: "",
      shopDescription: "",
      shopLogo: "",
      licenseNumber: "",
    },
  });

  useEffect(() => {
    if (profile) {
      updateForm.reset({
        shopName: profile.shopName ?? "",
        shopDescription: profile.shopDescription ?? "",
        shopLogo: profile.shopLogo ?? "",
        licenseNumber: profile.licenseNumber ?? "",
      });
    }
  }, [profile, updateForm]);

  const onCreate = async (values: CreateSellerProfileFormValues) => {
    try {
      await createMutation.mutateAsync({
        shopName: values.shopName,
        shopDescription: values.shopDescription || undefined,
        licenseNumber: values.licenseNumber,
      });
      toast.success("Seller profile created!");
    } catch (e: any) {
      toast.error(e?.message || "Failed to create profile");
    }
  };

  const onUpdate = async (values: UpdateSellerProfileFormValues) => {
    const payload: any = {
      ...(values.shopName ? { shopName: values.shopName } : {}),
      ...(values.shopDescription
        ? { shopDescription: values.shopDescription }
        : {}),
      ...(values.shopLogo ? { shopLogo: values.shopLogo } : {}),
      ...(values.licenseNumber ? { licenseNumber: values.licenseNumber } : {}),
    };

    if (Object.keys(payload).length === 0) {
      toast.error("Nothing to update");
      return;
    }

    try {
      await updateMutation.mutateAsync(payload);
      toast.success("Seller profile updated!");
    } catch (e: any) {
      toast.error(e?.message || "Failed to update profile");
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>
          {isCreateMode ? "Create Profile" : "Update Profile"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isCreateMode ? (
          <form
            onSubmit={createForm.handleSubmit(onCreate)}
            className="grid gap-4"
          >
            <div className="grid gap-2">
              <label className="text-sm font-medium">Shop Name</label>
              <Input {...createForm.register("shopName")} />
              {createForm.formState.errors.shopName?.message ? (
                <p className="text-xs text-destructive">
                  {createForm.formState.errors.shopName.message}
                </p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Shop Description (optional)
              </label>
              <Textarea rows={4} {...createForm.register("shopDescription")} />
              {createForm.formState.errors.shopDescription?.message ? (
                <p className="text-xs text-destructive">
                  {createForm.formState.errors.shopDescription.message}
                </p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">License Number</label>
              <Input {...createForm.register("licenseNumber")} />
              {createForm.formState.errors.licenseNumber?.message ? (
                <p className="text-xs text-destructive">
                  {createForm.formState.errors.licenseNumber.message}
                </p>
              ) : null}
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Create Profile"}
            </Button>
          </form>
        ) : (
          <form
            onSubmit={updateForm.handleSubmit(onUpdate)}
            className="grid gap-4"
          >
            <div className="grid gap-2">
              <label className="text-sm font-medium">Shop Name</label>
              <Input {...updateForm.register("shopName")} />
              {updateForm.formState.errors.shopName?.message ? (
                <p className="text-xs text-destructive">
                  {updateForm.formState.errors.shopName.message}
                </p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Shop Description</label>
              <Textarea rows={4} {...updateForm.register("shopDescription")} />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Shop Logo URL (optional)
              </label>
              <Input
                placeholder="https://..."
                {...updateForm.register("shopLogo")}
              />
              {updateForm.formState.errors.shopLogo?.message ? (
                <p className="text-xs text-destructive">
                  {updateForm.formState.errors.shopLogo.message}
                </p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">License Number</label>
              <Input {...updateForm.register("licenseNumber")} />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Update Profile"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
