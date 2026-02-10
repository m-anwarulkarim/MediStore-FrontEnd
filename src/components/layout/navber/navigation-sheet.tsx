"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // যদি তোমার NavbarSearch আলাদা component না থাকে
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Logo } from "@/components/layout/navber/logo";
import { NavMenu } from "@/components/layout/navber/nav-menu";
import { NavbarSearch } from "./navbar-search";

// ✅ যদি তোমার আগেই NavbarSearch component থাকে, এটা ব্যবহার করো:
// import { NavbarSearch } from "@/components/layout/navber/navbar-search";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <VisuallyHidden>
        <SheetTitle>Navigation Menu</SheetTitle>
      </VisuallyHidden>

      <SheetTrigger asChild>
        <Button size="icon" variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent className="px-6 py-3">
        <div className="flex h-full flex-col gap-4">
          <Logo />

          {/* ✅ Mobile Searchbar (Sheet-এর ভিতরে) */}
          {/* Option A: যদি NavbarSearch component থাকে */}
          <NavbarSearch placeholder="Search medicines..." />

          {/* Option B: quick simple Input (এখনই কাজ করবে) */}
          {/* <div className="md:hidden">
            <Input placeholder="Search medicines..." />
          </div> */}

          {/* ✅ Vertical Nav + viewport off (Sheet-এর ভিতরে dropdown viewport দরকার নেই) */}
          <NavMenu
            className="mt-2 [&>div]:h-full"
            orientation="vertical"
            viewport={false}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
