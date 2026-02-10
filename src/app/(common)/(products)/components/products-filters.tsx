"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

type Option = { value: string; label: string };

type ProductsFiltersProps = {
  categories: Option[];
  manufacturers: Option[];
};

export function ProductsFilters({
  categories,
  manufacturers,
}: ProductsFiltersProps) {
  const router = useRouter();
  const sp = useSearchParams();

  const initial = useMemo(() => {
    return {
      search: sp.get("search") ?? "",
      category: sp.get("category") ?? "all",
      manufacturer: sp.get("manufacturer") ?? "all",
      minPrice: sp.get("minPrice") ?? "",
      maxPrice: sp.get("maxPrice") ?? "",
    };
  }, [sp]);

  const [search, setSearch] = useState(initial.search);
  const [category, setCategory] = useState(initial.category);
  const [manufacturer, setManufacturer] = useState(initial.manufacturer);
  const [minPrice, setMinPrice] = useState(initial.minPrice);
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice);

  const apply = () => {
    const query = new URLSearchParams(sp.toString());

    const setOrDel = (key: string, val: string) => {
      const v = val.trim();
      if (!v || v === "all") query.delete(key);
      else query.set(key, v);
    };

    setOrDel("search", search);
    setOrDel("category", category);
    setOrDel("manufacturer", manufacturer);
    setOrDel("minPrice", minPrice);
    setOrDel("maxPrice", maxPrice);

    router.push(`/products?${query.toString()}`);
  };

  const reset = () => {
    router.push("/products");
  };

  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        {/* Search */}
        <div className="md:col-span-4">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            onKeyDown={(e) => {
              if (e.key === "Enter") apply();
            }}
          />
        </div>

        {/* Category */}
        <div className="md:col-span-3">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Manufacturer */}
        <div className="md:col-span-3">
          <Select value={manufacturer} onValueChange={setManufacturer}>
            <SelectTrigger>
              <SelectValue placeholder="Manufacturer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All manufacturers</SelectItem>
              {manufacturers.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price */}
        <div className="md:col-span-2 grid grid-cols-2 gap-2">
          <Input
            inputMode="numeric"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
          />
          <Input
            inputMode="numeric"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
          />
        </div>

        {/* Actions */}
        <div className="md:col-span-12 flex flex-wrap gap-2 justify-end pt-1">
          <Button onClick={apply}>Apply</Button>
          <Button variant="outline" onClick={reset}>
            <X className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
}
