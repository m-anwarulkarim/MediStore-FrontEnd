```tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { clientFetch } from "@/lib/fetch/clientFetch";

import { UsersSummaryCard } from "./dashboard/components/UsersSummaryCard";
import { OrdersSummaryCard } from "./dashboard/components/OrdersSummaryCard";
import { CategoriesSummaryCard } from "./dashboard/components/CategoriesSummaryCard";
import { MedicinesSummaryCard } from "./dashboard/components/MedicinesSummaryCard";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

type ApiList<T = any> = { success: boolean; data: T[] };

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);

      const [usersRes, ordersRes, medicinesRes, categoriesRes] =
        await Promise.all([
          clientFetch<ApiList>("api/admin/users"),
          clientFetch<ApiList>("api/orders/admin/all"),
          clientFetch<ApiList>("api/medicines"),
          clientFetch<ApiList>("api/categories"),
        ]);

      if (!mounted) return;

      if (usersRes.data?.data) setUsers(usersRes.data.data);
      if (ordersRes.data?.data) setOrders(ordersRes.data.data);
      if (medicinesRes.data?.data) setMedicines(medicinesRes.data.data);
      if (categoriesRes.data?.data) setCategories(categoriesRes.data.data);

      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const totalUsers = useMemo(() => users.length, [users]);
  const totalOrders = useMemo(() => orders.length, [orders]);
  const totalMedicines = useMemo(() => medicines.length, [medicines]);
  const totalCategories = useMemo(() => categories.length, [categories]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <UsersSummaryCard total={totalUsers} />
            <OrdersSummaryCard total={totalOrders} />
            <MedicinesSummaryCard total={totalMedicines} />
            <CategoriesSummaryCard total={totalCategories} />
          </div>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Link href="/admin/users" className="text-sm text-primary hover:underline">
                Manage Users →
              </Link>
              <Link href="/admin/medicines" className="text-sm text-primary hover:underline">
                Manage Medicines →
              </Link>
              <Link href="/admin/categories" className="text-sm text-primary hover:underline">
                Manage Categories →
              </Link>
              <Link href="/admin/orders" className="text-sm text-primary hover:underline">
                Manage Orders →
              </Link>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
```