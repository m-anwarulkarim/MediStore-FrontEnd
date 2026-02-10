/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RatingStars from "./RatingStars";
import ReviewList from "./ReviewList";
import { useMedicineReviews } from "@/hooks/reviews/useMedicineReviews";

type Props = {
  medicineId: string;
};

export default function ReviewSection({ medicineId }: Props) {
  const { data, isLoading, error } = useMedicineReviews(medicineId);

  if (isLoading)
    return (
      <div className="text-sm text-muted-foreground">Loading reviews...</div>
    );
  if (error)
    return (
      <div className="text-sm text-destructive">{(error as Error).message}</div>
    );

  const reviews = data?.data ?? [];
  const avg =
    reviews.length === 0
      ? 0
      : reviews.reduce((s: any, r: any) => s + r.rating, 0) / reviews.length;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="text-base">Reviews</CardTitle>
        {reviews.length ? <RatingStars value={avg} /> : null}
      </CardHeader>

      <CardContent className="grid gap-3">
        <ReviewList reviews={reviews} />
      </CardContent>
    </Card>
  );
}
