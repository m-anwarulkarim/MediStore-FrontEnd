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
import { Loader2, Pill } from "lucide-react";

// -------------------
// Zod Schema
// -------------------
const medicineSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  manufacturer: z.string().min(2, "Manufacturer name is required."),
  price: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Enter a valid price.",
    ),
  categoryId: z.string().min(1, "Please select a category."),
});

type MedicineFormValues = z.infer<typeof medicineSchema>;

export function CreateMedicineForm() {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);
  const [categories, setCategories] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await clientFetch("/api/categories");

        if (data?.data) setCategories(data.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCats();
  }, []);

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      manufacturer: "",
      price: "",
      categoryId: "",
    } as MedicineFormValues,
    validators: {
      onSubmit: medicineSchema,
    },
    onSubmit: async ({ value }) => {
      setIsPending(true);

      const payload = {
        name: value.name,
        description: value.description,
        manufacturer: value.manufacturer,
        price: Number(value.price),
        categoryId: value.categoryId,
      };

      try {
        const { status } = await clientFetch("/api/medicines", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (status === 200 || status === 201) {
          toast.success("Medicine added successfully!");
          form.reset();
          router.push("/dashboard/medicines");
          router.refresh();
        } else {
          toast.error("Failed to add medicine.");
        }
      } catch (err) {
        toast.error("An unexpected error occurred.");
      } finally {
        setIsPending(false);
      }
    },
  });

  return (
    <Card className="w-full sm:max-w-2xl shadow-lg border-2">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Pill className="h-5 w-5" />
          </div>
          <CardTitle className="text-2xl">Add New Medicine</CardTitle>
        </div>
        <CardDescription>
          ইনভেন্টরিতে নতুন ঔষধ যোগ করতে নিচের ৫টি তথ্য নির্ভুলভাবে প্রদান করুন।
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="create-medicine-form"
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Medicine Name */}
            <form.Field name="name">
              {(field) => (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                >
                  <FieldLabel>Medicine Name</FieldLabel>
                  <Input
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Napa Extra"
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            {/* Manufacturer */}
            <form.Field name="manufacturer">
              {(field) => (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                >
                  <FieldLabel>Manufacturer</FieldLabel>
                  <Input
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Acme Pharma Ltd."
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            {/* Price */}
            <form.Field name="price">
              {(field) => (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                >
                  <FieldLabel>Price (BDT)</FieldLabel>
                  <Input
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="55.00"
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            {/* Category Dropdown */}
            <form.Field name="categoryId">
              {(field) => (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                >
                  <FieldLabel>Category</FieldLabel>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
          </FieldGroup>

          {/* Description */}
          <form.Field name="description">
            {(field) => (
              <Field
                data-invalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
              >
                <FieldLabel>Description</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Used to treat mild to moderate pain and fever..."
                    rows={4}
                    className="resize-none"
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums text-[10px]">
                      {field.state.value?.length || 0}/500
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>
        </form>
      </CardContent>

      <CardFooter className="flex justify-between gap-4 border-t bg-slate-50/50 p-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
          className="flex-1 rounded-full"
        >
          Reset
        </Button>
        <Button
          type="submit"
          form="create-medicine-form"
          disabled={isPending}
          className="flex-1 rounded-full shadow-md"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Create Medicine"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
