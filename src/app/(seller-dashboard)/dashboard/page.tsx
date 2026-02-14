/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverFetch } from "@/lib/fetch/serverFetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { SellerOrdersSummaryCard } from "./components/SellerOrdersSummaryCard";
import { SellerMedicinesSummaryCard } from "./components/SellerMedicinesSummaryCard";
import { SellerCategoriesSummaryCard } from "./components/SellerCategoriesSummaryCard";
import { SellerReviewsSummaryCard } from "./components/SellerReviewsSummaryCard";
import { getMe } from "@/lib/auth/get-me";
import { redirect } from "next/navigation";

const SellerPage = async () => {
  const user = await getMe();

  if (!user) redirect("/login");

  if (user.role === "ADMIN") redirect("/admin");
  if (user.role !== "SELLER") redirect("/");

  const [ordersRes, medicinesRes, categoriesRes, reviewsRes] =
    await Promise.all([
      serverFetch<{ success: boolean; data: any[] }>("api/orders/seller/all"),
      serverFetch<{ success: boolean; data: any[] }>("api/medicines/seller/my"),
      serverFetch<{ success: boolean; data: any[] }>("api/categories"),
      serverFetch<{ success: boolean; data: any[] }>("api/reviews/seller/all"),
    ]);

  const totalOrders = ordersRes.data?.data?.length ?? 0;
  const totalMedicines = medicinesRes.data?.data?.length ?? 0;
  const totalCategories = categoriesRes.data?.data?.length ?? 0;
  const totalReviews = reviewsRes.data?.data?.length ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">
        Seller Dashboard
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SellerOrdersSummaryCard total={totalOrders} />
        <SellerMedicinesSummaryCard total={totalMedicines} />
        <SellerCategoriesSummaryCard total={totalCategories} />
        <SellerReviewsSummaryCard total={totalReviews} />
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/orders"
            className="text-sm text-primary hover:underline"
          >
            Manage Orders →
          </Link>

          <Link
            href="/dashboard/products"
            className="text-sm text-primary hover:underline"
          >
            Manage Medicines →
          </Link>

          <Link
            href="/dashboard/categories"
            className="text-sm text-primary hover:underline"
          >
            Manage Categories →
          </Link>

          <Link
            href="/dashboard/reviews"
            className="text-sm text-primary hover:underline"
          >
            View Reviews →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerPage;
