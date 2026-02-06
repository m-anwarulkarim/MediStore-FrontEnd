"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { ProfileFormType } from "@/schemas/profile.schema";

type Props = {
  defaultValues: ProfileFormType;
};

export default function ProfileForm({ defaultValues }: Props) {
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      console.log("Profile Data:", value);
      toast.success("Profile updated successfully!");
    },
  });

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <Image
            src={defaultValues.image || "/avatar.png"}
            alt="Profile"
            width={80}
            height={80}
            className="rounded-full border"
          />
          <form.Field name="image">
            {(field) => (
              <div className="w-full">
                <Label>Image URL</Label>
                <Input
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="https://image.com/avatar.png"
                />
              </div>
            )}
          </form.Field>
        </div>

        {/* Name */}
        <form.Field name="name">
          {(field) => (
            <div>
              <Label>Name</Label>
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors?.[0] && (
                <p className="text-sm text-red-500">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Email */}
        <form.Field name="email">
          {(field) => (
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </form.Field>

        {/* Phone */}
        <form.Field name="phone">
          {(field) => (
            <div>
              <Label>Phone</Label>
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </form.Field>

        {/* Role */}
        <form.Field name="role">
          {(field) => (
            <div>
              <Label>Role</Label>
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </form.Field>

        {/* Status */}
        <form.Field name="status">
          {(field) => (
            <div>
              <Label>Status</Label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={field.state.value}
                onChange={(e) =>
                  field.handleChange(e.target.value as "Active" | "Inactive")
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          )}
        </form.Field>

        <Button onClick={form.handleSubmit} className="w-full">
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}
