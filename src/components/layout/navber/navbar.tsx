import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/navber/logo";
import { NavMenu } from "@/components/layout/navber/nav-menu";
import { NavigationSheet } from "@/components/layout/navber/navigation-sheet";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="h-16 border-b bg-background sticky top-0 z-50 dark:bg-background">
      <div className="mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />

        <div className="flex items-center gap-3">
          <Button asChild className="hidden sm:inline-flex" variant="outline">
            <Link href={"/login"}> Login</Link>
          </Button>
          <Button>
            <Link href={"/dashboard"}> Dashboard</Link>
          </Button>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
