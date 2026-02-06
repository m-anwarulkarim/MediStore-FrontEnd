import React from "react";
import { clientFetch } from "@/lib/fetch/clientFetch";
import { Button } from "@/components/ui/button";
import { Plus, LayoutDashboardIcon } from "lucide-react";
import Link from "next/link";
import CategoryList from "./CategoryList";

const ViewAllCategory = async () => {
  const { data, error } = await clientFetch("/api/categories", {
    method: "GET",
    cache: "no-store",
  });

  const categoriesArray = data?.data || [];

  return (
    <div className="flex min-h-screen items-center justify-center py-12">
      <div className="w-full max-w-7xl px-6">
        {/* Header Section - Exactly as your style */}
        <div className="text-center space-y-4">
          <h2 className="font-semibold text-4xl tracking-tight sm:text-5xl">
            Explore Medistor Categories
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Easily manage, edit, or remove your medicine categories from here.
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <Button
              asChild
              className="rounded-full px-6 shadow-md transition-transform hover:scale-105"
            >
              <Link href="/dashboard/create-category">
                <Plus className="mr-2 h-4 w-4" /> Create Category
              </Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full px-6">
              <Link href="/dashboard">
                <LayoutDashboardIcon className="mr-2 h-4 w-4" /> Dashboard
              </Link>
            </Button>
          </div>
        </div>

        {/* Category List Area */}
        <div className="mt-10 sm:mt-16">
          {error ? (
            <div className="text-center py-10 border-2 border-dashed rounded-xl text-destructive">
              Failed to load categories.
            </div>
          ) : (
            <CategoryList initialCategories={categoriesArray} />
          )}
        </div>

        {/* Optional: Simple Footer info */}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          Total {categoriesArray.length} categories available in your store.
        </div>
      </div>
    </div>
  );
};

export default ViewAllCategory;
