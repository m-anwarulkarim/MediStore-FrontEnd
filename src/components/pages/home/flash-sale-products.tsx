/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Minus, Plus, Zap } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cartService } from "@/services/cart/cart.service";

type Product = {
  id: string | number;
  name: string;
  description?: string | null;
  price: number | string;
  discountPrice?: number | string | null;
  image?: string | null;
};

export default function FlashSaleProducts({
  medicines,
}: {
  medicines: Product[];
}) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const items = useMemo(() => medicines.slice(0, 4), [medicines]);

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
      medicineId: product.id,
      quantity: qty,
    });

    if (res?.error) {
      toast.error(res.error.message || "Failed to add to cart");
      return;
    }

    toast.success("Added to cart!");
  };

  const formatPrice = (v: number | string | null | undefined) => {
    const n = typeof v === "string" ? Number(v) : v;
    if (!n || Number.isNaN(n)) return "0.00";
    return n.toFixed(2);
  };

  const calcOffPercent = (price: any, discount: any) => {
    const p = typeof price === "string" ? Number(price) : price;
    const d = typeof discount === "string" ? Number(discount) : discount;
    if (!p || !d || d >= p) return null;
    const off = Math.round(((p - d) / p) * 100);
    return off > 0 ? off : null;
  };

  return (
    <section className="bg-background py-14">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <h2 className="text-3xl font-bold tracking-tight">Flash Sale</h2>
            </div>
            <p className="mt-2 text-sm text-foreground/70">
              Limited items. Grab your deals quickly.
            </p>
          </div>
        </div>

        {/* ✅ Grid centered + no side shift */}
        <div className="mt-8 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => {
            const off = calcOffPercent(product.price, product.discountPrice);
            const qty = getQty(product.id);

            return (
              <Card
                key={product.id}
                className="group w-full overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Link
                    href={`/products/${product.id}`}
                    className="block h-full w-full"
                  >
                    <Image
                      src={product.image || "https://placehold.co/600x400"}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                  </Link>

                  {/* Badges */}
                  <div className="absolute left-3 top-3 flex gap-2">
                    <Badge className="rounded-full">Flash</Badge>
                    {off ? (
                      <Badge variant="destructive" className="rounded-full">
                        -{off}%
                      </Badge>
                    ) : null}
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-5">
                  <Link href={`/products/${product.id}`}>
                    <div className="text-base font-semibold line-clamp-1">
                      {product.name}
                    </div>
                  </Link>

                  <div className="mt-1 min-h-[32px] text-xs text-foreground/70 line-clamp-2">
                    {product.description ||
                      "Quality medicine for your health needs."}
                  </div>

                  {/* Price */}
                  <div className="mt-3 flex items-end gap-2">
                    {product.discountPrice ? (
                      <>
                        <div className="text-lg font-bold">
                          ৳ {formatPrice(product.discountPrice)}
                        </div>
                        <div className="text-sm text-foreground/60 line-through">
                          ৳ {formatPrice(product.price)}
                        </div>
                      </>
                    ) : (
                      <div className="text-lg font-bold">
                        ৳ {formatPrice(product.price)}
                      </div>
                    )}
                  </div>

                  {/* Qty + Add */}
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0"
                        onClick={() => handleQuantityChange(product.id, -1)}
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
                        onClick={() => handleQuantityChange(product.id, 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      className="rounded-full px-4"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
