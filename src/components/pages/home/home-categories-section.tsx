import CetagoryCard from "@/components/cetagoryCard";
import { serverFetch } from "@/lib/fetch/serverFetch";

export default async function HomeCategoriesSection() {
  const res = await serverFetch("/api/categories", {
    method: "GET",
    cache: "no-store",
  });

  const category = { data: res?.data ?? res ?? { data: [] } };

  return <CetagoryCard category={category} />;
}
