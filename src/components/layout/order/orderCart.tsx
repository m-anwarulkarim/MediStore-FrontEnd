"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash } from "lucide-react";
import { useState } from "react";

type CartProduct = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

const initialCart: CartProduct[] = [
  {
    id: 1,
    name: "Vitamin C Tablets",
    price: 12.99,
    quantity: 2,
    imageUrl:
      "https://images.pexels.com/photos/5938350/pexels-photo-5938350.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 2,
    name: "Pain Relief Capsules",
    price: 8.5,
    quantity: 1,
    imageUrl:
      "https://images.pexels.com/photos/5938351/pexels-photo-5938351.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

const OrderCart = () => {
  const [cart, setCart] = useState<CartProduct[]>(initialCart);

  const handleQuantityChange = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const handleRemove = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="text-3xl font-bold sm:text-4xl">Your Cart</h1>
        {cart.length === 0 ? (
          <p className="mt-4 text-foreground/80">Your cart is empty.</p>
        ) : (
          <>
            <div className="mt-6 flex flex-col gap-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center gap-4 rounded-xl border p-4 sm:flex-row sm:items-start"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={120}
                    height={120}
                    className="h-28 w-28 rounded-lg object-cover"
                    unoptimized
                  />
                  <div className="flex w-full flex-col justify-between gap-2 sm:ml-4">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-foreground/80">
                      ${item.price.toFixed(2)}
                    </p>

                    {/* Quantity Selector */}
                    <div className="mt-2 flex items-center gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuantityChange(item.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuantityChange(item.id, 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="mt-2 w-32"
                      onClick={() => handleRemove(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal & Checkout */}
            <div className="mt-8 flex flex-col items-end gap-4 sm:flex-row sm:justify-between sm:items-center">
              <p className="text-xl font-semibold">
                Subtotal: ${subtotal.toFixed(2)}
              </p>
              <Button size="lg" className="rounded-full">
                Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default OrderCart;
