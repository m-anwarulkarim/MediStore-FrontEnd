"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth/auth.service";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await authService.logout();

    if (res.error) {
      toast.error(res.error.message || "Logout failed");
      return;
    }

    toast.success("Logged out");
    router.push("/login");
    router.refresh();
  };

  return (
    <Button variant="destructive" size="sm" onClick={handleLogout}>
      Logout
    </Button>
  );
}
