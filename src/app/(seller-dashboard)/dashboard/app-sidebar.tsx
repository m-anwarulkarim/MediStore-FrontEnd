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

// This is sample data.
const data = {
  navMain: [
    // ------------------------
    // Categories (Seller can create/update/delete)
    // ------------------------
    {
      title: "Category",
      url: "/dashboard/category",
      items: [
        {
          title: "All Category",
          url: "/dashboard/category",
        },
      ],
    },

    // ------------------------
    // Medicines (Seller inventory)
    // ------------------------
    {
      title: "Medicine",
      url: "/dashboard/medicines",
      items: [
        {
          title: "All Medicines",
          url: "/dashboard/medicines",
        },

        {
          title: "Stock Management",
          url: "/dashboard/medicines/stock",
        },
      ],
    },

    // ------------------------
    // Orders (incoming orders + status update)
    // ------------------------
    {
      title: "Orders",
      url: "/dashboard/orders",
      items: [
        {
          title: "Incoming Orders",
          url: "/dashboard/orders",
        },
        {
          title: "Order Status",
          url: "/dashboard/orders/status",
        },
      ],
    },

    // ------------------------
    // Reviews (seller can view reviews of their medicines)
    // ------------------------
    {
      title: "Reviews",
      url: "/dashboard/reviews",
      items: [
        {
          title: "All Reviews",
          url: "/dashboard/reviews",
        },
      ],
    },

    // ------------------------
    // Seller Profile
    // ------------------------
    {
      title: "Seller Profile",
      url: "/dashboard/seller/profile",
      items: [
        {
          title: "My Profile",
          url: "/dashboard/seller/profile",
        },
        {
          title: "Edit Profile",
          url: "/dashboard/seller/profile/edit",
        },
      ],
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
