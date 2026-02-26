/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/navber/logo";
import { NavMenu } from "@/components/layout/navber/nav-menu";
import { NavigationSheet } from "@/components/layout/navber/navigation-sheet";
import { NavbarSearch } from "./navbar-search";

import { getMe, type MeUser } from "@/lib/auth/get-me";
import LogoutButton from "../auth/LogoutButton";

export default function Navbar() {
  const [user, setUser] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const me = await getMe();
      if (!mounted) return;
      setUser(me);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const dashboardHref = useMemo(() => {
    if (!user) return "/";
    return user.role === "ADMIN"
      ? "/admin"
      : user.role === "SELLER"
        ? "/dashboard"
        : "/";
  }, [user]);

  return (
    <nav className="sticky top-0 z-50 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-full max-w-screen-xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex-shrink-0">
          <Link href={"/"}>
            <Logo />
          </Link>
        </div>

        <NavMenu className="hidden md:block" />
        <NavbarSearch className="hidden md:block w-full max-w-[420px]" />

        <div className="flex items-center gap-2 sm:gap-3">
          {loading ? null : !user ? (
            <Button
              asChild
              variant="outline"
              className="text-xs sm:text-sm px-2 sm:px-4 h-9 sm:h-10"
            >
              <Link href="/login">
                <span className="hidden xs:inline">Login/Register</span>
                <span className="xs:hidden">Login</span>
              </Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                className="text-xs sm:text-sm px-2 sm:px-4 h-9 sm:h-10"
              >
                <Link href={dashboardHref}>Dashboard</Link>
              </Button>

              <LogoutButton />
            </>
          )}

          <div className="md:hidden ml-1">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
}