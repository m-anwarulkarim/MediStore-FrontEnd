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

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const addressService = {
  getMyAddresses: async () => {
    return clientFetch<ApiResponse<Address[]>>("api/address/my-addresses", {
      method: "GET",
    });
  },

  //  Create address
  createAddress: async (payload: CreateAddressPayload) => {
    return clientFetch<ApiResponse<Address>>("api/address", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  //  Update address
  updateAddress: async (id: string, payload: Partial<CreateAddressPayload>) => {
    return clientFetch<ApiResponse<Address>>(`api/address/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  //  Delete address
  deleteAddress: async (id: string) => {
    return clientFetch<ApiResponse<Address>>(`api/address/${id}`, {
      method: "DELETE",
    });
  },
};
