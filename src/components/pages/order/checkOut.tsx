"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, Wallet, Building2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

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

// Zod Schema
const checkoutSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    city: z.string().min(2, "City must be at least 2 characters"),
    postal: z.string().min(4, "Postal code must be at least 4 characters"),
    paymentMethod: z.enum(["card", "mobile", "cod"]),
    cardNumber: z.string().optional(),
    expiry: z.string().optional(),
    cvv: z.string().optional(),
    mobileNumber: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === "card") {
      if (!data.cardNumber || data.cardNumber.length < 16) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Card number must be at least 16 digits",
          path: ["cardNumber"],
        });
      }
      if (!data.expiry || !/^\d{2}\/\d{2}$/.test(data.expiry)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Expiry must be in MM/YY format",
          path: ["expiry"],
        });
      }
      if (!data.cvv || data.cvv.length !== 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "CVV must be 3 digits",
          path: ["cvv"],
        });
      }
    }
    if (data.paymentMethod === "mobile") {
      if (!data.mobileNumber || data.mobileNumber.length < 11) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Mobile number must be at least 11 digits",
          path: ["mobileNumber"],
        });
      }
    }
  });

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const CheckoutPageController = () => {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mobile" | "cod">(
    "card",
  );

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postal: "",
      paymentMethod: "card",
      cardNumber: "",
      expiry: "",
      cvv: "",
      mobileNumber: "",
    },
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = 5.0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const onSubmit = (data: CheckoutFormData) => {
    toast("Order placed successfully!", {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
    });
    console.log("Form submitted:", data);
  };

  const handlePaymentMethodChange = (method: "card" | "mobile" | "cod") => {
    setPaymentMethod(method);
    form.setValue("paymentMethod", method);
  };

  return (
    <section className="py-8 sm:py-16 bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Checkout</h1>

        <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mt-6 sm:mt-8 grid gap-6 lg:grid-cols-3">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="rounded-xl border p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">
                  Shipping Information
                </h2>
                <FieldGroup>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Controller
                      name="firstName"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="firstName">
                            First Name
                          </FieldLabel>
                          <Input
                            {...field}
                            id="firstName"
                            placeholder="John"
                            aria-invalid={fieldState.invalid}
                            autoComplete="given-name"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="lastName"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                          <Input
                            {...field}
                            id="lastName"
                            placeholder="Doe"
                            aria-invalid={fieldState.invalid}
                            autoComplete="family-name"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <div className="sm:col-span-2">
                      <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                              {...field}
                              id="email"
                              type="email"
                              placeholder="john@example.com"
                              aria-invalid={fieldState.invalid}
                              autoComplete="email"
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Controller
                        name="phone"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="phone">
                              Phone Number
                            </FieldLabel>
                            <Input
                              {...field}
                              id="phone"
                              type="tel"
                              placeholder="+880 1234 567890"
                              aria-invalid={fieldState.invalid}
                              autoComplete="tel"
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Controller
                        name="address"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="address">Address</FieldLabel>
                            <Input
                              {...field}
                              id="address"
                              placeholder="123 Main Street"
                              aria-invalid={fieldState.invalid}
                              autoComplete="street-address"
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </div>

                    <Controller
                      name="city"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="city">City</FieldLabel>
                          <Input
                            {...field}
                            id="city"
                            placeholder="Dhaka"
                            aria-invalid={fieldState.invalid}
                            autoComplete="address-level2"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="postal"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="postal">Postal Code</FieldLabel>
                          <Input
                            {...field}
                            id="postal"
                            placeholder="1200"
                            aria-invalid={fieldState.invalid}
                            autoComplete="postal-code"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                </FieldGroup>
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
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => handlePaymentMethodChange("card")}
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
                      paymentMethod === "mobile"
                        ? "border-primary bg-accent"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      id="mobile"
                      value="mobile"
                      checked={paymentMethod === "mobile"}
                      onChange={() => handlePaymentMethodChange("mobile")}
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
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => handlePaymentMethodChange("cod")}
                      className="h-4 w-4"
                    />
                    <Building2 className="h-5 w-5" />
                    <span className="text-sm sm:text-base">
                      Cash on Delivery
                    </span>
                  </label>
                </div>

                {/* Card Details (conditional) */}
                {paymentMethod === "card" && (
                  <FieldGroup className="mt-4">
                    <Controller
                      name="cardNumber"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="cardNumber">
                            Card Number
                          </FieldLabel>
                          <Input
                            {...field}
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            aria-invalid={fieldState.invalid}
                            autoComplete="cc-number"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Controller
                        name="expiry"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="expiry">
                              Expiry Date
                            </FieldLabel>
                            <Input
                              {...field}
                              id="expiry"
                              placeholder="MM/YY"
                              aria-invalid={fieldState.invalid}
                              autoComplete="cc-exp"
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                      <Controller
                        name="cvv"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="cvv">CVV</FieldLabel>
                            <Input
                              {...field}
                              id="cvv"
                              placeholder="123"
                              maxLength={3}
                              aria-invalid={fieldState.invalid}
                              autoComplete="cc-csc"
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </div>
                  </FieldGroup>
                )}

                {/* Mobile Banking Details (conditional) */}
                {paymentMethod === "mobile" && (
                  <FieldGroup className="mt-4">
                    <Controller
                      name="mobileNumber"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="mobileNumber">
                            Mobile Number
                          </FieldLabel>
                          <Input
                            {...field}
                            id="mobileNumber"
                            placeholder="01712345678"
                            aria-invalid={fieldState.invalid}
                            autoComplete="tel"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>
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

                <Button
                  type="submit"
                  form="checkout-form"
                  className="w-full mt-6 rounded-full"
                  size="lg"
                >
                  Place Order
                </Button>

                <p className="text-xs text-center text-foreground/60 mt-4">
                  By placing your order, you agree to our terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CheckoutPageController;
