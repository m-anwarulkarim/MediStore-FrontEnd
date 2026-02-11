import { Badge } from "@/components/ui/badge";

export default function SellerProfileHeader({
  isVerified,
}: {
  isVerified?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Seller Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Update your shop information and maintain license verification.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={isVerified ? "default" : "secondary"}>
          {isVerified ? "Verified" : "Not Verified"}
        </Badge>
      </div>
    </div>
  );
}
