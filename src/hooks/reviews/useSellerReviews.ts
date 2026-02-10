"use client";

import { useQuery } from "@tanstack/react-query";
import { reviewService } from "@/services/review/review.service";

export const useSellerReviews = () => {
  return useQuery({
    queryKey: ["seller-reviews"],
    queryFn: async () => {
      const res = await reviewService.getSellerReviews();
      if (res.error) throw new Error(res.error.message);
      return res.data!;
    },
  });
};
