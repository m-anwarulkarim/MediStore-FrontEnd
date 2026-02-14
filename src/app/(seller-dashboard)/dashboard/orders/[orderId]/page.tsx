/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverFetch } from "@/lib/fetch/serverFetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function SellerOrderDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const { data, error } = await serverFetch(`api/orders/${orderId}`, {
    method: "GET",
    cache: "no-store",
  });

  if (error) {
    return (
      <div className="py-10 text-center text-sm text-destructive">
        Failed to load order details.
      </div>
    );
  }

  const order = (data as any)?.data ?? data;

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-xl border p-4">
              <div className="text-sm opacity-70">Order Number</div>
              <div className="font-medium">#{order?.orderNumber}</div>
              <div className="mt-2 text-sm opacity-70">Status</div>
              <div className="font-medium">{order?.status}</div>
            </div>

            <div className="rounded-xl border p-4">
              <div className="text-sm opacity-70">Total</div>
              <div className="font-medium">৳ {order?.total}</div>
              <div className="mt-2 text-sm opacity-70">Created At</div>
              <div className="font-medium">
                {String(order?.createdAt ?? "")}
              </div>
            </div>
          </div>

          <Separator />

          <div className="rounded-xl border p-4">
            <div className="font-medium mb-2">Shipping Address</div>
            <div className="text-sm text-muted-foreground">
              {order?.address?.fullName ?? "—"} <br />
              {order?.address?.phone ?? "—"} <br />
              {order?.address?.addressLine ?? "—"}
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <div className="font-medium mb-2">Items</div>

            {Array.isArray(order?.items) && order.items.length > 0 ? (
              <div className="space-y-2">
                {order.items.map((it: any) => (
                  <div
                    key={it.id}
                    className="flex items-center justify-between gap-3 rounded-lg border p-3"
                  >
                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {it?.medicine?.name ?? "Medicine"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Qty: {it?.quantity} • Price: ৳ {it?.price}
                      </div>
                    </div>
                    <div className="font-medium">
                      ৳ {it?.quantity * it?.price}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm opacity-70">No items found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
