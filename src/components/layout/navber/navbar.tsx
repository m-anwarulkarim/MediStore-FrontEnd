import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/navber/logo";
import { NavMenu } from "@/components/layout/navber/nav-menu";
import { NavigationSheet } from "@/components/layout/navber/navigation-sheet";
import { NavbarSearch } from "./navbar-search";

import { getMe } from "@/lib/auth/get-me";
import LogoutButton from "../auth/LogoutButton";
export default async function Navbar() {
  const user = await getMe();

  const dashboardHref =
    user?.role === "ADMIN"
      ? "/admin"
      : user?.role === "SELLER"
        ? "/dashboard"
        : "/";

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
          {!user ? (
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
