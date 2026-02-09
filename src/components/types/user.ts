export type Role = "CUSTOMER" | "SELLER" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED" | "SUSPENDED";
export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "ACTIVE" | "BANNED" | "SUSPENDED";
  createdAt?: string;
};
