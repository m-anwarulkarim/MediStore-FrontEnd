"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { userApi } from "@/services/user/user.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserMe } from "../types/api/user";

export default function ProfileInfoCard({ user }: { user: UserMe | null }) {
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [loading, setLoading] = useState(false);

  const changed = useMemo(() => {
    return (user?.name ?? "") !== name || (user?.phone ?? "") !== phone;
  }, [user, name, phone]);

  const onSave = async () => {
    setLoading(true);
    const res = await userApi.updateMe({
      name: name.trim(),
      phone: phone.trim(),
    });
    setLoading(false);

    if (res?.error) {
      toast.error(res.error.message);
      return;
    }

    toast.success(res.data?.message ?? "Profile updated");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Info</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email ?? ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Input value={user?.role ?? ""} disabled />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onSave} disabled={loading || !changed}>
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
