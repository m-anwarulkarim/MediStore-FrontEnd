import { clientFetch } from "@/lib/fetch/clientFetch";

export type Address = {
  id: string;
  fullName: string;
  phone: string;
  country: string;
  city: string;
  state?: string | null;
  area?: string | null;
  postalCode?: string | null;
  addressLine: string;
  label?: string | null;
  isDefault: boolean;
};

export type CreateAddressPayload = {
  fullName: string;
  phone: string;
  country?: string;
  city: string;
  state?: string;
  area?: string;
  postalCode?: string;
  addressLine: string;
  label?: string;
  isDefault?: boolean;
};

export const addressService = {
  getMyAddresses: async () => {
    return clientFetch<{ success: boolean; data: Address[] }>(
      "/api/address/my-addresses",
      { method: "GET" },
    );
  },

  createAddress: async (payload: CreateAddressPayload) => {
    return clientFetch("/api/address", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  // --------------------
  // DELETE address  ✅ (এইটাই missing ছিল)
  // --------------------
  deleteAddress: async (id: string) => {
    return clientFetch(`/api/address/${id}`, {
      method: "DELETE",
    });
  },
};
