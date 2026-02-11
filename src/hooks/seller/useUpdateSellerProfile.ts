"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateSellerProfilePayload } from "@/components/types/seller";
import { sellerService } from "@/services/seller/sellerProfile.service";

export const useUpdateSellerProfile = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateSellerProfilePayload) => {
      const res = await sellerService.updateProfile(payload);
      if (res.error) throw new Error(res.error.message);
      return res.data!;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["seller-profile-me"] });
    },
  });
};
