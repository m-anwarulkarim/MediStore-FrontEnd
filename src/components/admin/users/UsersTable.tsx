"use client";

import { RoleSelect } from "./RoleSelect";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/components/types/user";
import { StatusSelect } from "./StatusSelect";

export function UsersTable({
  users,
  onUserRoleUpdated,
}: {
  users: User[];
  onUserRoleUpdated?: (userId: string, newRole: User["role"]) => void;
}) {
  return (
    <div className="rounded-xl border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell className="font-medium">{u.name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>
                <StatusSelect userId={u.id} currentStatus={u.status} />
              </TableCell>
              <TableCell>
                <RoleSelect
                  userId={u.id}
                  currentRole={u.role}
                  onChanged={(newRole) => onUserRoleUpdated?.(u.id, newRole)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
