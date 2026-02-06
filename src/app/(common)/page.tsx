/* eslint-disable @typescript-eslint/no-explicit-any */
import Feature from "@/components/pages/home/feature";
import HeroSction from "@/components/pages/home/hero";
import { serverFetch } from "@/lib/fetch/serverFetch";
import CategoryPage from "./(products)/category/page";
import MedicineCard from "@/components/layout/products/productPage";

const HomePage = async () => {
  const response = await serverFetch("/api/medicines", {
    method: "GET",
    cache: "no-store", // ডাটা ক্যাশ হয়ে থাকলে তা আপডেট করার জন্য
  });

  const medicines = response?.data.data || [];
  console.log(medicines);

  return (
    <div className="min-h-screen">
      <HeroSction />
      <CategoryPage />

      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Popular Medicines</h2>
        </div>

        <MedicineCard medicines={medicines} />
      </section>

      <Feature />
    </div>
  );
};

export default HomePage;
