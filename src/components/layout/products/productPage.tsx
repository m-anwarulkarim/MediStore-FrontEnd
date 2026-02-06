/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

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
  // প্রতিটি প্রোডাক্টের জন্য আলাদা কোয়ান্টিটি স্টেট
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(
    medicines.reduce((acc, product) => ({ ...acc, [product.id]: 1 }), {}),
  );

  const handleQuantityChange = (id: string | number, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id.toString()] || 1) + delta),
    }));
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
            // সেফলি প্রাইস কনভার্ট করা (যেহেতু এপিআই থেকে স্ট্রিং '55' আসছে)
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
