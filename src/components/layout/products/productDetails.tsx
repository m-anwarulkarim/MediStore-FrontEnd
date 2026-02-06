"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Heart } from "lucide-react";
import { useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};

const product: Product = {
  id: 1,
  name: "Vitamin C Tablets",
  description:
    "Boost your immunity with daily Vitamin C. Supports overall health and wellness.",
  price: 12.99,
  imageUrl:
    "https://images.pexels.com/photos/5938350/pexels-photo-5938350.jpeg?auto=compress&cs=tinysrgb&w=600",
};

const ProductDetailsPage = () => {
  const [quantity, setQuantity] = useState<number>(1);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-(--breakpoint-xl) px-6 lg:flex lg:gap-12">
        {/* Product Image */}
        <div className="lg:w-1/2">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={500}
            height={500}
            className="rounded-xl object-cover"
            unoptimized
          />
        </div>

        {/* Product Info */}
        <div className="mt-8 lg:mt-0 lg:w-1/2">
          <h1 className="text-3xl font-bold sm:text-4xl">{product.name}</h1>
          <p className="mt-4 text-foreground/80">{product.description}</p>
          <p className="mt-4 text-2xl font-semibold">
            ${product.price.toFixed(2)}
          </p>

          {/* Quantity Selector */}
          <div className="mt-6 flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(-1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-lg">{quantity}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Add to Cart */}
          <Button className="mt-6 w-full rounded-full" size="lg">
            Add to Cart
          </Button>

          {/* Optional: Wishlist */}
          <Button
            variant="outline"
            className="mt-4 w-full flex items-center justify-center gap-2"
          >
            <Heart className="h-5 w-5" /> Add to Wishlist
          </Button>
        </div>
      </div>

      {/* Optional: Related Products */}
      {/* <div className="mt-16">
        <h2 className="text-2xl font-semibold">Related Products</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          // Add related products cards here
        </div>
      </div> */}
    </section>
  );
};

export default ProductDetailsPage;
