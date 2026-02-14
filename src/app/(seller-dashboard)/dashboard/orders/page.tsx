/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { clientFetch } from "@/lib/fetch/clientFetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { OrdersToolbar } from "@/components/seller/orders/OrdersToolbar";
import { OrdersTable } from "@/components/seller/orders/OrdersTable";
import type {
  SellerOrder,
  SellerOrdersApiResponse,
  OrderStatus,
} from "@/components/seller/orders/types";

export default function SellerOrdersPage() {
  const [items, setItems] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<OrderStatus | "ALL">("ALL");

  const total = useMemo(() => items.length, [items]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // If your backend supports filter: ?status=
      const qs = status === "ALL" ? "" : `?status=${status}`;

      const res = await clientFetch<SellerOrdersApiResponse>(
        `api/orders/seller/all${qs}`,
        {
          method: "GET",
        },
      );

      if (res.error) throw new Error(res.error.message);

      // backend may return { success, message, data, ...pagination }
      const list = (res.data as any)?.data ?? [];
      setItems(Array.isArray(list) ? list : []);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load orders");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  // If backend doesn't support ?status, we still filter client-side
  const visible = useMemo(() => {
    if (status === "ALL") return items;
    return items.filter((o) => o.status === status);
  }, [items, status]);

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardHeader className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Seller Orders</CardTitle>
            <div className="text-sm opacity-70">Total: {total}</div>
          </div>

          <OrdersToolbar
            status={status}
            onStatusChange={(v) => setStatus(v)}
            onRefresh={load}
          />
        </CardHeader>

        <CardContent className="space-y-4">
          {loading ? (
            <div className="py-10 text-center text-sm opacity-70">
              Loading orders...
            </div>
          ) : (
            <OrdersTable orders={visible} onChanged={load} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
