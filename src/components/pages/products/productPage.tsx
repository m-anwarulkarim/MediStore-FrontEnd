"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const products = [
  {
    id: 1,
    name: "Vitamin C Tablets",
    description: "Boost your immunity with daily Vitamin C.",
    price: 12.99,
    imageUrl:
      "https://images.pexels.com/photos/5938350/pexels-photo-5938350.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 2,
    name: "Pain Relief Capsules",
    description: "Fast acting capsules for headache and body pain.",
    price: 8.5,
    imageUrl:
      "https://images.pexels.com/photos/5938351/pexels-photo-5938351.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 3,
    name: "Multivitamin Gummies",
    description: "Daily multivitamins for adults in tasty gummies.",
    price: 14.99,
    imageUrl:
      "https://images.pexels.com/photos/5938352/pexels-photo-5938352.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

const AddToCartSection = () => {
  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    products.reduce((acc, product) => ({ ...acc, [product.id]: 1 }), {}),
  );

  const handleQuantityChange = (id: number, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, prev[id] + delta),
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

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col rounded-xl border p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <Link href={"/product-details"}>
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="rounded-lg object-cover w-full h-48"
                  unoptimized
                />
              </Link>
              <h3 className="mt-4 text-lg font-semibold">{product.name}</h3>
              <p className="mt-1 text-sm text-foreground/80">
                {product.description}
              </p>
              <p className="mt-2 font-semibold">${product.price.toFixed(2)}</p>

              <div className="mt-4 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(product.id, -1)}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg min-w-[2rem] text-center">
                  {quantities[product.id]}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(product.id, 1)}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button className="mt-4 w-full rounded-full" size="lg">
                Add to Cart
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AddToCartSection;
