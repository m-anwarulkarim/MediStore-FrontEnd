/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { clientFetch } from "@/lib/fetch/clientFetch";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, LayoutGrid } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

interface CategoryListProps {
  initialCategories: any[];
}

const CategoryList = ({ initialCategories }: CategoryListProps) => {
  const [categories, setCategories] = useState(initialCategories);

  const handleDelete = async (id: string, name: string) => {
    const confirmDelete = confirm(`Are you sure you want to delete "${name}"?`);
    if (!confirmDelete) return;

    try {
      const { error } = await clientFetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (error) {
        toast.error(error.message || "Failed to delete category!");
      } else {
        toast.success("Category deleted successfully!");
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.length === 0 ? (
        <div className="col-span-full text-center py-10 border-2 border-dashed rounded-xl text-muted-foreground">
          No categories found.
        </div>
      ) : (
        categories.map((category: any) => (
          <Card
            key={category.id}
            className="group hover:shadow-lg transition-all border-2 hover:border-primary/20 bg-card"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <LayoutGrid className="h-5 w-5" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                  >
                    <Link href={`/dashboard/category/${category.id}`}>
                      <Edit2 className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(category.id, category.name)}
                    className="h-8 w-8 text-destructive hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-xl mt-4 truncate">
                {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                {category.description || "No description provided."}
              </p>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground border-t pt-4 bg-muted/5">
              Medicines: {category._count?.medicines || 0}
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default CategoryList;
