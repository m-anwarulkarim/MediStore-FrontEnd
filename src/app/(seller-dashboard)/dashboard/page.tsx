/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clientFetch } from "@/lib/fetch/clientFetch";
import { getMe } from "@/lib/auth/get-me";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

import { SellerOrdersSummaryCard } from "./components/SellerOrdersSummaryCard";
import { SellerMedicinesSummaryCard } from "./components/SellerMedicinesSummaryCard";
import { SellerCategoriesSummaryCard } from "./components/SellerCategoriesSummaryCard";
import { SellerReviewsSummaryCard } from "./components/SellerReviewsSummaryCard";

const SellerPage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    orders: 0,
    medicines: 0,
    categories: 0,
    reviews: 0,
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      const user = await getMe();

      if (!user) {
        router.replace("/login");
        return;
      }

      if (user.role === "ADMIN") {
        router.replace("/admin");
        return;
      }

      if (user.role !== "SELLER") {
        router.replace("/");
        return;
      }

      const [ordersRes, medicinesRes, categoriesRes, reviewsRes] =
        await Promise.all([
          clientFetch<{ success: boolean; data: any[] }>(
            "api/orders/seller/all",
          ),
          clientFetch<{ success: boolean; data: any[] }>(
            "api/medicines/seller/my",
          ),
          clientFetch<{ success: boolean; data: any[] }>("api/categories"),
          clientFetch<{ success: boolean; data: any[] }>(
            "api/reviews/seller/all",
          ),
        ]);

      if (!mounted) return;

      setTotals({
        orders: ordersRes.data?.data?.length ?? 0,
        medicines: medicinesRes.data?.data?.length ?? 0,
        categories: categoriesRes.data?.data?.length ?? 0,
        reviews: reviewsRes.data?.data?.length ?? 0,
      });

      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">
        Seller Dashboard
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SellerOrdersSummaryCard total={totals.orders} />
        <SellerMedicinesSummaryCard total={totals.medicines} />
        <SellerCategoriesSummaryCard total={totals.categories} />
        <SellerReviewsSummaryCard total={totals.reviews} />
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-3">
          <Link href="/dashboard/orders" className="text-sm text-primary hover:underline">
            Manage Orders →
          </Link>

          <Link href="/dashboard/products" className="text-sm text-primary hover:underline">
            Manage Medicines →
          </Link>

          <Link href="/dashboard/categories" className="text-sm text-primary hover:underline">
            Manage Categories →
          </Link>

          <Link href="/dashboard/reviews" className="text-sm text-primary hover:underline">
            View Reviews →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerPage;