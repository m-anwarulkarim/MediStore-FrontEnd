/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function LogoutPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const res = await authClient.signOut();
      // BetterAuth logout
      console.log(res);
      toast.success("Logged out successfully!");
      // Redirect to login page
      window.location.href = "/login";
    } catch (error: any) {
      console.error("Logout failed:", error);
      toast.error(error?.message || "Logout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="w-full max-w-md p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md text-center">
        <LogOut className="mx-auto mb-4 h-10 w-10 text-destructive" />
        <h1 className="text-2xl font-semibold mb-2 text-destructive-foreground">
          Logout
        </h1>
        <p className="mb-6 text-muted-foreground">
          Are you sure you want to logout? You will need to login again to
          access your account.
        </p>
        <Button
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          {isLoading ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </div>
  );
}
