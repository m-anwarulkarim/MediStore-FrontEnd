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
import { Loader2 } from "lucide-react";

// Zod Schema
const categorySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  image: z.string().url("Invalid URL").optional().or(z.literal("")),
  description: z
    .string()
    .min(10, "Min 10 characters")
    .max(200, "Max 200 characters"),
});

// Infer Type from Schema
type CategoryFormValues = z.infer<typeof categorySchema>;

interface UpdateCategoryFormProps {
  initialData: {
    id: string;
    name: string;
    image?: string;
    description: string;
  };
}

export function UpdateCategoryForm({ initialData }: UpdateCategoryFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  const form = useForm({
    defaultValues: {
      name: initialData.name,
      image: initialData.image || "",
      description: initialData.description,
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
        const { data, error, status } = await clientFetch(
          `api/categories/${initialData.id}`,
          {
            method: "PATCH",
            body: JSON.stringify(payload),
          },
        );

        if (status === 200 || status === 204) {
          toast.success("Category updated successfully!", data.message);
          router.push("/dashboard/categories");
          router.refresh();
        } else {
          const errorMsg = error?.message || "Failed to update category";
          toast.error(`Error ${status}: ${errorMsg}`);
        }
      } catch (err) {
        toast.error("An unexpected error occurred on the server.");
        console.error("Update Error:", err);
      } finally {
        setIsPending(false);
      }
    },
  });

  return (
    <Card className="w-full sm:max-w-md shadow-lg">
      <CardHeader>
        <CardTitle>Update Category</CardTitle>
        <CardDescription>
          You are editing <strong>{initialData.name}</strong> information.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="update-category-form"
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            {/* Name Field */}
            <form.Field name="name">
              {(field) => (
                <Field>
                  <FieldLabel>Category Name</FieldLabel>
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Electronics"
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            {/* Image URL Field */}
            <form.Field name="image">
              {(field) => (
                <Field>
                  <FieldLabel>Image URL (Optional)</FieldLabel>
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            {/* Description Field */}
            <form.Field name="description">
              {(field) => (
                <Field>
                  <FieldLabel>Description</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      rows={4}
                      className="min-h-20 resize-none"
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.state.value?.length || 0}/200
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex justify-between gap-4 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="update-category-form"
          disabled={isPending}
          className="flex-1"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Confirm Update"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
