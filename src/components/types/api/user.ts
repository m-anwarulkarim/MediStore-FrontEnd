export type UserMe = {
  id: string;
  name: string | null;
  email: string;
  phone?: string | null;
  image?: string | null;
  role: "CUSTOMER" | "SELLER" | "ADMIN";
  status: "ACTIVE" | "BANNED" | "SUSPENDED";
  createdAt?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
