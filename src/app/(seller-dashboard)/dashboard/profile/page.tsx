/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

import SellerProfileHeader from "@/components/seller/SellerProfileHeader";
import SellerProfileForm from "@/components/seller/SellerProfileForm";
import SellerProfileCard from "@/components/seller/SellerProfileCard";
import { sellerService } from "@/services/seller/sellerProfile.service";

import type { SellerProfile } from "@/components/types/seller";

export default function SellerProfilePage() {
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const res = await sellerService.getMyProfile();

      if (!mounted) return;

      setProfile(res.data?.data ?? null);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading seller profile...
      </div>
    );
  }

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