import { CreateCategoryForm } from "@/components/layout/category/createCategory";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CreateCategoryPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      {/* Back Button & Header */}
      <div className="mb-8 flex flex-col gap-2">
        <Link
          href="/admin/categories"
          className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Categories
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          Create New Category
        </h1>
        <p className="text-muted-foreground">
          Fill in the details below to add a new medicine category to your
          store.
        </p>
      </div>

      <div className="flex justify-center">
        {/* Apnar toiri kora Form Component-ti ekhane call hobe */}
        <CreateCategoryForm />
      </div>
    </div>
  );
}
