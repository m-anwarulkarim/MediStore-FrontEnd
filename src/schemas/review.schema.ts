import * as z from "zod";

export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters long")
    .max(1000, "Comment must be at most 1000 characters"),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
