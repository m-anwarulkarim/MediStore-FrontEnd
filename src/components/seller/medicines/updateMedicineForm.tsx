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
import { Loader2, RefreshCcw } from "lucide-react";

const stockUpdateSchema = z.object({
  stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Stock quantity must be 0 or more",
  }),
});

type StockFormValues = z.infer<typeof stockUpdateSchema>;

interface UpdateMedicineStockProps {
  initialData: {
    medicineId: string;
    slug: string;
    stock: number;
  };
}

export function UpdateMedicineStockForm({
  initialData,
}: UpdateMedicineStockProps) {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  const form = useForm({
    defaultValues: {
      stock: String(initialData.stock),
    } as StockFormValues,
    validators: {
      onSubmit: stockUpdateSchema,
    },
    onSubmit: async ({ value }) => {
      setIsPending(true);
      try {
        const { status, error } = await clientFetch(
          `/api/medicines/${initialData.medicineId}`,
          {
            method: "PATCH",
            body: JSON.stringify({ stock: Number(value.stock) }),
          },
        );

        if (status === 200 || status === 204) {
          toast.success("Inventory updated successfully!");
          router.push("/dashboard/medicines");
          router.refresh();
        } else {
          toast.error(error?.message || "Failed to update stock");
        }
      } catch (err: any) {
        toast.error("An unexpected error occurred.");
      } finally {
        setIsPending(false);
      }
    },
  });

  return (
    <Card className="w-full sm:max-w-md shadow-2xl border-muted-foreground/20 bg-card text-card-foreground">
      <CardHeader className="space-y-1.5 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary ring-1 ring-primary/20">
            <RefreshCcw className="h-5 w-5" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Update Stock
          </CardTitle>
        </div>
        <CardDescription className="text-sm font-medium">
          Adjust inventory level for:{" "}
          <span className="font-bold text-primary">{initialData.slug}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-6">
        <form
          id="stock-update-form"
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="stock">
              {(field) => (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                >
                  <FieldLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Available Quantity
                  </FieldLabel>
                  <Input
                    type="number"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="h-12 text-lg font-semibold bg-transparent border-muted-foreground/30 focus-visible:ring-primary"
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex items-center gap-4 border-t border-muted-foreground/10 bg-muted/5 p-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          className="flex-1 rounded-full"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="stock-update-form"
          disabled={isPending}
          className="flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Save Changes"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
