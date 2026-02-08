"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

type DeleteRes = { success: boolean; message?: string };

export function useDeleteAddress() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (addressId: string) => {
      // তোমার backend route অনুযায়ী URL বদলাবে
      return apiFetch<DeleteRes>(`/api/addresses/${addressId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      // যদি address list query key থাকে, সেটাকে refetch করো
      qc.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}
