"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type MedicineFiltersValue = {
  search: string;
};

export function MedicineFilters({
  value,
  onChange,
  onSearch,
  onReset,
  loading,
}: {
  value: MedicineFiltersValue;
  onChange: (next: MedicineFiltersValue) => void;
  onSearch: () => void;
  onReset: () => void;
  loading?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="w-full md:max-w-md space-y-2">
        <label className="text-sm font-medium">Search medicine</label>
        <Input
          placeholder="Search by name..."
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
