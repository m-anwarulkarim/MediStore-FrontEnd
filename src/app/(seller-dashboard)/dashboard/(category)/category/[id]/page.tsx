// app/dashboard/category/[id]/page.tsx (বা আপনার পেজ পাথ অনুযায়ী)
import { UpdateCategoryForm } from "@/components/layout/category/updateCategory";

interface PageProps {
  params: Promise<{ id: string }>;
}

const UpdateACategory = async ({ params }: PageProps) => {
  const { id } = await params;

  const baseUrl = process.env.BACKEND_URL;
  const apiUrl = `${baseUrl}/api/categories/${id}`;

  try {
    const res = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Fetch failed with status: ${res.status}`);
      return (
        <div className="p-10 text-center">
          <h2 className="text-red-500 font-bold text-xl">
            Error: Could not fetch category data!
          </h2>
          <p className="text-muted-foreground">Status: {res.status}</p>
        </div>
      );
    }

    const result = await res.json();

    const categoryData = result.data?.category || result.data;

    if (!categoryData) {
      return (
        <div className="p-10 text-center">
          <h2 className="text-amber-500 text-xl font-bold">
            Category not found!
          </h2>
        </div>
      );
    }

    return (
      <div className="container mx-auto flex justify-center py-10">
        <UpdateCategoryForm initialData={categoryData} />
      </div>
    );
  } catch (error) {
    console.error("Critical Fetch Error:", error);
    return (
      <div className="p-10 text-center">
        <h2 className="text-red-500 font-bold">
          Failed to connect to backend server.
        </h2>
        <p className="text-sm">
          Make sure your backend is running at {baseUrl}
        </p>
      </div>
    );
  }
};

export default UpdateACategory;
