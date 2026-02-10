/* eslint-disable @typescript-eslint/no-explicit-any */

import { serverFetch } from "@/lib/fetch/serverFetch";
import { ProductsFilters } from "../components/products-filters";
import { ProductsList } from "../components/products-list";

type SearchParams = {
  search?: string;
  category?: string;
  manufacturer?: string;
  minPrice?: string;
  maxPrice?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const categoriesRes = await serverFetch("/api/categories", { method: "GET" });
  const manufacturersRes = await serverFetch("/api/manufacturers", {
    method: "GET",
  });

  const categories = categoriesRes?.data?.data ?? [];
  const manufacturers = manufacturersRes?.data?.data ?? [];

  const query = new URLSearchParams();
  if (sp.search) query.set("search", sp.search);
  if (sp.category) query.set("category", sp.category);
  if (sp.manufacturer) query.set("manufacturer", sp.manufacturer);
  if (sp.minPrice) query.set("minPrice", sp.minPrice);
  if (sp.maxPrice) query.set("maxPrice", sp.maxPrice);

  const productsRes = await serverFetch(`/api/products?${query.toString()}`, {
    method: "GET",
  });

  const products =
    productsRes?.data?.data ?? productsRes?.data ?? productsRes ?? [];

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <ProductsFilters
        categories={categories.map((c: any) => ({
          value: c.slug ?? c.id,
          label: c.name,
        }))}
        manufacturers={manufacturers.map((m: any) => ({
          value: m.slug ?? m.id,
          label: m.name,
        }))}
      />

      <ProductsList products={products} />
    </div>
  );
}
