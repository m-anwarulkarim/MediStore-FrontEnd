/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

import { userApi } from "@/services/user/user.service";
import { addressApi } from "@/actions/address.service";

import ProfileHeader from "@/components/account/ProfileHeader";
import ProfileInfoCard from "@/components/account/ProfileInfoCard";
import AddressList from "@/components/account/AddressList";

export default function CustomerProfilePage() {
  const [me, setMe] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const [meRes, addrRes, summaryRes] = await Promise.all([
        userApi.me(),
        addressApi.myAddresses(),
        userApi.summary(),
      ]);

      if (!mounted) return;

      setMe(meRes.data?.data ?? null);
      setAddresses(addrRes.data?.data ?? []);
      // const summary = summaryRes.data?.data ?? null; // future use

      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;
  }

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

          {/* Right Column */}
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