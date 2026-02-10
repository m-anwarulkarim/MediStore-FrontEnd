/* eslint-disable @typescript-eslint/no-explicit-any */
import MedicineCard from "@/components/products/productPage";
import { serverFetch } from "@/lib/fetch/serverFetch";

export default async function HomeMedicinesSection() {
  const res = await serverFetch("/api/medicines?page=1&limit=8", {
    method: "GET",
    cache: "no-store",
  });

  const medicines = res?.data?.data ?? res?.data ?? [];

  const listKey = medicines.map((m: any) => String(m.id)).join("-");

  return (
    <section className="py-16 container mx-auto px-4">
      <div className="flex items-center justify-between mb-8"></div>

      <MedicineCard key={listKey} medicines={medicines} />
    </section>
  );
}
