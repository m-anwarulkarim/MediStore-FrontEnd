/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { cartService } from "@/services/cart/cart.service";

interface Product {
  id: string | number;
  name: string;
  description: string;
  price: string | number;
  image?: string | null;
}

interface MedicineCardProps {
  medicines: Product[];
}

const MedicineCard = ({ medicines }: MedicineCardProps) => {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(medicines.map((p) => [String(p.id), 1])),
  );

  const handleQuantityChange = (id: string | number, delta: number) => {
    const key = String(id);
    setQuantities((prev) => ({
      ...prev,
      [key]: Math.max(1, (prev[key] || 1) + delta),
    }));
  };

  const handleAddToCart = async (product: Product) => {
    const key = String(product.id);
    const qty = quantities[key] || 1;

    const res = await cartService.addToCart({
      medicineId: product.id,
      quantity: qty,
    });

    if (res.error) {
      toast.error(res.error.message || "Failed to add to cart");
      return;
    }

    toast.success("Added to cart!");
  };

  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-4xl font-bold text-center sm:text-5xl">
          Shop Medicines
        </h2>
        <p className="mt-4 text-center text-foreground/80 sm:text-lg">
          Add your medicines to the cart and complete your order seamlessly.
        </p>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {medicines.map((product) => {
            const price =
              typeof product.price === "string"
                ? parseFloat(product.price)
                : product.price;

            return (
              <div
                key={product.id}
                className="flex flex-col rounded-xl border p-6 hover:shadow-lg transition-shadow duration-300 bg-card"
              >
                <Link href={`/products/${product.id}`}>
                  <div className="relative h-48 w-full overflow-hidden rounded-lg">
                    <Image
                      src={product.image || "https://placehold.co/600x400"}
                      alt={product.name}
                      fill
                      className="object-cover w-full h-full transition-transform hover:scale-105"
                      unoptimized
                    />
                  </div>
                </Link>

                <h3 className="mt-4 text-lg font-semibold truncate">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-foreground/80 line-clamp-2 h-10">
                  {product.description ||
                    "Quality medicine for your health needs."}
                </p>
                <p className="mt-2 font-bold text-primary text-xl">
                  ৳ {price ? price.toFixed(2) : "0.00"}
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleQuantityChange(product.id, -1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg min-w-[2rem] text-center font-medium">
                    {quantities[product.id.toString()] || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleQuantityChange(product.id, 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  className="mt-6 w-full rounded-full font-semibold"
                  size="lg"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MedicineCard;
