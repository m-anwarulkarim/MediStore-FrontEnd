export type SellerUser = {
  id: string;
  name: string | null;
  email: string;
  role: "SELLER" | "ADMIN" | "CUSTOMER";
  status: "ACTIVE" | "BANNED" | "SUSPENDED";
};

export type SellerMedicine = {
  id: string;
  name: string;
  slug?: string | null;
  image?: string | null;
  createdAt?: string;
};

export type SellerProfile = {
  id: string;
  userId: string;
  shopName: string;
  shopDescription: string | null;
  shopLogo: string | null;
  licenseNumber: string;
  isVerified: boolean;
  createdAt: string;
  user?: SellerUser;
  medicines?: SellerMedicine[];
};

export type CreateSellerProfilePayload = {
  shopName: string;
  shopDescription?: string;
  licenseNumber: string;
};

export type UpdateSellerProfilePayload = {
  shopName?: string;
  shopDescription?: string;
  shopLogo?: string;
  licenseNumber?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
