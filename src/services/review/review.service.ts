import {
  ApiResponse,
  CreateReviewPayload,
  Review,
  UpdateReviewPayload,
} from "@/components/types/review.type";
import { clientFetch } from "@/lib/fetch/clientFetch";
import { serverFetch } from "@/lib/fetch/serverFetch";

export const reviewService = {
  // Public
  getMedicineReviewsServer: async (medicineId: string) => {
    return serverFetch<ApiResponse<Review[]>>(
      `/api/reviews/medicine/${medicineId}`,
      {
        method: "GET",
      },
    );
  },

  // Client (for react-query)
  getMedicineReviews: async (medicineId: string) => {
    return clientFetch<ApiResponse<Review[]>>(
      `/api/reviews/medicine/${medicineId}`,
      {
        method: "GET",
      },
    );
  },

  createReview: async (payload: CreateReviewPayload) => {
    return clientFetch<ApiResponse<Review>>(`/api/reviews`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateReview: async (reviewId: string, payload: UpdateReviewPayload) => {
    return clientFetch<ApiResponse<Review>>(`api/reviews/${reviewId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  // Seller
  getSellerReviews: async () => {
    return clientFetch<ApiResponse<Review[]>>(`api/reviews/seller/all`, {
      method: "GET",
    });
  },

  // Admin
  deleteReview: async (reviewId: string) => {
    return clientFetch<ApiResponse<{ message: string }>>(
      `api/reviews/${reviewId}`,
      {
        method: "DELETE",
      },
    );
  },

  getMyReview: async (orderId: string, medicineId: string) => {
    return clientFetch<ApiResponse<Review | null>>(
      `api/reviews/my?orderId=${orderId}&medicineId=${medicineId}`,
      { method: "GET" },
    );
  },
};
