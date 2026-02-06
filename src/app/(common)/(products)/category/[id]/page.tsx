/* eslint-disable @typescript-eslint/no-explicit-any */
import MedicineCard from "@/components/layout/products/productPage";
import { serverFetch } from "@/lib/fetch/serverFetch";
interface PageProps {
  params: { id: string };
}

const CategoryDetailsPage = async ({ params }: PageProps) => {
  const { data: categoryData } = await serverFetch(
    `/api/categories/${params.id}`,
    {
      method: "GET",
    },
  );

  const medicines = categoryData?.medicines || [];

  return (
    <section className="py-12 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">
            {categoryData?.name || "Medicines"}
          </h1>
          <p className="mt-3 text-muted-foreground">
            Explore all medicines under this category.
          </p>
        </div>

        <MedicineCard medicines={medicines} />
      </div>
    </section>
  );
};

export default CategoryDetailsPage;
