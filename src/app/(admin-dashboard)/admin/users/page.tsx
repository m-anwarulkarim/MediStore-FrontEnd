/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { clientFetch } from "@/lib/fetch/clientFetch";
import { User } from "@/components/types/user";
import { UsersTable } from "@/components/admin/users/UsersTable";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await clientFetch<{ success: boolean; data: User[] }>(
        "/api/admin/users",
        { method: "GET" },
      );

      if (res.error) throw new Error(res.error.message);

      setUsers(res.data?.data ?? []);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-4">
      {loading ? <div>Loading...</div> : <UsersTable users={users} />}
    </div>
  );
}
