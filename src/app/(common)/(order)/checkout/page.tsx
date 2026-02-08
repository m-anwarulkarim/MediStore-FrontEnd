/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { cartService } from "@/services/cart/cart.service";
import {
  addressService,
  type Address,
} from "@/services/address/address.service";
import { orderService } from "@/services/order/order.service";

type CartItem = {
  id: string; // cartItemId
  quantity: number;
  medicine: {
    id: string | number;
    name: string;
    price: number | string;
    discountPrice?: number | string | null;
    image?: string | null;
  };
};

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  const [customerNote, setCustomerNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacing, setIsPlacing] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isDeletingAddressId, setIsDeletingAddressId] = useState<string>("");

  // --------------------
  // Address form state
  // --------------------
  const [addrForm, setAddrForm] = useState({
    fullName: "",
    phone: "",
    country: "Bangladesh",
    city: "",
    state: "",
    area: "",
    postalCode: "",
    addressLine: "",
    label: "Home",
    isDefault: true,
  });

  // --------------------
  // Load cart + address (single source)
  // --------------------
  const loadAll = async (mounted?: () => boolean) => {
    setIsLoading(true);

    const [cartRes, addrRes] = await Promise.all([
      cartService.getMyCart(),
      addressService.getMyAddresses(),
    ]);

    if (mounted && !mounted()) return;

    if (cartRes.error) {
      toast.error(cartRes.error.message || "Failed to load cart");
      setIsLoading(false);
      return;
    }

    if (addrRes.error) {
      toast.error(addrRes.error.message || "Failed to load addresses");
      setIsLoading(false);
      return;
    }

    const cartData = (cartRes.data as any)?.data ?? cartRes.data ?? [];
    const addrData = (addrRes.data as any)?.data ?? addrRes.data ?? [];

    setCartItems(cartData);
    setAddresses(addrData);

    const def = (addrData as Address[]).find((a) => a.isDefault);
    setSelectedAddressId(def?.id || addrData?.[0]?.id || "");

    setIsLoading(false);
  };

  // Safe effect (no cascading warning)
  useEffect(() => {
    let alive = true;
    loadAll(() => alive);
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------
  // Subtotal
  // --------------------
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const raw = item.medicine.discountPrice ?? item.medicine.price;
      const price = typeof raw === "string" ? parseFloat(raw) : raw;
      return sum + price * item.quantity;
    }, 0);
  }, [cartItems]);

  // --------------------
  // Create address
  // --------------------
  const handleCreateAddress = async () => {
    const { fullName, phone, city, area, postalCode, addressLine } = addrForm;

    // match backend required fields
    if (!fullName || !phone || !city || !area || !postalCode || !addressLine) {
      toast.error(
        "Required: fullName, phone, city, area, postalCode, addressLine",
      );
      return;
    }

    setIsSavingAddress(true);

    const res = await addressService.createAddress({
      ...addrForm,
      isDefault: Boolean(addrForm.isDefault),
    });

    setIsSavingAddress(false);

    if (res.error) {
      toast.error(res.error.message || "Failed to create address");
      return;
    }

    toast.success("Address added");

    setAddrForm({
      fullName: "",
      phone: "",
      country: "Bangladesh",
      city: "",
      state: "",
      area: "",
      postalCode: "",
      addressLine: "",
      label: "Home",
      isDefault: true,
    });

    await loadAll();
  };

  // --------------------
  // Delete address
  // --------------------
  const handleDeleteAddress = async (id: string, isDefault: boolean) => {
    if (isDefault) {
      toast.error("Default address cannot be deleted");
      return;
    }

    const ok = window.confirm("Are you sure you want to delete this address?");
    if (!ok) return;

    setIsDeletingAddressId(id);

    const res = await addressService.deleteAddress(id);

    setIsDeletingAddressId("");

    if (res.error) {
      toast.error(res.error.message || "Failed to delete address");
      return;
    }

    toast.success("Address deleted");

    // if selected deleted, reset
    if (selectedAddressId === id) {
      setSelectedAddressId("");
    }

    await loadAll();
  };

  // --------------------
  // Place order (COD)
  // --------------------
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select an address");
      return;
    }

    setIsPlacing(true);

    const res = await orderService.createOrder({
      addressId: selectedAddressId,
      customerNote: customerNote || undefined,
    });

    setIsPlacing(false);

    if (res.error) {
      toast.error(res.error.message || "Failed to place order");
      return;
    }

    toast.success("Order placed successfully (Cash on Delivery)");
    window.location.href = "/orders";
  };

  // --------------------
  // UI states
  // --------------------
  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">Loading checkout...</div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Your cart is empty</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Add items to cart before checkout.
          </CardContent>
        </Card>
      </div>
    );
  }

  // --------------------
  // Render
  // --------------------
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-1">Checkout</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Payment method: <span className="font-medium">Cash on Delivery</span>
      </p>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT */}
        <div className="space-y-6 lg:col-span-2">
          {/* Address list */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {addresses.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No saved addresses. Please add one below.
                </p>
              ) : (
                addresses.map((a) => (
                  <div
                    key={a.id}
                    className={`flex gap-3 rounded-lg border p-3 ${
                      selectedAddressId === a.id
                        ? "border-primary bg-accent"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      checked={selectedAddressId === a.id}
                      onChange={() => setSelectedAddressId(a.id)}
                      className="mt-1 h-4 w-4"
                    />

                    <div className="flex-1">
                      <p className="font-semibold">
                        {a.fullName}{" "}
                        {a.isDefault && (
                          <span className="ml-2 text-xs text-primary">
                            (Default)
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">{a.phone}</p>
                      <p className="text-sm">
                        {a.addressLine}, {a.area ? `${a.area}, ` : ""}
                        {a.city}
                        {a.postalCode ? ` - ${a.postalCode}` : ""}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={a.isDefault || isDeletingAddressId === a.id}
                      onClick={() => handleDeleteAddress(a.id, a.isDefault)}
                    >
                      {isDeletingAddressId === a.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                ))
              )}

              <Separator />

              <Textarea
                placeholder="Customer note (optional)"
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Add address */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Address</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Input
                placeholder="Full name *"
                value={addrForm.fullName}
                onChange={(e) =>
                  setAddrForm((p) => ({ ...p, fullName: e.target.value }))
                }
              />
              <Input
                placeholder="Phone *"
                value={addrForm.phone}
                onChange={(e) =>
                  setAddrForm((p) => ({ ...p, phone: e.target.value }))
                }
              />
              <Input
                placeholder="City *"
                value={addrForm.city}
                onChange={(e) =>
                  setAddrForm((p) => ({ ...p, city: e.target.value }))
                }
              />
              <Input
                placeholder="Area *"
                value={addrForm.area}
                onChange={(e) =>
                  setAddrForm((p) => ({ ...p, area: e.target.value }))
                }
              />
              <Input
                placeholder="Postal code *"
                value={addrForm.postalCode}
                onChange={(e) =>
                  setAddrForm((p) => ({ ...p, postalCode: e.target.value }))
                }
              />
              <Input
                placeholder="Label (Home/Office)"
                value={addrForm.label}
                onChange={(e) =>
                  setAddrForm((p) => ({ ...p, label: e.target.value }))
                }
              />
              <div className="sm:col-span-2">
                <Input
                  placeholder="Address line *"
                  value={addrForm.addressLine}
                  onChange={(e) =>
                    setAddrForm((p) => ({
                      ...p,
                      addressLine: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <Button
                  className="w-full"
                  onClick={handleCreateAddress}
                  disabled={isSavingAddress}
                >
                  {isSavingAddress ? "Saving..." : "Save Address"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="relative h-14 w-14 rounded border overflow-hidden">
                  <Image
                    src={item.medicine.image || "https://placehold.co/600x400"}
                    alt={item.medicine.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.medicine.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>
            ))}

            <Separator />

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>৳ {subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>৳ {subtotal.toFixed(2)}</span>
            </div>

            <Button
              className="w-full"
              onClick={handlePlaceOrder}
              disabled={isPlacing}
            >
              {isPlacing ? "Placing..." : "Place Order (COD)"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
