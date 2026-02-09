export type Medicine = {
  id: string;
  name: string;
  slug?: string;
  image?: string | null;
  price: number;
  stock?: number;
  category?: { id: string; name: string } | null;
  seller?: { id: string; name: string; email?: string } | null;
  createdAt?: string;
};
export type SellerMedicine = {
  id: string;
  name: string;
  price: number;
  discountPrice?: number | null;

  manufacturer: string;
  description: string;

  dosageForm?: string | null;
  strength?: string | null;
  prescriptionRequired?: boolean | null;

  images?: string[] | null;

  category?: { id: string; name: string } | null;
  categoryId?: string;
  stock: number;
  isActive?: boolean;
};
