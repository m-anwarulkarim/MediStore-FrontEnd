"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSellerProfile } from "@/hooks/seller/useSellerProfile";
import SellerProfileHeader from "@/components/seller/profile/SellerProfileHeader";
import SellerProfileForm from "@/components/seller/profile/SellerProfileForm";
import SellerProfilePreviewCard from "@/components/seller/profile/SellerProfilePreviewCard";
import SellerRecentMedicines from "@/components/seller/profile/SellerRecentMedicines";

export default function SellerProfilePage() {
  const { data, isLoading, error } = useSellerProfile();

  if (isLoading) {
    return <div className="p-4 text-sm text-muted-foreground">Loading...</div>;
  }

  const profile = data?.success ? data.data : null;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <SellerProfileHeader
        shopName={profile?.shopName}
        isVerified={profile?.isVerified}
        email={profile?.user?.email}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SellerProfileForm profile={profile} />
        </div>

        <div className="space-y-4">
          <SellerProfilePreviewCard
            shopName={profile?.shopName}
            shopDescription={profile?.shopDescription}
            shopLogo={profile?.shopLogo}
            licenseNumber={profile?.licenseNumber}
          />

          <SellerRecentMedicines medicines={profile?.medicines} />
        </div>
      </div>
    </div>
  );
}
