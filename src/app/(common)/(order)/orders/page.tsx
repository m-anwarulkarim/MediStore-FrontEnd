/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { orderService } from "@/services/order/order.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      const res = await orderService.getMyOrders(); // should call GET /api/orders/my-orders
      if (!alive) return;

      setLoading(false);

      if (res.error) {
        toast.error(res.error.message || "Failed to load orders");
        return;
      }

      const data = (res.data as any)?.data ?? res.data ?? [];
      setOrders(data);
    })();

    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return <div className="mx-auto max-w-6xl px-4 py-10">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="text-sm text-muted-foreground">
          Track your order status.
        </p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No orders yet</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Place an order from checkout to see it here.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Card key={o.id}>
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="font-semibold">Order #{o.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(o.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="outline">{o.status}</Badge>
                  <p className="font-bold">৳ {Number(o.total).toFixed(2)}</p>

                  <Button asChild variant="outline" size="sm">
                    <Link href={`/orders/${o.id}`}>View</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
