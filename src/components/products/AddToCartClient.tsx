"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cartService } from "@/services/cart/cart.service";

export default function AddToCartClient({
  medicineId,
}: {
  medicineId: string;
}) {
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const inc = () => setQty((p) => p + 1);
  const dec = () => setQty((p) => Math.max(1, p - 1));

  const handleAdd = async () => {
    setIsAdding(true);

    const res = await cartService.addToCart({
      medicineId,
      quantity: qty,
    });

    setIsAdding(false);

    if (res.error) {
      toast.error(res.error.message || "Failed to add to cart");
      return;
    }

    toast.success("Added to cart!");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={dec}
          aria-label="Decrease"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <span className="min-w-[2.5rem] text-center font-medium">{qty}</span>

        <Button
          variant="outline"
          size="icon"
          onClick={inc}
          aria-label="Increase"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button className="w-full" onClick={handleAdd} disabled={isAdding}>
        {isAdding ? "Adding..." : "Add to Cart"}
      </Button>
    </div>
  );
}
