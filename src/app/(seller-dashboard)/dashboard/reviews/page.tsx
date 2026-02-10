"use client";

import { useSellerReviews } from "@/hooks/reviews/useSellerReviews";
import ReviewList from "@/components/reviews/ReviewList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SellerReviewsPage() {
  const { data, isLoading, error } = useSellerReviews();

  if (isLoading)
    return <div className="p-4 text-sm text-muted-foreground">Loading...</div>;
  if (error)
    return (
      <div className="p-4 text-sm text-destructive">
        {(error as Error).message}
      </div>
    );

  const reviews = data?.data ?? [];

  return (
    <div className="p-4 md:p-6 grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>My Medicines Reviews</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <ReviewList reviews={reviews} />
        </CardContent>
      </Card>
    </div>
  );
}
