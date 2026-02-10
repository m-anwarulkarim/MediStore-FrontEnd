/* eslint-disable @typescript-eslint/no-explicit-any */
export type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type SellerOrder = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  total: number;
  createdAt: string;
  customer?: { id: string; name?: string | null; email?: string | null } | null;
  itemsCount?: number;
};

export type SellerOrdersApiResponse = {
  success: boolean;
  message?: string;

  data: SellerOrder[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
};

export type OrderDetailsApiResponse = {
  success: boolean;
  message?: string;
  data: any;
};
