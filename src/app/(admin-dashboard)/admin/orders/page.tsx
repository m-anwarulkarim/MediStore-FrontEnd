/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { clientFetch } from "@/lib/fetch/clientFetch";

import type { Order, OrderStatus } from "@/components/types/order";
import { OrdersTable } from "@/components/admin/orders/OrdersTable";
import {
  OrderFilters,
  type OrderFiltersValue,
} from "@/components/admin/orders/OrderFilters";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type OrdersApiResponse = {
  success: boolean;
  data: Order[];
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPage?: number;
  };
};

export default function AdminOrdersPage() {
  const [items, setItems] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<OrderFiltersValue>({ search: "" });

  const [page, setPage] = useState(1);
  const limit = 10;

  const title = useMemo(() => {
    return filters.search
      ? `Orders (search: "${filters.search}")`
      : "All Orders";
  }, [filters.search]);

  const load = async (nextPage = page) => {
    setLoading(true);
    try {
      const res = await clientFetch<OrdersApiResponse>("api/orders/admin/all", {
        method: "GET",
        queryParams: {
          page: nextPage,
          limit,
          searchTerm: filters.search, // backend param নাম ভিন্ন হলে বদলাও
        },
      });

      if (res.error) throw new Error(res.error.message);

      const list = res.data?.data ?? [];
      setItems(Array.isArray(list) ? list : []);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load orders");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    setPage(1);
    load(1);
  };

  const handleReset = () => {
    setFilters({ search: "" });
    setPage(1);
    setTimeout(() => load(1), 0);
  };

  const goPrev = () => {
    if (page <= 1) return;
    const next = page - 1;
    setPage(next);
    load(next);
  };

  const goNext = () => {
    const next = page + 1;
    setPage(next);
    load(next);
  };

  const onStatusUpdated = (orderId: string, status: OrderStatus) => {
    // optimistic UI (optional)
    setItems((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <OrderFilters
            value={filters}
            onChange={setFilters}
            onSearch={handleSearch}
            onReset={handleReset}
            loading={loading}
          />

          {loading ? (
            <div className="py-10 text-center text-sm opacity-70">
              Loading...
            </div>
          ) : (
            <OrdersTable items={items} onStatusUpdated={onStatusUpdated} />
          )}

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={goPrev}
              disabled={loading || page <= 1}
            >
              Previous
            </Button>
            <div className="text-sm opacity-70">Page: {page}</div>
            <Button variant="outline" onClick={goNext} disabled={loading}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
