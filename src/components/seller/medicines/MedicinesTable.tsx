"use client";

import Image from "next/image";
import type { SellerMedicine } from "@/components/types/medicine";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { MedicineFormDialog } from "./MedicineFormDialog";
import { DeleteMedicineDialog } from "./DeleteMedicineDialog";
import { StockUpdateDialog } from "./StockUpdateDialog";

import { isValidImageSrc } from "@/lib/safeImage";

export function MedicinesTable({
  medicines,
  onChanged,
}: {
  medicines: SellerMedicine[];
  onChanged: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-background">
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead className="min-w-[200px]">Name</TableHead>
              <TableHead className="w-[140px]">Price</TableHead>
              <TableHead className="w-[180px]">Manufacturer</TableHead>
              <TableHead className="w-[160px]">Category</TableHead>
              <TableHead className="w-[220px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {medicines.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-sm opacity-70"
                >
                  No medicines found
                </TableCell>
              </TableRow>
            ) : (
              medicines.map((med) => {
                const thumb = med.images?.[0];

                return (
                  <TableRow key={med.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-muted">
                        {isValidImageSrc(thumb) ? (
                          <Image
                            src={thumb}
                            alt={med.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 object-cover"
                          />
                        ) : (
                          <span className="text-xs opacity-60">N/A</span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="font-medium">
                      <span className="block max-w-[220px] truncate sm:max-w-none">
                        {med.name}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span>৳ {med.price}</span>
                        {med.discountPrice != null ? (
                          <Badge variant="secondary" className="mt-1 w-fit">
                            Discount: ৳ {med.discountPrice}
                          </Badge>
                        ) : null}
                      </div>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      <span className="block max-w-[180px] truncate sm:max-w-none">
                        {med.manufacturer}
                      </span>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {med.category?.name || "—"}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <StockUpdateDialog
                          medicineId={med.id}
                          medicineName={med.name}
                          currentStock={med.stock ?? 0}
                          onSuccess={onChanged}
                        />

                        <MedicineFormDialog
                          mode="edit"
                          initial={med}
                          onSuccess={onChanged}
                        />

                        <DeleteMedicineDialog
                          medicineId={med.id}
                          medicineName={med.name}
                          onSuccess={onChanged}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
