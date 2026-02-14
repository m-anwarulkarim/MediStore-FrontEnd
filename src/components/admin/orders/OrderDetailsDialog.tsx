"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { clientFetch } from "@/lib/fetch/clientFetch";
import { toast } from "sonner";
import type { Order } from "@/components/types/order";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export function OrderDetailsDialog({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await clientFetch<{ success: boolean; data: Order }>(
        `api/orders/${orderId}`,
        { method: "GET" },
      );
      if (res.error) throw new Error(res.error.message);
      setOrder(res.data?.data ?? null);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Details
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-10 text-center text-sm opacity-70">Loading...</div>
        ) : !order ? (
          <div className="py-10 text-center text-sm opacity-70">No data</div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="text-sm">
                <span className="font-medium">Order:</span>{" "}
                {order.orderNumber || order.id}
              </div>
              <div className="text-sm">
                <span className="font-medium">Customer:</span>{" "}
                {order.user?.name || "N/A"} ({order.user?.email || "N/A"})
              </div>
              <div className="text-sm">
                <span className="font-medium">Status:</span> {order.status}
              </div>
              <div className="text-sm">
                <span className="font-medium">Total:</span>{" "}
                {order.total ?? "N/A"}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="text-sm font-medium">Items</div>
              {order.items?.length ? (
                <div className="space-y-2">
                  {order.items.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="text-sm">
                        {it.medicine?.name || "Unknown medicine"}
                        <div className="text-xs opacity-70">
                          Qty: {it.quantity}
                        </div>
                      </div>
                      <div className="text-sm font-medium">{it.price}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm opacity-70">No items found</div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
