export type Address = {
  id: string;
  userId: string;
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
  createdAt?: string;
};
