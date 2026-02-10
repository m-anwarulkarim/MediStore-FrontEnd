/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { toast } from "sonner";

import { clientFetch } from "@/lib/fetch/clientFetch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OrderStatus } from "./types";

export function UpdateOrderStatusSelect({
  orderId,
  value,
  onSuccess,
}: {
  orderId: string;
  value: OrderStatus;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status: OrderStatus) => {
    setLoading(true);
    try {
      const res = await clientFetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if ((res as any).error) throw new Error((res as any).error.message);

      toast.success("Order status updated!");
      onSuccess();
    } catch (e: any) {
      toast.error(e?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Badge variant="secondary" className="hidden sm:inline-flex">
        {value}
      </Badge>

      <Select
        value={value}
        onValueChange={(v) => updateStatus(v as OrderStatus)}
        disabled={loading}
      >
        <SelectTrigger className="w-[170px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PLACED">PLACED</SelectItem>
          <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
          <SelectItem value="PROCESSING">PROCESSING</SelectItem>
          <SelectItem value="SHIPPED">SHIPPED</SelectItem>
          <SelectItem value="DELIVERED">DELIVERED</SelectItem>
          <SelectItem value="CANCELLED">CANCELLED</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
