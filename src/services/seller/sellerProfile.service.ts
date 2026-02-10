import {
  ApiResponse,
  CreateSellerProfilePayload,
  SellerProfile,
  UpdateSellerProfilePayload,
} from "@/components/types/sellerProfile.type";
import { clientFetch } from "@/lib/fetch/clientFetch";

export const sellerProfileService = {
  getMyProfile: async () => {
    return clientFetch<ApiResponse<SellerProfile>>("/api/seller/profile", {
      method: "GET",
    });
  },

  createProfile: async (payload: CreateSellerProfilePayload) => {
    return clientFetch<ApiResponse<SellerProfile>>("/api/seller/profile", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateProfile: async (payload: UpdateSellerProfilePayload) => {
    return clientFetch<ApiResponse<SellerProfile>>("/api/seller/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
};
