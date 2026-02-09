"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MedicinesSummaryCard({ total }: { total: number }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Medicines</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{total}</div>
        <div className="text-sm opacity-70">Total Medicines</div>
      </CardContent>
    </Card>
  );
}
