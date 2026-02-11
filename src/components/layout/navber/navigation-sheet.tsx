"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Logo } from "@/components/layout/navber/logo";
import { NavMenu } from "@/components/layout/navber/nav-menu";
import { NavbarSearch } from "./navbar-search";

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

          <NavbarSearch placeholder="Search medicines..." />

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
