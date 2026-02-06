/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { clientFetch } from "@/lib/fetch/clientFetch";
import { Edit2, Trash2, ArrowRight, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const SellerDashboardCart = () => {
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
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    const { error } = await clientFetch(`/api/categories/${id}`, {
      method: "DELETE",
    });
    if (error) {
      toast.error(error.message || "Failed to delete!");
    } else {
      toast.success("Category deleted!");
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const topCategories = categories.slice(0, 3);

  return (
    <div className="py-8">
      {/* হেডার অংশ */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b pb-6 mb-10">
        <div>
          <h2 className="font-semibold text-3xl tracking-tight sm:text-4xl">
            Product Categories
          </h2>
          <p className="mt-2 text-foreground/70">
            Manage your medicine groupings ({categories.length} total)
          </p>
        </div>

        <div className="flex gap-3 mt-4 md:mt-0">
          <Button variant="outline" asChild size="sm" className="rounded-full">
            <Link
              href="/dashboard/category"
              className="flex items-center gap-1 group"
            >
              View All{" "}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button size="sm" asChild className="rounded-full">
            <Link href="/dashboard/create-category">
              <Plus className="h-4 w-4 mr-1" /> Create
            </Link>
          </Button>
        </div>
      </div>

      {/* গ্রিড কার্ড অংশ */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {topCategories.map((feature: any) => (
          <div
            className="group relative flex flex-col rounded-2xl border bg-card px-6 py-8 transition-all hover:shadow-md"
            key={feature.id}
          >
            {/* অ্যাকশন বাটনসমূহ (Hover করলে দেখা যাবে) */}
            <div className="absolute right-4 top-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link
                href={`/dashboard/category/${feature.id}`}
                className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
              </Link>
              <button
                onClick={() => handleDelete(feature.id, feature.name)}
                className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* ইমেজ সেকশন */}
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted overflow-hidden border-2 border-background shadow-sm">
              {feature.image ? (
                <Image
                  src={feature.image}
                  alt={feature.name}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-[10px] font-medium text-muted-foreground uppercase text-center px-1">
                  {feature.name.substring(0, 2)}
                </div>
              )}
            </div>

            {/* টেক্সট সেকশন */}
            <h3 className="text-xl font-bold tracking-tight">{feature.name}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-foreground/70 line-clamp-2">
              {feature.description ||
                "No description provided for this category."}
            </p>

            <div className="mt-4 pt-4 border-t border-dashed flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Updated: {new Date(feature.updatedAt).toLocaleDateString()}
              </span>
              <span className="bg-primary/5 px-2 py-1 rounded-md text-primary font-medium">
                {feature._count?.medicines || 0} Items
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerDashboardCart;
