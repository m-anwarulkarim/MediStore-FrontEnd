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
  // status?: "PUBLISHED" | "DRAFT" | "BLOCKED"; // যদি তোমার model এ থাকে
};
