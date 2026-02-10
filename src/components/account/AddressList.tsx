"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import type { Address } from "../types/api/address";
import { addressApi } from "@/actions/address.service";
import AddressFormDialog from "./AddressFormDialog";

const formatLine = (a: Address) => {
  const parts = [a.addressLine, a.area ?? "", a.city, a.postalCode ?? ""]
    .map((x) => String(x).trim())
    .filter(Boolean);
  return parts.join(", ");
};

export default function AddressList({
  initialAddresses,
}: {
  initialAddresses: Address[];
}) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ✅ always derive default id from state
  const defaultId = useMemo(
    () => addresses.find((a) => a.isDefault)?.id ?? null,
    [addresses],
  );

  const onDelete = async (id: string) => {
    if (deletingId) return;

    setDeletingId(id);

    const prev = addresses;
    setAddresses((s) => s.filter((a) => a.id !== id));

    const res = await addressApi.remove(id);

    setDeletingId(null);

    if (res?.error) {
      setAddresses(prev);
      toast.error(res.error.message);
      return;
    }

    toast.success("Address deleted");
  };

  const onCreated = (addr: Address) => {
    setAddresses((s) =>
      addr.isDefault
        ? [addr, ...s.map((x) => ({ ...x, isDefault: false }))]
        : [addr, ...s],
    );
  };

  const onUpdated = (addr: Address) => {
    setAddresses((s) => {
      const mapped = s.map((a) => (a.id === addr.id ? addr : a));
      if (addr.isDefault) {
        return mapped.map((a) =>
          a.id === addr.id ? a : { ...a, isDefault: false },
        );
      }
      return mapped;
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Addresses</CardTitle>
        <AddressFormDialog mode="create" onCreated={onCreated}>
          <Button size="sm">Add Address</Button>
        </AddressFormDialog>
      </CardHeader>

      <CardContent className="space-y-4">
        {addresses.length === 0 ? (
          <p className="text-sm text-muted-foreground">No address found.</p>
        ) : (
          addresses.map((a) => {
            const isDeleting = deletingId === a.id;

            return (
              <div key={a.id} className="rounded-lg border p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{a.fullName}</p>

                      {a.id === defaultId && (
                        <Badge variant="secondary">Default</Badge>
                      )}

                      {/* optional label */}
                      {a.label ? (
                        <Badge variant="outline" className="truncate">
                          {a.label}
                        </Badge>
                      ) : null}
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {formatLine(a)}
                    </p>
                    <p className="text-sm text-muted-foreground">{a.phone}</p>
                  </div>

                  <div className="flex gap-2 sm:justify-end">
                    <AddressFormDialog
                      mode="edit"
                      initialValue={a}
                      onUpdated={onUpdated}
                    >
                      <Button variant="outline" size="sm" disabled={isDeleting}>
                        Edit
                      </Button>
                    </AddressFormDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete address?</AlertDialogTitle>
                          <AlertDialogDescription>
                            If you delete this address, you will not be able to
                            get it back.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isDeleting}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(a.id)}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
