"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/services/review/review.service";

export const useDeleteReview = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const res = await reviewService.deleteReview(reviewId);
      if (res.error) throw new Error(res.error.message);
      return res.data!;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["seller-reviews"] });
      await qc.invalidateQueries({ queryKey: ["medicine-reviews"] });
    },
  });
};
