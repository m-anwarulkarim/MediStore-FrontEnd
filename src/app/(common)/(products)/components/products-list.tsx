/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cartService } from "@/services/cart/cart.service";

type Product = {
  id: string | number;
  name: string;
  description?: string | null;
  price: number | string;
  manufacturer?: string | { name?: string } | null;
  image?: string | null;
  images?: string[] | null; // যদি backend এ images array থাকে
};

export function ProductsList({ products }: { products: Product[] }) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const getQty = (id: string | number) => quantities[String(id)] ?? 1;

  const handleQuantityChange = (id: string | number, delta: number) => {
    const key = String(id);
    setQuantities((prev) => {
      const current = prev[key] ?? 1;
      return { ...prev, [key]: Math.max(1, current + delta) };
    });
  };

  const handleAddToCart = async (product: Product) => {
    const qty = getQty(product.id);

    const res = await cartService.addToCart({
      medicineId: product.id, // ✅ তোমার cart backend medicineId চায়
      quantity: qty,
    });

    if (res.error) {
      toast.error(res.error.message || "Failed to add to cart");
      return;
    }

    toast.success("Added to cart!");
  };

  const formatPrice = (v: number | string) => {
    const n = typeof v === "string" ? Number(v) : v;
    if (!n || Number.isNaN(n)) return "0.00";
    return n.toFixed(2);
  };

  const items = useMemo(() => products ?? [], [products]);

  if (!items.length) {
    return <div className="text-sm opacity-70">No products found.</div>;
  }

  return (
    <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((p) => {
        const manufacturerName =
          typeof p.manufacturer === "string"
            ? p.manufacturer
            : (p.manufacturer?.name ?? "");

        const img =
          p.image ||
          (Array.isArray(p.images) && p.images.length ? p.images[0] : null) ||
          "https://placehold.co/600x400";

        const qty = getQty(p.id);

        return (
          <Card
            key={p.id}
            className="group min-w-0 w-full overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-lg"
          >
            {/* ✅ Clickable area -> details page */}
            <Link href={`/products/${p.id}`} className="block">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={img}
                  alt={p.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
              </div>

              <div className="p-4">
                <div className="text-base font-semibold line-clamp-1">
                  {p.name}
                </div>

                <div className="mt-1 text-xs text-foreground/70 line-clamp-1">
                  {manufacturerName}
                </div>

                <div className="mt-3 text-lg font-bold text-primary">
                  ৳ {formatPrice(p.price)}
                </div>

                <div className="mt-2 text-xs text-foreground/70 line-clamp-2 min-h-[32px]">
                  {p.description || "Quality medicine for your health needs."}
                </div>
              </div>
            </Link>

            {/* ✅ Actions */}
            <div className="px-4 pb-4">
              <div className="mt-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 p-0"
                    onClick={() => handleQuantityChange(p.id, -1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <span className="min-w-[2rem] text-center font-medium">
                    {qty}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 p-0"
                    onClick={() => handleQuantityChange(p.id, 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  className="rounded-full px-4"
                  onClick={() => handleAddToCart(p)}
                >
                  Add
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
