/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { clientFetch } from "@/lib/fetch/clientFetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { SellerMedicine } from "@/components/types/medicine";
import { MedicineFormDialog } from "@/components/seller/medicines/MedicineFormDialog";
import { MedicinesTable } from "@/components/seller/medicines/MedicinesTable";
import { MedicinesToolbar } from "@/components/seller/medicines/MedicinesToolbar";
import { PaginationControls } from "@/components/seller/medicines/PaginationControls";
import { useDebounce } from "@/hooks/useDebounce";

type SellerMedicinesResponse = {
  success: boolean;
  data: SellerMedicine[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type CategoryOption = { id: string; name: string };
type CategoriesApiResponse = { success: boolean; data: CategoryOption[] };

function qp(sp: URLSearchParams, key: string, fallback: string) {
  return sp.get(key) ?? fallback;
}

export default function SellerMedicinesPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // query-driven state
  const [search, setSearch] = useState(qp(sp, "search", ""));
  const debouncedSearch = useDebounce(search, 450);

  const [categoryId, setCategoryId] = useState(qp(sp, "categoryId", "all"));
  const [status, setStatus] = useState<"active" | "archived">(
    (qp(sp, "status", "active") as any) || "active",
  );

  const [sortBy, setSortBy] = useState(qp(sp, "sortBy", "createdAt"));
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (qp(sp, "sortOrder", "desc") as any) || "desc",
  );

  const [page, setPage] = useState(Number(qp(sp, "page", "1")));
  const [limit, setLimit] = useState(Number(qp(sp, "limit", "10")));

  // data
  const [items, setItems] = useState<SellerMedicine[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // categories
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  const total = useMemo(() => items.length, [items]);

  // sync state -> URL
  const pushQuery = useCallback(
    (next: {
      search?: string;
      categoryId?: string;
      status?: "active" | "archived";
      sortBy?: string;
      sortOrder?: "asc" | "desc";
      page?: number;
      limit?: number;
    }) => {
      const params = new URLSearchParams(sp.toString());

      const mapSet = (k: string, v: string) => {
        if (!v || v === "all") params.delete(k);
        else params.set(k, v);
      };

      mapSet("search", next.search ?? debouncedSearch);
      mapSet("categoryId", next.categoryId ?? categoryId);
      mapSet("status", next.status ?? status);
      mapSet("sortBy", next.sortBy ?? sortBy);
      mapSet("sortOrder", next.sortOrder ?? sortOrder);

      params.set("page", String(next.page ?? page));
      params.set("limit", String(next.limit ?? limit));

      router.push(`?${params.toString()}`);
    },
    [
      sp,
      router,
      debouncedSearch,
      categoryId,
      status,
      sortBy,
      sortOrder,
      page,
      limit,
    ],
  );

  const loadCategories = useCallback(async () => {
    try {
      const res = await clientFetch<CategoriesApiResponse>("api/categories", {
        method: "GET",
      });
      if (res.error) throw new Error(res.error.message);
      setCategories(res.data?.data ?? []);
    } catch {
      setCategories([]);
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();

      // ✅ Seller-only endpoint
      query.set("page", String(page));
      query.set("limit", String(limit));
      query.set("sortBy", sortBy);
      query.set("sortOrder", sortOrder);
      query.set("isActive", status === "active" ? "true" : "false");

      if (debouncedSearch.trim()) query.set("search", debouncedSearch.trim());
      if (categoryId !== "all") query.set("categoryId", categoryId);

      const res = await clientFetch<SellerMedicinesResponse>(
        `api/medicines/seller/my?${query.toString()}`,
        { method: "GET" },
      );

      if (res.error) throw new Error(res.error.message);

      setItems(res.data?.data ?? []);
      setTotalPages(res.data?.totalPages ?? 1);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load medicines");
      setItems([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy, sortOrder, status, debouncedSearch, categoryId]);

  // initial categories load
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // whenever state changes, refresh + sync URL
  useEffect(() => {
    pushQuery({});
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, sortBy, sortOrder, status, debouncedSearch, categoryId]);

  const onClear = () => {
    setSearch("");
    setCategoryId("all");
    setStatus("active");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
    setLimit(10);
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>My Medicines</CardTitle>

          <MedicineFormDialog
            mode="create"
            onSuccess={load}
            trigger={<Button size="sm">Add Medicine</Button>}
          />
        </CardHeader>

        <CardContent className="space-y-4">
          <MedicinesToolbar
            search={search}
            onSearchChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            categoryId={categoryId}
            onCategoryChange={(v) => {
              setCategoryId(v);
              setPage(1);
            }}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortByChange={(v) => {
              setSortBy(v);
              setPage(1);
            }}
            onSortOrderChange={(v) => {
              setSortOrder(v);
              setPage(1);
            }}
            status={status}
            onStatusChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            limit={limit}
            onLimitChange={(v) => {
              setLimit(v);
              setPage(1);
            }}
            categories={categories}
            onClear={onClear}
          />

          <div className="text-sm opacity-70">Showing: {total}</div>

          {loading ? (
            <div className="py-10 text-center text-sm opacity-70">
              Loading medicines...
            </div>
          ) : (
            <>
              <MedicinesTable medicines={items} onChanged={load} />
              <PaginationControls
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
