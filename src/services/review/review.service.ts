import { clientFetch } from "@/lib/fetch/clientFetch";

export const reviewService = {
  createReview: async (payload: {
    medicineId: string;
    rating: number;
    comment?: string;
  }) => {
    return clientFetch("/api/reviews", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
