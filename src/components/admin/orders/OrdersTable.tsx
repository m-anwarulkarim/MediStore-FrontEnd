"use client";

import type { Order, OrderStatus } from "@/components/types/order";
import { OrderStatusSelect } from "./OrderStatusSelect";
import { OrderDetailsDialog } from "./OrderDetailsDialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function OrdersTable({
  items,
  onStatusUpdated,
}: {
  items: Order[];
  onStatusUpdated?: (orderId: string, status: OrderStatus) => void;
}) {
  return (
    <div className="rounded-xl border bg-background overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Update</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-10 text-center text-sm opacity-70"
              >
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            items.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">
                  {o.orderNumber || o.id}
                </TableCell>

                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {o.user?.name || "N/A"}
                    </span>
                    <span className="text-xs opacity-70">
                      {o.user?.email || ""}
                    </span>
                  </div>
                </TableCell>

                <TableCell>{o.total ?? "N/A"}</TableCell>

                <TableCell>
                  <Badge variant="secondary">{o.status}</Badge>
                </TableCell>

                <TableCell>
                  <OrderStatusSelect
                    orderId={o.id}
                    currentStatus={o.status}
                    onChanged={(s) => onStatusUpdated?.(o.id, s)}
                  />
                </TableCell>

                <TableCell className="text-right">
                  <OrderDetailsDialog orderId={o.id} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
