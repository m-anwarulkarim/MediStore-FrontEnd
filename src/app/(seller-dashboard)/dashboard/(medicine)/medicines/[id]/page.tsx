import { UpdateMedicineStockForm } from "@/components/layout/medicines/updateMedicineForm";
import { serverFetch } from "@/lib/fetch/serverFetch";
import { MoveLeft, AlertCircle, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

const UpdateMedicinePage = async ({ params }: PageProps) => {
  const { id } = await params;

  // Fetching medicine data from the server
  const { data, error } = await serverFetch(`/api/medicines/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  const medicineData = data?.data;

  // 1. Error or Not Found State (Fully English)
  if (error || !medicineData) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="bg-destructive/10 p-4 rounded-full mb-4">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
          Medicine Not Found
        </h2>
        <p className="text-muted-foreground max-w-[350px] mb-8">
          The medicine record you are looking for does not exist or there was a
          server error. Please try again.
        </p>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/dashboard/medicines" className="flex items-center gap-2">
            <MoveLeft className="h-4 w-4" /> Back to Inventory
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4 sm:px-6">
      {/* 2. Header Section */}
      <div className="mb-8 space-y-4">
        <Link
          href="/dashboard/medicines"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-all group"
        >
          <MoveLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Medicine Management
        </Link>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
            <LayoutDashboard className="h-4 w-4" />
            Inventory System
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Edit Stock
          </h1>
          <p className="text-base text-muted-foreground">
            Update the availability and stock levels for this medication.
          </p>
        </div>
      </div>

      {/* 3. Form Container Styling */}
      <div className="bg-background rounded-3xl border  shadow-slate-200/50 overflow-hidden">
        <div className="p-1">
          <UpdateMedicineStockForm initialData={medicineData} />
        </div>
      </div>

      {/* 4. Help Note */}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Changes made here will be updated across all pharmacy branches
        immediately.
      </p>
    </div>
  );
};

export default UpdateMedicinePage;
