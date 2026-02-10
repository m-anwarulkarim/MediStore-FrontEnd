"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SellerProfilePreviewCard({
  shopName,
  shopDescription,
  shopLogo,
  licenseNumber,
}: {
  shopName?: string;
  shopDescription?: string | null;
  shopLogo?: string | null;
  licenseNumber?: string;
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Profile Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {shopLogo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={shopLogo}
            alt="Shop Logo"
            className="h-16 w-16 rounded-xl border object-cover"
          />
        ) : (
          <div className="h-16 w-16 rounded-xl border bg-muted" />
        )}

        <div>
          <div className="text-sm opacity-70">Shop Name</div>
          <div className="font-medium">{shopName || "—"}</div>
        </div>

        <div>
          <div className="text-sm opacity-70">Description</div>
          <div className="text-sm text-muted-foreground">
            {shopDescription || "—"}
          </div>
        </div>

        <div>
          <div className="text-sm opacity-70">License Number</div>
          <div className="font-medium">{licenseNumber || "—"}</div>
        </div>
      </CardContent>
    </Card>
  );
}
