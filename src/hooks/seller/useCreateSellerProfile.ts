"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sellerProfileService } from "@/services/seller/sellerProfile.service";
import { CreateSellerProfilePayload } from "@/components/types/sellerProfile.type";

export const useCreateSellerProfile = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateSellerProfilePayload) => {
      const res = await sellerProfileService.createProfile(payload);
      if (res.error) throw new Error(res.error.message);
      return res.data!;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["seller-profile-me"] });
    },
  });
};
