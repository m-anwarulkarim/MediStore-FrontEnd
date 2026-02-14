"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Minus, Plus, Heart } from "lucide-react";
import { toast } from "sonner";

import { clientFetch } from "@/lib/fetch/clientFetch";
import { cartService } from "@/services/cart/cart.service";

type Product = {
  id: string | number;
  name: string;
  description?: string | null;
  price: string | number;
  image?: string | null;
};

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // -----------------------
  // Fetch product by id
  // -----------------------
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);

      const res = await clientFetch<Product>(`api/medicines/${id}`, {
        method: "GET",
      });

      if (res.error) {
        toast.error(res.error.message || "Failed to load product");
        setProduct(null);
        setIsLoading(false);
        return;
      }

      setProduct(res.data);
      setIsLoading(false);
    };

    if (id) load();
  }, [id]);

  const price = useMemo(() => {
    if (!product) return 0;
    return typeof product.price === "string"
      ? Number.parseFloat(product.price)
      : product.price;
  }, [product]);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAdd = async () => {
    if (!product) return;

    setIsAdding(true);

    const res = await cartService.addToCart({
      medicineId: product.id, // backend যদি productId নেয়, এখানে productId করো
      quantity,
    });

    setIsAdding(false);

    if (res.error) {
      toast.error(res.error.message || "Failed to add to cart");
      return;
    }

    toast.success("Added to cart!");
  };

  // -----------------------
  // UI states
  // -----------------------
  if (isLoading) {
    return <div className="mx-auto max-w-7xl px-6 py-16">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16">Product not found</div>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:flex lg:gap-12">
        {/* Image */}
        <div className="lg:w-1/2">
          <Image
            src={product.image || "https://placehold.co/600x400"}
            alt={product.name}
            width={500}
            height={500}
            className="rounded-xl object-cover"
            unoptimized
          />
        </div>

        {/* Info */}
        <div className="mt-8 lg:mt-0 lg:w-1/2">
          <h1 className="text-3xl font-bold sm:text-4xl">{product.name}</h1>
          <p className="mt-4 text-foreground/80">
            {product.description || "No description available."}
          </p>

          <p className="mt-4 text-2xl font-semibold">৳ {price.toFixed(2)}</p>

          {/* Quantity */}
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

          {/* Add to cart */}
          <Button
            className="mt-6 w-full rounded-full"
            size="lg"
            onClick={handleAdd}
            disabled={isAdding}
          >
            {isAdding ? "Adding..." : "Add to Cart"}
          </Button>

          {/* Wishlist (optional) */}
          <Button
            variant="outline"
            className="mt-4 w-full flex items-center justify-center gap-2"
          >
            <Heart className="h-5 w-5" /> Add to Wishlist
          </Button>
        </div>
      </div>
    </section>
  );
}
