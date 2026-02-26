/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { clientEnv } from "@/env";
import { tokenStore } from "@/lib/token"; // ✅ add

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function SignInForm() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        // ✅ 1) better-auth login
        const loginRes = await fetch(
          `${clientEnv.NEXT_PUBLIC_BACKEND_URL}api/auth/sign-in/email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(value),
            credentials: "include", // MUST
          },
        );

        const loginCT = loginRes.headers.get("content-type") || "";
        const loginData = loginCT.includes("application/json")
          ? await loginRes.json()
          : { message: await loginRes.text() };

        if (!loginRes.ok) {
          throw new Error(loginData?.message || "Invalid email or password");
        }

        // ✅ 2) Issue JWT from session
        const jwtRes = await fetch(
          `${clientEnv.NEXT_PUBLIC_BACKEND_URL}api/jwt/from-session`,
          {
            method: "POST",
            credentials: "include", // MUST
          },
        );

        const jwtCT = jwtRes.headers.get("content-type") || "";
        const jwtData = jwtCT.includes("application/json")
          ? await jwtRes.json()
          : { message: await jwtRes.text() };

        if (!jwtRes.ok) {
          throw new Error(jwtData?.message || "Failed to issue JWT");
        }

        // ✅ 3) Save access token
        if (jwtData?.accessToken) {
          tokenStore.set(jwtData.accessToken);
        }

        // ✅ 4) Save user
        const user = jwtData?.user || loginData?.user;
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }

        toast.success("Login successful!");
        formApi.reset();

        // ✅ 5) Role based redirect
        if (user?.role === "ADMIN") {
          router.replace("/admin");
        } else if (user?.role === "SELLER") {
          router.replace("/dashboard");
        } else {
          router.replace("/");
        }

        router.refresh();
      } catch (error: any) {
        console.error("Login error:", error);
        toast.error(error?.message || "Login failed. Please try again.");
      }
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto mt-10 shadow-lg">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Welcome back! Please sign in to continue
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="signin-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field name="email">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="password">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    id={field.name}
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="********"
                    autoComplete="current-password"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}