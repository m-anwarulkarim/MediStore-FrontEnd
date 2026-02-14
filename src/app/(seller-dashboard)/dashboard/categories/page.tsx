/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { clientFetch } from "@/lib/fetch/clientFetch";
import type { Category } from "@/components/types/category";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryFormDialog } from "@/components/admin/categories/CategoryFormDialog";
import { CategoriesTable } from "@/components/admin/categories/CategoriesTable";
import { Button } from "@/components/ui/button";

type CategoriesApiResponse = {
  success: boolean;
  data: Category[];
  message?: string;
};

export default function SellerCategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const total = useMemo(() => items.length, [items]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await clientFetch<CategoriesApiResponse>("api/categories", {
        method: "GET",
      });

      if (res.error) throw new Error(res.error.message);

      // server returns: { success, data: [...] }
      const list = res.data?.data ?? [];
      setItems(Array.isArray(list) ? list : []);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load categories");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>Categories</CardTitle>

          <CategoryFormDialog
            mode="create"
            onSuccess={load}
            trigger={
              <Button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
                Add Category
              </Button>
            }
          />
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-sm opacity-70">Total: {total}</div>

          {loading ? (
            <div className="py-10 text-center text-sm opacity-70">
              Loading...
            </div>
          ) : (
            <CategoriesTable categories={items} onChanged={load} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
