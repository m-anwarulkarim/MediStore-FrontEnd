"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type OrderFiltersValue = {
  search: string; // orderNumber or email
};

export function OrderFilters({
  value,
  onChange,
  onSearch,
  onReset,
  loading,
}: {
  value: OrderFiltersValue;
  onChange: (next: OrderFiltersValue) => void;
  onSearch: () => void;
  onReset: () => void;
  loading?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="w-full md:max-w-md space-y-2">
        <label className="text-sm font-medium">Search orders</label>
        <Input
          placeholder="Search by order number / customer email..."
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={onSearch} disabled={loading}>
          Search
        </Button>
        <Button variant="outline" onClick={onReset} disabled={loading}>
          Reset
        </Button>
      </div>
    </div>
  );
}
