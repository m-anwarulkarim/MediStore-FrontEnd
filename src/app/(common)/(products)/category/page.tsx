import CetagoryCard from "@/components/pages/home/cetagory";
import { serverFetch } from "@/lib/fetch/serverFetch";
import React from "react";

const CategoryPage = async () => {
  const category = await serverFetch("/api/categories", {
    method: "GET",
  });
  // console.log(category.data);
  return (
    <div>
      <CetagoryCard category={category} />
    </div>
  );
};

export default CategoryPage;
