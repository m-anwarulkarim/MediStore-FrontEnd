/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { clientFetch } from "@/lib/fetch/clientFetch";
import {
  Edit2,
  Trash2,
  ArrowRight,
  Plus,
  Loader2,
  Layers,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const SellerDashboardCategory = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await clientFetch("/api/categories", {
        method: "GET",
      });
      if (!error && data) {
        setCategories(data.data || []);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" category?`)) return;

    const { error } = await clientFetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    if (error) {
      toast.error(error.message || "Failed to delete category");
    } else {
      toast.success("Category deleted successfully");
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Preview only the top 3 categories on the dashboard
  const topCategories = categories.slice(0, 3);

  return (
    <div className="py-10 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">
            Product Categories
          </h2>
          <p className="text-muted-foreground text-lg">
            Organize and manage your medicine groupings ({categories.length}{" "}
            total)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild className="rounded-full group">
            <Link href="/dashboard/category">
              Manage All{" "}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild className="rounded-full shadow-lg shadow-primary/20">
            <Link href="/dashboard/create-category">
              <Plus className="mr-2 h-4 w-4" /> New Category
            </Link>
          </Button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {topCategories.map((cat: any) => (
          <Card
            key={cat.id}
            className="group relative overflow-hidden border-2 transition-all hover:border-primary/30 hover:shadow-xl bg-card"
          >
            {/* Action Buttons on Hover */}
            <div className="absolute right-3 top-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-[-10px] group-hover:translate-y-0 z-10">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full shadow-sm"
                asChild
              >
                <Link href={`/dashboard/category/${cat.id}`}>
                  <Edit2 className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button
                size="icon"
                variant="destructive"
                className="h-8 w-8 rounded-full shadow-sm"
                onClick={() => handleDelete(cat.id, cat.name)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            <CardHeader className="p-6 pb-0">
              {/* Category Icon/Image Container */}
              <div className="mb-4 relative h-16 w-16 rounded-2xl bg-primary/5 border border-primary/10 overflow-hidden flex items-center justify-center">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                ) : (
                  <Layers className="h-8 w-8 text-primary/40" />
                )}
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors text-foreground">
                  {cat.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Updated {new Date(cat.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 pt-4">
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed h-10">
                {cat.description ||
                  "No description provided for this grouping."}
              </p>
            </CardContent>

            <CardFooter className="p-6 pt-4 border-t border-dashed bg-muted/5 flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Inventory Status
              </span>
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
              >
                {cat._count?.medicines || 0} Products
              </Badge>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SellerDashboardCategory;
