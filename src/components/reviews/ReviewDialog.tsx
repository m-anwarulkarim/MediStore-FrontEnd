/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import { reviewService } from "@/services/review/review.service";
import { useMyReview } from "@/hooks/reviews/useMyReview";
import { useCreateReview } from "@/hooks/reviews/useCreateReview";
import { useUpdateReview } from "@/hooks/reviews/useUpdateReview";

type Props = {
  medicineId: string;
  medicineName?: string;
  orderId: string;
};

export default function ReviewDialog({
  medicineId,
  medicineName,
  orderId,
}: Props) {
  const [open, setOpen] = useState(false);

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 fetch my review
  const { data: myReview } = useMyReview(orderId, medicineId);

  const createMutation = useCreateReview(medicineId);
  const updateMutation = useUpdateReview(medicineId);

  // 🔹 prefill if review exists
  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating);
      setComment(myReview.comment ?? "");
    }
  }, [myReview]);

  const submit = async () => {
    if (rating < 1 || rating > 5) {
      toast.error("Rating must be between 1 and 5");
      return;
    }

    setLoading(true);

    try {
      if (myReview) {
        // ✏️ update
        await updateMutation.mutateAsync({
          reviewId: myReview.id,
          payload: {
            rating,
            comment: comment.trim() || undefined,
          },
        });
        toast.success("Review updated!");
      } else {
        // ➕ create
        await createMutation.mutateAsync({
          medicineId,
          orderId,
          rating,
          comment: comment.trim() || undefined,
        });
        toast.success("Review submitted!");
      }

      setOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={myReview ? "secondary" : "default"}>
          {myReview ? "Edit Review" : "Write Review"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {myReview ? "Edit your review" : "Write a review"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {medicineName ? `For: ${medicineName}` : "Share your experience"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Rating */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Rating (1–5)</label>
            <Input
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            />
          </div>

          {/* Comment */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">
              Comment <span className="text-muted-foreground">(optional)</span>
            </label>
            <Textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Optional comment (min 10 chars if provided)"
            />
            {comment.trim().length > 0 && comment.trim().length < 10 ? (
              <p className="text-xs text-destructive">
                Comment দিলে কমপক্ষে 10 অক্ষর হতে হবে।
              </p>
            ) : null}
          </div>

          <Button
            onClick={submit}
            disabled={
              loading ||
              (comment.trim().length > 0 && comment.trim().length < 10)
            }
          >
            {loading
              ? "Saving..."
              : myReview
                ? "Update Review"
                : "Submit Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
