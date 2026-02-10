"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RatingStars from "./RatingStars";
import { Review } from "../types/review.type";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">
            {review.user?.name || "User"}
          </CardTitle>
          <RatingStars value={review.rating} showValue={false} />
        </div>
        <p className="text-xs text-muted-foreground">
          {new Date(review.createdAt).toLocaleString()}
        </p>
      </CardHeader>

      <CardContent>
        <p className="text-sm leading-relaxed">{review.comment}</p>
      </CardContent>
    </Card>
  );
}
