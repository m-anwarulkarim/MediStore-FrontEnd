"use client";

import ReactQueryProvider from "@/components/provider/ReactQueryProvider";
import { useRequireRole } from "@/lib/auth/require-role";

export default function SellerGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const { loading } = useRequireRole(["SELLER"]);

    if (loading) return <div className="text-sm text-muted-foreground p-4">Loading...</div>;

    return <ReactQueryProvider>{children}</ReactQueryProvider>;
}