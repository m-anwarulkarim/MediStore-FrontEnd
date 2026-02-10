/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orderService } from "@/services/order/order.service";

type Order = { id: string; status: string };

const formatDefaultAddress = (addr: any) => {
  const parts = [
    addr?.addressLine ?? "",
    addr?.area ?? "",
    addr?.city ?? "",
    addr?.postalCode ?? "",
  ]
    .map((x) => String(x).trim())
    .filter(Boolean);
  return parts.join(", ");
};

export default function ProfileSummaryCards({ summary }: { summary: any }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      const res = await orderService.getMyOrders();
      setLoading(false);

      if (res?.error) {
        toast.error(res.error.message);
        return;
      }

      const list = (res.data as any)?.data ?? [];
      setOrders(Array.isArray(list) ? list : []);
    };

    loadOrders();
  }, []);

  const ordersCount = orders.length;

  const deliveredCount = useMemo(
    () => orders.filter((o) => o.status === "DELIVERED").length,
    [orders],
  );

  const reviewsCount = summary?.reviewsCount ?? 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Orders</span>
            <span className="font-medium">{loading ? "..." : ordersCount}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Delivered</span>
            <span className="font-medium">
              {loading ? "..." : deliveredCount}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Reviews</span>
            <span className="font-medium">{reviewsCount}</span>
          </div>
        </CardContent>
      </Card>

      {summary?.defaultAddress ? (
        <Card>
          <CardHeader>
            <CardTitle>Default Address</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {formatDefaultAddress(summary.defaultAddress)}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
