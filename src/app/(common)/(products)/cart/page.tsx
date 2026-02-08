/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { cartService } from "@/services/cart/cart.service";

type CartItem = {
  id: string; // cartItemId (DB id)
  quantity: number;
  medicine: {
    id: string | number;
    name: string;
    price: number | string;
    image?: string | null;
  };
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchCart = async () => {
    setIsLoading(true);
    const res = await cartService.getMyCart();

    if (res.error) {
      toast.error(res.error.message || "Failed to load cart");
      setItems([]);
      setIsLoading(false);
      return;
    }

    // ✅ backend response অনুযায়ী এখানে adjust লাগতে পারে:
    // যদি res.data.data এর ভিতরে থাকে, তাহলে setItems(res.data.data)
    setItems((res.data as any)?.data ?? (res.data as any) ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const price =
        typeof item.medicine.price === "string"
          ? parseFloat(item.medicine.price)
          : item.medicine.price;
      return sum + price * item.quantity;
    }, 0);
  }, [items]);

  const totalItems = useMemo(() => {
    return items.reduce((sum, i) => sum + i.quantity, 0);
  }, [items]);

  const updateQty = async (cartItemId: string, newQty: number) => {
    const qty = Math.max(1, newQty);

    // Optimistic UI
    setItems((prev) =>
      prev.map((i) => (i.id === cartItemId ? { ...i, quantity: qty } : i)),
    );

    setBusyId(cartItemId);
    const res = await cartService.updateQty(cartItemId, qty);
    setBusyId(null);

    if (res.error) {
      toast.error(res.error.message || "Failed to update quantity");
      fetchCart();
      return;
    }
  };

  const removeItem = async (cartItemId: string) => {
    setBusyId(cartItemId);

    const res = await cartService.deleteItem(cartItemId);
    setBusyId(null);

    if (res.error) {
      toast.error(res.error.message || "Failed to remove item");
      return;
    }

    toast.success("Removed from cart");
    setItems((prev) => prev.filter((i) => i.id !== cartItemId));
  };

  if (isLoading) {
    return <div className="mx-auto max-w-6xl px-4 py-10">Loading cart...</div>;
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Your cart is empty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Add some medicines to your cart to continue.
            </p>
            <Button asChild className="w-full">
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue shopping
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">My Cart</h1>
          <p className="text-sm text-muted-foreground">
            {totalItems} item(s) in your cart
          </p>
        </div>

        <Button variant="outline" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to shop
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => {
            const price =
              typeof item.medicine.price === "string"
                ? parseFloat(item.medicine.price)
                : item.medicine.price;

            return (
              <Card key={item.id} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    {/* Image */}
                    <div className="relative h-24 w-24 overflow-hidden rounded-lg border bg-muted">
                      <Image
                        src={
                          item.medicine.image || "https://placehold.co/600x400"
                        }
                        alt={item.medicine.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <Link
                        href={`/products/${item.medicine.id}`}
                        className="font-semibold hover:underline"
                      >
                        {item.medicine.name}
                      </Link>

                      <p className="mt-1 text-sm text-muted-foreground">
                        ৳ {Number(price).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={busyId === item.id}
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <div className="min-w-[42px] text-center font-medium">
                          {item.quantity}
                        </div>

                        <Button
                          variant="outline"
                          size="icon"
                          disabled={busyId === item.id}
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Remove */}
                      <Button
                        variant="destructive"
                        size="icon"
                        disabled={busyId === item.id}
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Line total</span>
                    <span className="font-semibold">
                      ৳ {(Number(price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary */}
        <Card className="h-fit shadow-sm">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">৳ {subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-semibold">৳ 0.00</span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-base font-semibold">Total</span>
              <span className="text-base font-bold">
                ৳ {subtotal.toFixed(2)}
              </span>
            </div>

            <Button className="w-full" asChild>
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>

            <p className="text-xs text-muted-foreground">
              Prices and availability may change at checkout.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
