import { userApi } from "@/services/user/user.service";
import { addressApi } from "@/actions/address.service";

import ProfileHeader from "@/components/account/ProfileHeader";
import ProfileInfoCard from "@/components/account/ProfileInfoCard";
import AddressList from "@/components/account/AddressList";

export default async function AdminProfilePage() {
  const [meRes, addrRes /*summaryRes*/] = await Promise.all([
    userApi.me(),
    addressApi.myAddresses(),
    userApi.summary(),
  ]);

  const me = meRes.data?.data ?? null;
  const addresses = addrRes.data?.data ?? [];
  // const summary = summaryRes.data?.data ?? null;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        {/* ===== Profile Header ===== */}
        <div className="mb-8">
          <ProfileHeader />
        </div>

        {/* ===== Main Content ===== */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-8">
            <ProfileInfoCard user={me} />

            <div className="rounded-xl border bg-background p-4 shadow-sm">
              <AddressList initialAddresses={addresses} />
            </div>
          </div>

          {/* Right Column (Future use / summary) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-xl border bg-background p-5 shadow-sm">
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                  Account Overview
                </h3>
                <p className="text-2xl font-semibold">{me?.name ?? "Admin"}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Manage your profile & addresses
                </p>
              </div>

              {/* later add */}
              {/* <ProfileSummaryCards summary={summary} /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
