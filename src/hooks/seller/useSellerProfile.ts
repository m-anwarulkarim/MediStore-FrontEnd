/* eslint-disable @typescript-eslint/no-explicit-any */
import { sellerService } from "@/services/seller/sellerProfile.service";
import { useQuery } from "@tanstack/react-query";

export const useSellerProfile = () => {
  return useQuery({
    queryKey: ["seller-profile-me"],
    queryFn: async () => {
      const res = await sellerService.getMyProfile();

      // profile missing -> allow create mode
      if (res.error?.message?.includes("Seller profile not found")) {
        return { success: true, data: null } as any;
      }

      if (res.error) throw new Error(res.error.message);
      return res.data!;
    },
  });
};
