import { clientFetch } from "@/lib/fetch/clientFetch";

export type AddToCartPayload = {
  medicineId: string | number;
  quantity: number;
};

export const cartService = {
  addToCart: async (payload: AddToCartPayload) => {
    return clientFetch("/api/cart", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getMyCart: async () => {
    return clientFetch("/api/cart", { method: "GET" });
  },

  updateQty: async (cartItemId: string, quantity: number) => {
    return clientFetch(`/api/cart/${cartItemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
  },

  deleteItem: async (cartItemId: string) => {
    return clientFetch(`/api/cart/${cartItemId}`, {
      method: "DELETE",
    });
  },
};
