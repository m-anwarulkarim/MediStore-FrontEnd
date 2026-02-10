import type { Address } from "@/components/types/api/address";
import type { ApiResponse } from "@/components/types/api/user";
import { clientFetch } from "@/lib/fetch/clientFetch";
import { serverFetch } from "@/lib/fetch/serverFetch";

export type CreateAddressPayload = Omit<Address, "id" | "userId" | "createdAt">;

export type UpdateAddressPayload = Partial<CreateAddressPayload>;

const ADDRESS_BASE = "/api/address";

export const addressApi = {
  // SSR list
  myAddresses: async () => {
    return serverFetch<ApiResponse<Address[]>>(`${ADDRESS_BASE}/my-addresses`, {
      method: "GET",
    });
  },

  // CSR actions
  create: async (payload: CreateAddressPayload) => {
    return clientFetch<ApiResponse<Address>>(ADDRESS_BASE, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: UpdateAddressPayload) => {
    return clientFetch<ApiResponse<Address>>(`${ADDRESS_BASE}/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  remove: async (id: string) => {
    return clientFetch<ApiResponse<Address>>(`${ADDRESS_BASE}/${id}`, {
      method: "DELETE",
    });
  },
};
