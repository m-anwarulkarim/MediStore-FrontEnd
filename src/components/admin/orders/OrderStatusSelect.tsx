/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { clientFetch } from "@/lib/fetch/clientFetch";
import { toast } from "sonner";
import type { OrderStatus } from "@/components/types/order";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS: OrderStatus[] = [
  "PLACED",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export function OrderStatusSelect({
  orderId,
  currentStatus,
  disabled,
  onChanged,
}: {
  orderId: string;
  currentStatus: OrderStatus;
  disabled?: boolean;
  onChanged?: (next: OrderStatus) => void;
}) {
  const updateStatus = async (status: OrderStatus) => {
    try {
      const res = await clientFetch(`api/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      if (res.error) throw new Error(res.error.message);

      toast.success("Order status updated");
      onChanged?.(status);
    } catch (e: any) {
      toast.error(e?.message || "Failed to update status");
    }
  };

  return (
    <Select
      defaultValue={currentStatus}
      onValueChange={(v) => updateStatus(v as OrderStatus)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[160px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUS.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
