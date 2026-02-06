import { CreateCategoryForm } from "@/components/layout/category/createCategory";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CreateCategoryPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      {/* Top Section: Navigation & Header */}
      <div className="flex flex-col gap-4 mb-10">
        <div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="-ml-3 text-muted-foreground hover:text-primary"
          >
            <Link href="/dashboard">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to dashboard
            </Link>
          </Button>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
            Create New Category
          </h1>
          <p className="text-base text-muted-foreground">
            Fill in the details below to add a new medicine category to your
            store.
          </p>
        </div>
      </div>

      {/* Form Section: Card Style wrap */}
      <div className="bg-card border rounded-xl shadow-sm p-8 md:p-12">
        <div className="max-w-2xl mx-auto">
          <CreateCategoryForm />
        </div>
      </div>
    </div>
  );
}
