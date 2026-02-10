"use client";

import { Star } from "lucide-react";

type Props = {
  value: number;
  size?: number;
  showValue?: boolean;
};

export default function RatingStars({
  value,
  size = 16,
  showValue = true,
}: Props) {
  const rounded = Math.round(value);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < rounded;
          return (
            <Star
              key={i}
              width={size}
              height={size}
              className={filled ? "fill-current" : ""}
            />
          );
        })}
      </div>
      {showValue ? (
        <span className="text-sm text-muted-foreground">
          {value.toFixed(1)}
        </span>
      ) : null}
    </div>
  );
}
