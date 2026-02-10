import * as z from "zod";

export const createSellerProfileSchema = z.object({
  shopName: z.string().min(2, "Shop name must be at least 2 characters"),
  shopDescription: z
    .string()
    .max(500, "Maximum 500 characters")
    .optional()
    .or(z.literal("")),
  licenseNumber: z
    .string()
    .min(3, "License number must be at least 3 characters"),
});

export type CreateSellerProfileFormValues = z.infer<
  typeof createSellerProfileSchema
>;

export const updateSellerProfileSchema = z.object({
  shopName: z
    .string()
    .min(2, "Shop name must be at least 2 characters")
    .optional()
    .or(z.literal("")),
  shopDescription: z
    .string()
    .max(500, "Maximum 500 characters")
    .optional()
    .or(z.literal("")),
  shopLogo: z
    .string()
    .url("A valid image URL is required")
    .optional()
    .or(z.literal("")),
  licenseNumber: z
    .string()
    .min(3, "License number must be at least 3 characters")
    .optional()
    .or(z.literal("")),
});

export type UpdateSellerProfileFormValues = z.infer<
  typeof updateSellerProfileSchema
>;
