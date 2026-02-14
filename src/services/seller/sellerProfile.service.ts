import { serverFetch } from "@/lib/fetch/serverFetch";
import {
  ApiResponse,
  CreateSellerProfilePayload,
  SellerProfile,
  UpdateSellerProfilePayload,
} from "@/components/types/seller";
import { clientFetch } from "@/lib/fetch/clientFetch";

export const sellerService = {
  getMyProfile: async () => {
    return clientFetch<ApiResponse<SellerProfile>>("api/seller/profile", {
      method: "GET",
    });
  },

  createProfile: async (payload: CreateSellerProfilePayload) => {
    return clientFetch<ApiResponse<SellerProfile>>("api/seller/profile", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateProfile: async (payload: UpdateSellerProfilePayload) => {
    return clientFetch<ApiResponse<SellerProfile>>("api/seller/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
};

export const sellerServer = {
  getMyProfile: async () => {
    return serverFetch<ApiResponse<SellerProfile>>("api/seller/profile", {
      method: "GET",
    });
  },
};
