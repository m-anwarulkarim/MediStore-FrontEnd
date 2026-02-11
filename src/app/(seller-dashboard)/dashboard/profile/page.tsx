import SellerProfileHeader from "@/components/seller/SellerProfileHeader";
import SellerProfileForm from "@/components/seller/SellerProfileForm";
import SellerProfileCard from "@/components/seller/SellerProfileCard";
import { sellerServer } from "@/services/seller/sellerProfile.service";

export default async function SellerProfilePage() {
  const res = await sellerServer.getMyProfile();

  const profile = res.data?.data ?? null;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <SellerProfileHeader isVerified={profile?.isVerified} />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <SellerProfileForm initialProfile={profile} />
        </div>

        <div className="space-y-6">
          {profile ? <SellerProfileCard profile={profile} /> : null}
        </div>
      </div>
    </div>
  );
}
