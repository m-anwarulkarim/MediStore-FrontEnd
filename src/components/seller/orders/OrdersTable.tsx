"use client";

import Link from "next/link";
import type { SellerOrder } from "./types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { UpdateOrderStatusSelect } from "./UpdateOrderStatusSelect";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function OrdersTable({
  orders,
  onChanged,
}: {
  orders: SellerOrder[];
  onChanged: () => void;
}) {
  return (
    <div className="rounded-2xl border bg-background overflow-hidden">
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="min-w-[180px]">Order</TableHead>
              <TableHead className="min-w-[180px]">Date</TableHead>
              <TableHead className="w-[120px]">Total</TableHead>
              <TableHead className="w-[140px]">Status</TableHead>
              <TableHead className="w-[260px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-sm opacity-70"
                >
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((o) => (
                <TableRow key={o.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex flex-col">
                      <Link
                        href={`/dashboard/orders/${o.id}`}
                        className="font-medium hover:underline"
                      >
                        #{o.orderNumber}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        {o.itemsCount != null ? `Items: ${o.itemsCount}` : ""}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(o.createdAt)}
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">৳ {o.total}</span>
                      <span className="text-xs text-muted-foreground">
                        Subtotal: ৳ {o.subtotal}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary">{o.status}</Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <UpdateOrderStatusSelect
                        orderId={o.id}
                        value={o.status}
                        onSuccess={onChanged}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
