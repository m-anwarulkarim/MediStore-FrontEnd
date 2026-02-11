import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SellerProfile } from "../types/seller";

export default function SellerProfileCard({
  profile,
}: {
  profile: SellerProfile;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Current Profile</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="relative h-14 w-14 overflow-hidden rounded-xl border bg-muted">
            {profile.shopLogo ? (
              <Image
                src={profile.shopLogo}
                alt={profile.shopName}
                fill
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="min-w-0">
            <p className="truncate text-lg font-semibold">{profile.shopName}</p>
            <p className="text-sm text-muted-foreground">
              License:{" "}
              <span className="font-medium text-foreground">
                {profile.licenseNumber}
              </span>
            </p>
          </div>
        </div>

        {profile.shopDescription ? (
          <>
            <Separator />
            <p className="text-sm leading-relaxed text-muted-foreground">
              {profile.shopDescription}
            </p>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
