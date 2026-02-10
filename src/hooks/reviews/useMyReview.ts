"use client";

import { useQuery } from "@tanstack/react-query";
import { reviewService } from "@/services/review/review.service";

export const useMyReview = (orderId: string, medicineId: string) => {
  return useQuery({
    queryKey: ["my-review", orderId, medicineId],
    queryFn: async () => {
      const res = await reviewService.getMyReview(orderId, medicineId);
      if (res.error) throw new Error(res.error.message);
      return res.data?.data ?? null;
    },
    enabled: !!orderId && !!medicineId,
  });
};
