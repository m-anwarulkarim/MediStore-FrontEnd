export type SellerUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

export type SellerMedicine = {
  id: string;
  name: string;
  image?: string | null;
  slug?: string | null;
  createdAt?: string;
};

export type SellerProfile = {
  id: string;
  userId: string;
  shopName: string;
  shopDescription?: string | null;
  shopLogo?: string | null;
  licenseNumber: string;
  isVerified: boolean;
  createdAt: string;

  user?: SellerUser;
  medicines?: SellerMedicine[];
};

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type CreateSellerProfilePayload = {
  shopName: string;
  shopDescription?: string;
  licenseNumber: string;
};

export type UpdateSellerProfilePayload = {
  shopName?: string;
  shopDescription?: string;
  shopLogo?: string; // URL
  licenseNumber?: string;
};
