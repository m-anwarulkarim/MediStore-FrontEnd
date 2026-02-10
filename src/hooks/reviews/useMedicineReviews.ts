"use client";

import { useQuery } from "@tanstack/react-query";
import { reviewService } from "@/services/review/review.service";

export const useMedicineReviews = (medicineId: string) => {
  return useQuery({
    queryKey: ["medicine-reviews", medicineId],
    queryFn: async () => {
      const res = await reviewService.getMedicineReviews(medicineId);
      if (res.error) throw new Error(res.error.message);
      return res.data!;
    },
    enabled: !!medicineId,
  });
};
