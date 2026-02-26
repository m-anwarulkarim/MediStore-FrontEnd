/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse, UserMe } from "@/components/types/api/user";
import { clientFetch } from "@/lib/fetch/clientFetch";

export type UpdateProfilePayload = {
  name?: string;
  phone?: string;
  image?: string | null;
};

export const userApi = {
  // ✅ CSR load (JWT Bearer auto যাবে)
  me: async () => {
    return clientFetch<ApiResponse<UserMe>>("api/users/me/profile", {
      method: "GET",
    });
  },

  // ✅ CSR update
  updateMe: async (payload: UpdateProfilePayload) => {
    return clientFetch<ApiResponse<UserMe>>("api/users/me/profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  // ✅ CSR summary
  summary: async () => {
    return clientFetch<ApiResponse<any>>(
      "api/users/me/profile/summary",
      {
        method: "GET",
      },
    );
  },
};