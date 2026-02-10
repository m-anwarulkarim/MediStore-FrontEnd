export type ReviewUser = {
  id: string;
  name: string;
  image?: string | null;
};

export type ReviewMedicine = {
  id: string;
  name: string;
  image?: string | null;
};

export type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: ReviewUser;
  medicine?: ReviewMedicine;
  medicineId: string;
  orderId?: string | null;
};

export type CreateReviewPayload = {
  medicineId: string;
  orderId: string;
  rating: number;
  comment?: string;
};

export type UpdateReviewPayload = {
  rating?: number;
  comment?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};
