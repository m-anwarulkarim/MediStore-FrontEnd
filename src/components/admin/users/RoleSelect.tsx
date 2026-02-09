/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { clientFetch } from "@/lib/fetch/clientFetch";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@/components/types/user";

type RoleSelectProps = {
  userId: string;
  currentRole: Role;
  onChanged?: (newRole: Role) => void;
};

export function RoleSelect({
  userId,
  currentRole,
  onChanged,
}: RoleSelectProps) {
  const [value, setValue] = useState<Role>(currentRole);
  const [loading, setLoading] = useState(false);

  const onChange = async (role: Role) => {
    setValue(role);
    setLoading(true);

    try {
      await clientFetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });

      toast.success("Role updated");
      onChanged?.(role);
    } catch (e: any) {
      toast.error(e?.message || "Failed to update role");
      setValue(currentRole);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v as Role)}
      disabled={loading}
    >
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="CUSTOMER">CUSTOMER</SelectItem>
        <SelectItem value="SELLER">SELLER</SelectItem>
        <SelectItem value="ADMIN">ADMIN</SelectItem>
      </SelectContent>
    </Select>
  );
}
