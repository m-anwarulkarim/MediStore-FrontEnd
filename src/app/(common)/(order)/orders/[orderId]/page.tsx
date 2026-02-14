/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { orderService } from "@/services/order/order.service";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import ReviewDialog from "@/components/reviews/ReviewDialog";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  medicine: {
    id: string | number;
    name: string;
    image?: string | null;
    slug?: string | null;
  };
};

type OrderDetails = {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  total: number;
  createdAt: string;
  deliveredAt?: string | null;
  address: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    area?: string | null;
    postalCode?: string | null;
    country: string;
  };
  orderItems: OrderItem[];
};

const STATUS_FLOW = [
  "PLACED",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);

      const res = await orderService.getOrderDetails(orderId);

      if (!alive) return;

      setLoading(false);

      if (res.error) {
        toast.error(res.error.message || "Failed to load order");
        return;
      }

      const data = (res.data as any)?.data ?? res.data;
      setOrder(data);
    })();

    return () => {
      alive = false;
    };
  }, [orderId]);

  const stepIndex = useMemo(() => {
    const current = order?.status || "PLACED";
    const idx = STATUS_FLOW.indexOf(current);
    return idx === -1 ? 0 : idx;
  }, [order?.status]);

  if (loading) {
    return <div className="mx-auto max-w-6xl px-4 py-10">Loading...</div>;
  }

  if (!order) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">
            Placed: {new Date(order.createdAt).toLocaleString()}
          </p>
          {order.deliveredAt ? (
            <p className="text-sm text-muted-foreground">
              Delivered: {new Date(order.deliveredAt).toLocaleString()}
            </p>
          ) : null}
        </div>

        <Badge variant="outline" className="w-fit">
          {order.status}
        </Badge>
      </div>

      {/* Status Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-5">
            {STATUS_FLOW.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={[
                    "h-3 w-3 rounded-full border",
                    i <= stepIndex ? "bg-primary border-primary" : "bg-muted",
                  ].join(" ")}
                />
                <p className="text-sm">{s}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {order.orderItems.map((it) => (
            <div
              key={it.id}
              className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium line-clamp-1">{it.medicine.name}</p>
                <p className="text-sm text-muted-foreground">
                  Qty: {it.quantity}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <p className="font-semibold">
                  ৳ {(Number(it.price) * it.quantity).toFixed(2)}
                </p>

                {/* Optional: product link */}
                <Button asChild size="sm" variant="outline">
                  <Link href={`/products/${it.medicine.id}`}>View</Link>
                </Button>

                {/* ✅ Review option only when delivered */}
                {order.status === "DELIVERED" ? (
                  <ReviewDialog
                    medicineId={String(it.medicine.id)}
                    medicineName={it.medicine.name}
                    orderId={order.id}
                  />
                ) : null}
              </div>
            </div>
          ))}

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total</span>
            <span className="text-lg font-bold">
              ৳ {Number(order.total).toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Address</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <p className="font-semibold">{order.address.fullName}</p>
          <p className="text-muted-foreground">{order.address.phone}</p>
          <p>
            {order.address.addressLine},{" "}
            {order.address.area ? `${order.address.area}, ` : ""}
            {order.address.city}
            {order.address.postalCode
              ? ` - ${order.address.postalCode}`
              : ""}, {order.address.country}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
