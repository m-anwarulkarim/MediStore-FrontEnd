export type Category = {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  totalMedicines?: number;
  _count?: { medicines?: number };
};

export type SellerCategory = {
  id: string;
  name: string;
  description?: string | null;
  _count?: {
    medicines?: number;
  };
};
