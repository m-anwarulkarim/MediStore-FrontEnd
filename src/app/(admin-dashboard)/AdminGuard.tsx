"use client";

import { useRequireRole } from "@/lib/auth/require-role";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { loading } = useRequireRole(["ADMIN"]);

    if (loading) return <div className="text-sm text-muted-foreground p-4">Loading...</div>;

    return <>{children}</>;
}