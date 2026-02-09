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
  Package,
  CircleDollarSign,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const MedicineInventoryGrid = () => {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await clientFetch("/api/medicines", {
        method: "GET",
      });
      if (!error && data) {
        setMedicines(data.data || []);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    const { error } = await clientFetch(`/api/medicines/${id}`, {
      method: "DELETE",
    });

    if (error) {
      toast.error(error.message || "Failed to delete medicine");
    } else {
      toast.success("Medicine record deleted");
      setMedicines((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Helper function to safely format price
  const formatPrice = (price: any) => {
    const numPrice = Number(price);
    return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const displayedMedicines = medicines.slice(0, 6);

  return (
    <div className="py-10 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground text-slate-900 dark:text-slate-50">
            Medicine Inventory
          </h2>
          <p className="text-muted-foreground text-lg">
            Manage your stock and pricing for {medicines.length} products.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild className="rounded-full group">
            <Link href="/dashboard/medicines">
              View All{" "}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild className="rounded-full shadow-lg shadow-primary/20">
            <Link href="/dashboard/medicines/create">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayedMedicines.map((item: any) => (
          <Card
            key={item.id}
            className="group relative overflow-hidden border-2 transition-all hover:border-primary/30 hover:shadow-xl bg-card"
          >
            {/* Quick Actions */}
            <div className="absolute right-3 top-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-[-10px] group-hover:translate-y-0 z-10">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full shadow-sm"
                asChild
              >
                <Link href={`/dashboard/medicines/${item.id}`}>
                  <Edit2 className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button
                size="icon"
                variant="destructive"
                className="h-8 w-8 rounded-full shadow-sm"
                onClick={() => handleDelete(item.id, item.name)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            <CardHeader className="p-6 pb-0">
              <div className="mb-4 relative h-20 w-20 rounded-2xl bg-muted border overflow-hidden flex items-center justify-center">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                ) : (
                  <Package className="h-10 w-10 text-muted-foreground/40" />
                )}
              </div>

              <div className="space-y-1">
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase tracking-tighter"
                >
                  {item.category?.name || "General"}
                </Badge>
                <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors text-foreground">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  {item.manufacturer || "N/A"}
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-6 pt-4">
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed h-10">
                {item.description ||
                  "No specific therapeutic instructions provided."}
              </p>
            </CardContent>

            <CardFooter className="p-6 pt-0 border-t border-dashed mt-auto grid grid-cols-2 items-center bg-muted/5">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Price
                </span>
                <span className="text-lg font-black text-foreground flex items-center gap-1">
                  <CircleDollarSign className="h-4 w-4 text-emerald-500" />
                  {/* Fixed the toFixed error here */}${formatPrice(item.price)}
                </span>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                  Stock Status
                </span>
                {Number(item.stock) <= 5 ? (
                  <Badge
                    variant="destructive"
                    className="animate-pulse flex gap-1 items-center px-2 py-0.5"
                  >
                    <AlertTriangle className="h-3 w-3" /> {item.stock} Left
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20"
                  >
                    {item.stock} In Stock
                  </Badge>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MedicineInventoryGrid;
