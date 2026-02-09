/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { clientFetch } from "@/lib/fetch/clientFetch";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Loader2 } from "lucide-react";

// -------------------
// Zod Schema
// -------------------
const categorySchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters.")
    .max(50, "Name is too long."),
  image: z
    .string()
    .url("Please enter a valid image URL.")
    .startsWith("http", "Image URL must start with http or https")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters.")
    .max(200, "Description must be at most 200 characters."),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

// -------------------
// Component
// -------------------
export function CreateCategoryForm() {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      image: "",
      description: "",
    } as CategoryFormValues,
    validators: {
      onSubmit: categorySchema,
    },
    onSubmit: async ({ value }) => {
      setIsPending(true);

      const payload = {
        ...value,
        image: value.image?.trim() ? value.image : undefined,
      };

      try {
        const { data, error, status } = await clientFetch("/api/categories", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (status === 200 || status === 201) {
          toast.success("Category created successfully!", data.message);

          // ফর্ম রিসেট করা
          form.reset();

          // ক্যাটাগরি লিস্ট পেজে পাঠিয়ে দেওয়া
          router.push("/dashboard/category");

          // সার্ভার ডাটা রিফ্রেশ করা
          router.refresh();
        } else {
          const errorMsg = error?.message || "Failed to create category";
          toast.error(`Error ${status}: ${errorMsg}`);
        }
      } catch (err: any) {
        toast.error("An unexpected error occurred.", err.message);
      } finally {
        setIsPending(false);
      }
    },
  });

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Add Category</CardTitle>
        <CardDescription>
          Create a new medicine category for Medistore.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="category-form"
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            {/* Name Field */}
            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Category Name</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. Antibiotics"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* Image URL Field */}
            <form.Field name="image">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Image URL</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                    />
                    <FieldDescription>
                      Provide a direct image link (optional).
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* Description Field */}
            <form.Field name="description">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Describe the medicines..."
                        rows={4}
                        className="min-h-20 resize-none"
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {field.state.value?.length || 0}/200
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex justify-between gap-2 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
          className="flex-1"
        >
          Reset
        </Button>
        <Button
          type="submit"
          form="category-form"
          disabled={isPending}
          className="flex-1"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Create Category"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
