import { clientFetch } from "@/lib/fetch/clientFetch";

export const orderService = {
  createOrder: async (payload: {
    addressId: string;
    customerNote?: string;
  }) => {
    return clientFetch("/api/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // =========================

  // =========================
  getMyOrders: async () => {
    return clientFetch("/api/orders/my-orders", {
      method: "GET",
    });
  },

  // =========================
  // Order details
  // =========================
  getOrderDetails: async (orderId: string) => {
    return clientFetch(`/api/orders/${orderId}`, {
      method: "GET",
    });
  },
};
