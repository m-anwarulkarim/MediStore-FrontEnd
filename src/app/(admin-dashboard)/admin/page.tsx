/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverFetch } from "@/lib/fetch/serverFetch";

import { UsersSummaryCard } from "./dashboard/components/UsersSummaryCard";
import { OrdersSummaryCard } from "./dashboard/components/OrdersSummaryCard";
import { CategoriesSummaryCard } from "./dashboard/components/CategoriesSummaryCard";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { MedicinesSummaryCard } from "./dashboard/components/MedicinesSummaryCard";

const AdminPage = async () => {
  const [usersRes, ordersRes, medicinesRes, categoriesRes] = await Promise.all([
    serverFetch<{ success: boolean; data: any[] }>("api/admin/users"),
    serverFetch<{ success: boolean; data: any[] }>("api/orders/admin/all"),
    serverFetch<{ success: boolean; data: any[] }>("api/medicines"),
    serverFetch<{ success: boolean; data: any[] }>("api/categories"),
  ]);

  const totalUsers = usersRes.data?.data?.length ?? 0;
  const totalOrders = ordersRes.data?.data?.length ?? 0;
  const totalMedicines = medicinesRes.data?.data?.length ?? 0;
  const totalCategories = categoriesRes.data?.data?.length ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <UsersSummaryCard total={totalUsers} />
        <OrdersSummaryCard total={totalOrders} />
        <MedicinesSummaryCard total={totalMedicines} />
        <CategoriesSummaryCard total={totalCategories} />
      </div>

      {/* Quick Access */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link
            href="/admin/users"
            className="text-sm text-primary hover:underline"
          >
            Manage Users →
          </Link>
          <Link
            href="/admin/medicines"
            className="text-sm text-primary hover:underline"
          >
            Manage Medicines →
          </Link>
          <Link
            href="/admin/categories"
            className="text-sm text-primary hover:underline"
          >
            Manage Categories →
          </Link>
          <Link
            href="/admin/orders"
            className="text-sm text-primary hover:underline"
          >
            Manage Orders →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
