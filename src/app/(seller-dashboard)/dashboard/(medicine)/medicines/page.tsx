/**
 * Path: app/dashboard/medicines/page.tsx
 * Description: সেলারের সব মেডিসিন দেখার মেইন পেজ (অরিজিনাল স্টাইল)।
 */

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, LayoutDashboardIcon } from "lucide-react";
import Link from "next/link";
import { serverFetch } from "@/lib/fetch/serverFetch";
import MedicineList from "./medicineList";

const ViewAllMedicines = async () => {
  // ডাটা ফেচিং
  const { data, error } = await serverFetch("/api/medicines", {
    method: "GET",
    cache: "no-store",
  });

  // ডাটা চেক (আপনার JSON ডাটা অনুযায়ী data.data নেওয়া হয়েছে)
  const medicinesArray = data?.data || [];

  return (
    <div className="flex min-h-screen items-center justify-center py-12">
      <div className="w-full max-w-7xl px-6">
        {/* Header Section - হুবহু আপনার দেওয়া ডিজাইন */}
        <div className="text-center space-y-4">
          <h2 className="font-semibold text-4xl tracking-tight sm:text-5xl">
            Explore Medistor medicines
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Easily manage, edit, or remove your medicines from here.
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <Button
              asChild
              className="rounded-full px-6 shadow-md transition-transform hover:scale-105"
            >
              <Link href="/dashboard/create-medicine">
                <Plus className="mr-2 h-4 w-4" /> Create medicines
              </Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full px-6">
              <Link href="/dashboard">
                <LayoutDashboardIcon className="mr-2 h-4 w-4" /> Dashboard
              </Link>
            </Button>
          </div>
        </div>

        {/* Medicine List Area */}
        <div className="mt-10 sm:mt-16">
          {error ? (
            <div className="text-center py-10 border-2 border-dashed rounded-xl text-destructive">
              Failed to load medicines.
            </div>
          ) : (
            <MedicineList initialMedicines={medicinesArray} />
          )}
        </div>

        {/* Footer info */}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          Total {medicinesArray.length} medicines available in your store.
        </div>
      </div>
    </div>
  );
};

export default ViewAllMedicines;
