/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import { useCreateReview } from "@/hooks/reviews/useCreateReview";
import { useUpdateReview } from "@/hooks/reviews/useUpdateReview";
import { Review } from "../types/review.type";
import { ReviewFormValues, reviewSchema } from "@/schemas/review.schema";

type Props = {
  medicineId: string;
  orderId: string;
  existingReview?: Review | null;
};

export default function ReviewFormDialog({
  medicineId,
  orderId,
  existingReview,
}: Props) {
  const [open, setOpen] = React.useState(false);

  const createMutation = useCreateReview(medicineId);
  const updateMutation = useUpdateReview(medicineId);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: existingReview?.rating ?? 5,
      comment: existingReview?.comment ?? "",
    },
  });

  React.useEffect(() => {
    form.reset({
      rating: existingReview?.rating ?? 5,
      comment: existingReview?.comment ?? "",
    });
  }, [existingReview, form]);

  const onSubmit = async (values: ReviewFormValues) => {
    try {
      if (existingReview?.id) {
        await updateMutation.mutateAsync({
          reviewId: existingReview.id,
          payload: { rating: values.rating, comment: values.comment },
        });
        toast.success("Review updated!");
      } else {
        await createMutation.mutateAsync({
          medicineId,
          orderId,
          rating: values.rating,
          comment: values.comment,
        });
        toast.success("Review submitted!");
      }

      setOpen(false);
    } catch (e: any) {
      toast.error(e?.message || "Something went wrong");
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={existingReview ? "secondary" : "default"}>
          {existingReview ? "Edit Review" : "Write Review"}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {existingReview ? "Update Review" : "Create Review"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Rating (1-5)</label>
            <Input
              type="number"
              min={1}
              max={5}
              step={1}
              {...form.register("rating", { valueAsNumber: true })}
            />
            {form.formState.errors.rating?.message ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.rating.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Comment</label>
            <Textarea rows={5} {...form.register("comment")} />
            {form.formState.errors.comment?.message ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.comment.message}
              </p>
            ) : null}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
