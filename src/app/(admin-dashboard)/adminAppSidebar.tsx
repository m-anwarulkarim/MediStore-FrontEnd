import * as React from "react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { HeartPulseIcon } from "lucide-react";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      items: [{ title: "Overview", url: "/admin" }],
    },
    {
      title: "Users",
      url: "/admin/users",
      items: [{ title: "All Users", url: "/admin/users" }],
    },
    {
      title: "Categories",
      url: "/admin/categories",
      items: [{ title: "Manage Categories", url: "/admin/categories" }],
    },
    {
      title: "Medicines",
      url: "/admin/medicines",
      items: [{ title: "All Medicines", url: "/admin/medicines" }],
    },
    {
      title: "Orders",
      url: "/admin/orders",
      items: [{ title: "All Orders", url: "/admin/orders" }],
    },
  ],
};

export function AdminAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="bg-blue-400 text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <HeartPulseIcon className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Admin Dassboard</span>
                  <span className="">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
