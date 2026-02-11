"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sellerService } from "@/services/seller/sellerProfile.service";
import { CreateSellerProfilePayload } from "@/components/types/seller";

export const useCreateSellerProfile = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateSellerProfilePayload) => {
      const res = await sellerService.createProfile(payload);
      if (res.error) throw new Error(res.error.message);
      return res.data!;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["seller-profile-me"] });
    },
  });
};
