"use client";

import { IconCompass } from "@tabler/icons-react";
import { Folder, Settings2 } from "lucide-react";
import { usePathname } from "next/navigation";
import type * as React from "react";
import { useMemo } from "react";
import { NavMain } from "@/components/sidebar/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavSecondary } from "./nav-secondary";

const data = {
  versions: ["Image generate", "Edit Images"],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const authNav = useMemo(
    () => [
      {
        title: "Explore",
        url: "/",
        icon: IconCompass,
        isActive: pathname === "/",
      },
      {
        title: "library",
        url: "/library",
        icon: Folder,
        isActive: pathname.startsWith("/library"),
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings2,
        isActive: pathname.startsWith("/settings"),
      },
    ],
    [pathname],
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>Vidara</SidebarHeader>

      <SidebarContent>
        <NavMain />
        <NavSecondary items={authNav} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
