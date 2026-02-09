/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const AdminCategoriesTable = ({ categories }: { categories: any[] }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-semibold tracking-tight">
        Manage Categories
      </h2>

      <div className="rounded-2xl border bg-background overflow-hidden">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[140px] text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-10 text-center text-sm opacity-70"
                  >
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((cat) => (
                  <TableRow key={cat.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                        {cat.image ? (
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-xs opacity-60">N/A</span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="font-medium">{cat.name}</TableCell>

                    <TableCell className="text-sm text-muted-foreground max-w-[400px] truncate">
                      {cat.description || "—"}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/categories/${cat.id}`}>Manage</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminCategoriesTable;
