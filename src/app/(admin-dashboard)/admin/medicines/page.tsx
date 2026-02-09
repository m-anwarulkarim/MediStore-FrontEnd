/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { clientFetch } from "@/lib/fetch/clientFetch";
import type { Medicine } from "@/components/types/medicine";
import { MedicinesTable } from "@/components/admin/medicines/MedicinesTable";
import {
  MedicineFilters,
  type MedicineFiltersValue,
} from "@/components/admin/medicines/MedicineFilters";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type MedicinesApiResponse = {
  success: boolean;
  data: Medicine[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPage?: number;
  };
  message?: string;
};

export default function AdminMedicinesPage() {
  const [items, setItems] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<MedicineFiltersValue>({
    search: "",
  });

  const [page, setPage] = useState(1);
  const limit = 10;

  const canPrev = page > 1;

  const title = useMemo(() => {
    return filters.search
      ? `Medicines (search: "${filters.search}")`
      : "All Medicines";
  }, [filters.search]);

  const load = async (nextPage = page) => {
    setLoading(true);
    try {
      const res = await clientFetch<MedicinesApiResponse>("/api/medicines", {
        method: "GET",
        queryParams: {
          page: nextPage,
          limit,
          searchTerm: filters.search,
          // search: filters.search,     // যদি search নামে থাকে,
        },
      });

      if (res.error) throw new Error(res.error.message);

      // backend shape: { success, data: [...] }
      const list = res.data?.data ?? [];
      setItems(Array.isArray(list) ? list : []);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load medicines");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    setPage(1);
    load(1);
  };

  const handleReset = () => {
    const next = { search: "" };
    setFilters(next);
    setPage(1);
    // reset দিয়ে immediate reload
    setTimeout(() => load(1), 0);
  };

  const goPrev = () => {
    if (!canPrev) return;
    const next = page - 1;
    setPage(next);
    load(next);
  };

  const goNext = () => {
    const next = page + 1;
    setPage(next);
    load(next);
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <MedicineFilters
            value={filters}
            onChange={setFilters}
            onSearch={handleSearch}
            onReset={handleReset}
            loading={loading}
          />

          {loading ? (
            <div className="py-10 text-center text-sm opacity-70">
              Loading...
            </div>
          ) : (
            <MedicinesTable items={items} />
          )}

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={goPrev}
              disabled={loading || !canPrev}
            >
              Previous
            </Button>
            <div className="text-sm opacity-70">Page: {page}</div>
            <Button variant="outline" onClick={goNext} disabled={loading}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
