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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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

const isValidImageSrc = (src?: string | null) => {
  if (!src) return false;
  if (src.startsWith("http://") || src.startsWith("https://")) return true;
  if (src.startsWith("/")) return true;
  return false;
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

  useEffect(() => {
    let alive = true;
    loadAll(() => alive);
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------
  // Pricing helpers
  // --------------------
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const raw = item.medicine.discountPrice ?? item.medicine.price;
      const price = typeof raw === "string" ? parseFloat(raw) : raw;
      return sum + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const deliveryCharge = useMemo(() => {
    // simple rule (তুমি চাইলে dynamic করতে পারো)
    // 999+ হলে free
    return subtotal >= 999 ? 0 : 60;
  }, [subtotal]);

  const total = useMemo(
    () => subtotal + deliveryCharge,
    [subtotal, deliveryCharge],
  );

  // --------------------
  // Create address
  // --------------------
  const handleCreateAddress = async () => {
    const { fullName, phone, city, state, area, postalCode, addressLine } =
      addrForm;

    //  match backend required fields (state include করা হলো)
    if (
      !fullName.trim() ||
      !phone.trim() ||
      !city.trim() ||
      !state.trim() ||
      !area.trim() ||
      !postalCode.trim() ||
      !addressLine.trim()
    ) {
      toast.error(
        "Required: fullName, phone, city, state, area, postalCode, addressLine",
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
      <h1 className="mb-1 text-2xl font-bold">Checkout</h1>
      <p className="mb-6 text-sm text-muted-foreground">
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
                    className={`flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-start ${
                      selectedAddressId === a.id
                        ? "border-primary bg-accent"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
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
                        <p className="text-sm text-muted-foreground">
                          {a.phone}
                        </p>
                        <p className="text-sm">
                          {a.addressLine}, {a.area ? `${a.area}, ` : ""}
                          {a.city}
                          {a.postalCode ? ` - ${a.postalCode}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="sm:ml-auto">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="w-full sm:w-auto"
                        disabled={a.isDefault || isDeletingAddressId === a.id}
                        onClick={() => handleDeleteAddress(a.id, a.isDefault)}
                      >
                        {isDeletingAddressId === a.id
                          ? "Deleting..."
                          : "Delete"}
                      </Button>
                    </div>
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

            {/*  state field + default switch + better responsive grid */}
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
                placeholder="State/Division *"
                value={addrForm.state}
                onChange={(e) =>
                  setAddrForm((p) => ({ ...p, state: e.target.value }))
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

              <div className="flex items-center gap-3 rounded-md border px-3 py-2 sm:justify-between">
                <Label className="text-sm">Set as default</Label>
                <Switch
                  checked={addrForm.isDefault}
                  onCheckedChange={(v: any) =>
                    setAddrForm((p) => ({ ...p, isDefault: Boolean(v) }))
                  }
                />
              </div>

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
            {cartItems.map((item) => {
              const imgSrc = isValidImageSrc(item.medicine.image)
                ? (item.medicine.image as string)
                : "https://placehold.co/600x400";

              return (
                <div key={item.id} className="flex gap-3">
                  <div className="relative h-14 w-14 overflow-hidden rounded border">
                    <Image
                      src={imgSrc}
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
              );
            })}

            <Separator />

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>৳ {subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Delivery</span>
              <span>
                {deliveryCharge === 0
                  ? "Free"
                  : `৳ ${deliveryCharge.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>৳ {total.toFixed(2)}</span>
            </div>

            <Button
              className="w-full"
              onClick={handlePlaceOrder}
              disabled={isPlacing}
            >
              {isPlacing ? "Placing..." : "Place Order (COD)"}
            </Button>

            <p className="text-xs text-muted-foreground">
              Note: ৹ Subtotal ৳999+ হলে delivery free (example rule)।
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
