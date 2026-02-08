"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import { reviewService } from "@/services/review/review.service";

export default function ReviewDialog({
  medicineId,
  medicineName,
}: {
  medicineId: string;
  medicineName: string;
}) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (rating < 1 || rating > 5) {
      toast.error("Rating must be between 1 and 5");
      return;
    }

    setLoading(true);
    const res = await reviewService.createReview({
      medicineId,
      rating,
      comment: comment || undefined,
    });
    setLoading(false);

    if (res.error) {
      toast.error(res.error.message || "Failed to submit review");
      return;
    }

    toast.success("Review submitted!");
    setComment("");
    setRating(5);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Leave Review
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review: {medicineName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-medium">Rating (1-5)</p>
            <Input
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Comment (optional)</p>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your experience..."
            />
          </div>

          <Button className="w-full" onClick={submit} disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
