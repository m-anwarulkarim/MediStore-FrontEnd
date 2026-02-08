import CetagoryCard from "@/components/cetagoryCard";
import { serverFetch } from "@/lib/fetch/serverFetch";

const CategoryPage = async () => {
  const category = await serverFetch("/api/categories", {
    method: "GET",
  });
  return (
    <div>
      <CetagoryCard category={category} />
    </div>
  );
};

export default CategoryPage;
