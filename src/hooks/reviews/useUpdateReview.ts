"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/services/review/review.service";
import { UpdateReviewPayload } from "@/components/types/review.type";

export const useUpdateReview = (medicineId: string) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reviewId,
      payload,
    }: {
      reviewId: string;
      payload: UpdateReviewPayload;
    }) => {
      const res = await reviewService.updateReview(reviewId, payload);
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
