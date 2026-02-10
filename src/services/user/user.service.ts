/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse, UserMe } from "@/components/types/api/user";
import { clientFetch } from "@/lib/fetch/clientFetch";
import { serverFetch } from "@/lib/fetch/serverFetch";

export type UpdateProfilePayload = {
  name?: string;
  phone?: string;
  image?: string | null;
};

export const userApi = {
  //  SSR load
  me: async () => {
    return serverFetch<ApiResponse<UserMe>>("api/users/me/profile", {
      method: "GET",
    });
  },

  //  CSR update
  updateMe: async (payload: UpdateProfilePayload) => {
    return clientFetch<ApiResponse<UserMe>>("/api/users/me/profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  //  Optional summary
  summary: async () => {
    return serverFetch<ApiResponse<any>>("api/users/me/profile/summary", {
      method: "GET",
    });
  },
};
