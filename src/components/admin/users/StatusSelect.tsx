/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { clientFetch } from "@/lib/fetch/clientFetch";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserStatus } from "@/components/types/user";

export function StatusSelect({
  userId,
  currentStatus,
}: {
  userId: string;
  currentStatus: UserStatus;
}) {
  const updateStatus = async (status: UserStatus) => {
    try {
      const res = await clientFetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      if (res.error) throw new Error(res.error.message);
      toast.success("Status updated");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <Select defaultValue={currentStatus} onValueChange={updateStatus}>
      <SelectTrigger className="w-[150px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ACTIVE">ACTIVE</SelectItem>
        <SelectItem value="BANNED">BANNED</SelectItem>
        <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
      </SelectContent>
    </Select>
  );
}
