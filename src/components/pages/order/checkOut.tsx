"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, Building2 } from "lucide-react";
import { useState } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

const cartItems: CartItem[] = [
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

const CheckoutPage2 = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = 5.0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <section className="py-8 sm:py-16 bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Checkout</h1>

        <div className="mt-6 sm:mt-8 grid gap-6 lg:grid-cols-3">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="rounded-xl border p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">
                Shipping Information
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" className="mt-1" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="mt-1"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+880 1234 567890"
                    className="mt-1"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="Dhaka" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="postal">Postal Code</Label>
                  <Input id="postal" placeholder="1200" className="mt-1" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-xl border p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">
                Payment Method
              </h2>
              <div className="space-y-3">
                <label
                  htmlFor="card"
                  className={`flex items-center gap-3 rounded-lg border p-3 sm:p-4 cursor-pointer hover:bg-accent transition-colors ${
                    paymentMethod === "card" ? "border-primary bg-accent" : ""
                  }`}
                >
                  <input
                    type="radio"
                    id="card"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4"
                  />
                  <CreditCard className="h-5 w-5" />
                  <span className="text-sm sm:text-base">
                    Credit/Debit Card
                  </span>
                </label>

                <label
                  htmlFor="mobile"
                  className={`flex items-center gap-3 rounded-lg border p-3 sm:p-4 cursor-pointer hover:bg-accent transition-colors ${
                    paymentMethod === "mobile" ? "border-primary bg-accent" : ""
                  }`}
                >
                  <input
                    type="radio"
                    id="mobile"
                    name="payment"
                    value="mobile"
                    checked={paymentMethod === "mobile"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4"
                  />
                  <Wallet className="h-5 w-5" />
                  <span className="text-sm sm:text-base">
                    Mobile Banking (bKash/Nagad)
                  </span>
                </label>

                <label
                  htmlFor="cod"
                  className={`flex items-center gap-3 rounded-lg border p-3 sm:p-4 cursor-pointer hover:bg-accent transition-colors ${
                    paymentMethod === "cod" ? "border-primary bg-accent" : ""
                  }`}
                >
                  <input
                    type="radio"
                    id="cod"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4"
                  />
                  <Building2 className="h-5 w-5" />
                  <span className="text-sm sm:text-base">Cash on Delivery</span>
                </label>
              </div>

              {/* Card Details (conditional) */}
              {paymentMethod === "card" && (
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        className="mt-1"
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Banking Details (conditional) */}
              {paymentMethod === "mobile" && (
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="mobileNumber">Mobile Number</Label>
                    <Input
                      id="mobileNumber"
                      placeholder="01712345678"
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border p-4 sm:p-6 sticky top-4">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg object-cover flex-shrink-0"
                      unoptimized
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-foreground/60">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold mt-1">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span className="text-foreground/80">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/80">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/80">Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-base sm:text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full mt-6 rounded-full" size="lg">
                Place Order
              </Button>

              <p className="text-xs text-center text-foreground/60 mt-4">
                By placing your order, you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage2;
