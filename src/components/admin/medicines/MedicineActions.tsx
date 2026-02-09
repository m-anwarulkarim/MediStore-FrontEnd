"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export function MedicineActions({ id }: { id: string }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href={`/products/${id}`}>
          <Eye className="h-4 w-4 mr-2" />
          View
        </Link>
      </Button>
    </div>
  );
}
