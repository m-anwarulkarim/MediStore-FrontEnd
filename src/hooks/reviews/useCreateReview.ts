"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/services/review/review.service";
import { CreateReviewPayload } from "@/components/types/review.type";

export const useCreateReview = (medicineId: string) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateReviewPayload) => {
      const res = await reviewService.createReview(payload);
      if (res.error) throw new Error(res.error.message);
      return res.data!;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: ["medicine-reviews", medicineId],
      });
    },
  });
};
