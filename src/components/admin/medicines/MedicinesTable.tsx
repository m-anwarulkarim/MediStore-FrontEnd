"use client";

import type { Medicine } from "@/components/types/medicine";
import { MedicineActions } from "./MedicineActions";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function MedicinesTable({ items }: { items: Medicine[] }) {
  return (
    <div className="rounded-xl border bg-background overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Medicine</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Seller</TableHead>
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
                No medicines found
              </TableCell>
            </TableRow>
          ) : (
            items.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.name}</TableCell>

                <TableCell>
                  {m.category?.name ? (
                    <Badge variant="secondary">{m.category.name}</Badge>
                  ) : (
                    <span className="text-sm opacity-70">N/A</span>
                  )}
                </TableCell>

                <TableCell>{m.price}</TableCell>

                <TableCell>
                  {typeof m.stock === "number" ? (
                    m.stock
                  ) : (
                    <span className="opacity-70">—</span>
                  )}
                </TableCell>

                <TableCell>
                  {m.seller?.name ? (
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {m.seller.name}
                      </span>
                      {m.seller.email ? (
                        <span className="text-xs opacity-70">
                          {m.seller.email}
                        </span>
                      ) : null}
                    </div>
                  ) : (
                    <span className="text-sm opacity-70">N/A</span>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <MedicineActions id={m.id} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
