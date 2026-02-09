export type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  medicine?: {
    id: string;
    name: string;
    image?: string | null;
    slug?: string;
  };
};

export type Order = {
  id: string;
  orderNumber?: string;
  status: OrderStatus;
  subtotal?: number;
  total?: number;
  createdAt?: string;

  user?: {
    id: string;
    name: string;
    email: string;
  };

  items?: OrderItem[];
};
