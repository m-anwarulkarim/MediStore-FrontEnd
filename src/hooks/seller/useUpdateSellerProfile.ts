"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sellerProfileService } from "@/services/seller/sellerProfile.service";
import { UpdateSellerProfilePayload } from "@/components/types/sellerProfile.type";

export const useUpdateSellerProfile = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateSellerProfilePayload) => {
      const res = await sellerProfileService.updateProfile(payload);
      if (res.error) throw new Error(res.error.message);
      return res.data!;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["seller-profile-me"] });
    },
  });
};
