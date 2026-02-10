/* eslint-disable @typescript-eslint/no-explicit-any */

import { serverFetch } from "@/lib/fetch/serverFetch";
import FlashSaleProducts from "./flash-sale-products";

export default async function HomeFlashSaleSection() {
  const res = await serverFetch(
    "/api/medicines?page=1&limit=4&sortBy=createdAt&sortOrder=desc",
    {
      method: "GET",
      cache: "no-store",
    },
  );

  const medicines = res?.data?.data ?? res?.data ?? [];

  const listKey = medicines.map((m: any) => String(m.id)).join("-");

  return <FlashSaleProducts key={listKey} medicines={medicines} />;
}
