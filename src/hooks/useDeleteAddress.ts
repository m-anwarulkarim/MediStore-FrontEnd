"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

type DeleteRes = { success: boolean; message?: string };

export function useDeleteAddress() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (addressId: string) => {
      return apiFetch<DeleteRes>(`api/addresses/${addressId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}
