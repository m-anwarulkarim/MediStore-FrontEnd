/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { clientFetch } from "@/lib/fetch/clientFetch";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Pill } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

interface MedicineListProps {
  initialMedicines: any[];
}

const MedicineList = ({ initialMedicines }: MedicineListProps) => {
  const [medicines, setMedicines] = useState(initialMedicines);

  const handleDelete = async (id: string, name: string) => {
    const confirmDelete = confirm(`Are you sure you want to delete "${name}"?`);
    if (!confirmDelete) return;

    try {
      const { error } = await clientFetch(`api/medicines/${id}`, {
        method: "DELETE",
      });

      if (error) {
        toast.error(error.message || "Failed to delete medicine!");
      } else {
        toast.success("Medicine deleted successfully!");
        setMedicines((prev) => prev.filter((med) => med.id !== id));
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {medicines.length === 0 ? (
        <div className="col-span-full text-center py-10 border-2 border-dashed rounded-xl text-muted-foreground">
          No medicines found.
        </div>
      ) : (
        medicines.map((medicine: any) => (
          <Card
            key={medicine.id}
            className="group hover:shadow-lg transition-all border-2 hover:border-primary/20 bg-card"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Pill className="h-5 w-5" />
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                  >
                    <Link href={`/dashboard/medicines/${medicine.id}`}>
                      <Edit2 className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(medicine.id, medicine.name)}
                    className="h-8 w-8 text-destructive hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardTitle className="text-xl mt-4 truncate">
                {medicine.name}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {medicine.manufacturer}
              </p>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                {medicine.description || "No description provided."}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-primary">
                  ৳{medicine.price}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${medicine.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  Stock: {medicine.stock}
                </span>
              </div>
            </CardContent>

            <CardFooter className="text-xs text-muted-foreground border-t pt-4 bg-muted/5">
              Category: {medicine.category?.name || "N/A"}
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default MedicineList;
