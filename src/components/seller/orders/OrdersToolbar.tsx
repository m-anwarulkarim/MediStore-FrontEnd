/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OrderStatus } from "./types";

const ALL = "ALL";

export function OrdersToolbar({
  status,
  onStatusChange,
  onRefresh,
}: {
  status: OrderStatus | "ALL";
  onStatusChange: (v: OrderStatus | "ALL") => void;
  onRefresh: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="text-sm opacity-70">Filter by status</div>
        <Select value={status} onValueChange={(v) => onStatusChange(v as any)}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All</SelectItem>
            <SelectItem value="PLACED">PLACED</SelectItem>
            <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
            <SelectItem value="PROCESSING">PROCESSING</SelectItem>
            <SelectItem value="SHIPPED">SHIPPED</SelectItem>
            <SelectItem value="DELIVERED">DELIVERED</SelectItem>
            <SelectItem value="CANCELLED">CANCELLED</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" onClick={onRefresh}>
        Refresh
      </Button>
    </div>
  );
}
