"use client";

import Image from "next/image";
import type { Category } from "@/components/types/category";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { CategoryFormDialog } from "./CategoryFormDialog";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";

export function CategoriesTable({
  categories,
  onChanged,
}: {
  categories: Category[];
  onChanged: () => void;
}) {
  return (
    <div className="rounded-2xl border bg-background overflow-hidden">
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead className="min-w-[200px]">Name</TableHead>
              <TableHead className="min-w-[320px]">Description</TableHead>
              <TableHead className="w-[160px]">Medicines</TableHead>
              <TableHead className="w-[220px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-sm opacity-70"
                >
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => {
                const count = cat.totalMedicines ?? cat._count?.medicines ?? 0;

                return (
                  <TableRow key={cat.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted overflow-hidden">
                        {cat.image ? (
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-xs opacity-60">N/A</span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="font-medium">{cat.name}</TableCell>

                    <TableCell className="text-sm text-muted-foreground max-w-[520px] truncate">
                      {cat.description || "—"}
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary">{count}</Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <CategoryFormDialog
                          mode="edit"
                          initial={cat}
                          onSuccess={onChanged}
                        />
                        <DeleteCategoryDialog
                          categoryId={cat.id}
                          categoryName={cat.name}
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
