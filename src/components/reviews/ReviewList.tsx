"use client";

import { Review } from "../types/review.type";
import ReviewCard from "./ReviewCard";

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  if (!reviews?.length) {
    return (
      <div className="rounded-lg border p-4 text-sm text-muted-foreground">
        There are no reviews yet.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {reviews.map((r) => (
        <ReviewCard key={r.id} review={r} />
      ))}
    </div>
  );
}
