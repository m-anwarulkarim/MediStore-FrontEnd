import * as React from "react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { HeartPulseIcon } from "lucide-react";

// {
//   title: "Orders",
//   items: [
//     { title: "All Orders", url: "/dashboard/orders" },
//     { title: "Pending Orders", url: "/dashboard/orders?status=pending" },
//   ],
// } example for dropdown

const data = {
  navMain: [
    {
      title: "Category",
      url: "/dashboard/categories",
    },
    {
      title: "Medicine",
      url: "/dashboard/medicines",
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
    },
    {
      title: "Reviews",
      url: "/dashboard/reviews",
    },
    {
      title: "My Shop",
      url: "/dashboard/profile",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-blue-400 text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <HeartPulseIcon className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Seller Dassboard</span>
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

      <SidebarRail />
    </Sidebar>
  );
}
