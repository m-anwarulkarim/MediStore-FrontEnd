"use client";

import { Badge } from "@/components/ui/badge";

export default function SellerProfileHeader({
  shopName,
  isVerified,
  email,
}: {
  shopName?: string;
  isVerified?: boolean;
  email?: string;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold">
          {shopName ? shopName : "Seller Profile"}
        </h1>
        {email ? (
          <p className="text-sm text-muted-foreground">{email}</p>
        ) : null}
      </div>

      <Badge variant={isVerified ? "default" : "outline"} className="w-fit">
        {isVerified ? "Verified" : "Not Verified"}
      </Badge>
    </div>
  );
}
