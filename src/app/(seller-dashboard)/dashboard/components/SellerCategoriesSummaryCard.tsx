import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SellerCategoriesSummaryCard({ total }: { total: number }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{total}</div>
        <p className="text-xs text-muted-foreground">Categories you use</p>
      </CardContent>
    </Card>
  );
}
