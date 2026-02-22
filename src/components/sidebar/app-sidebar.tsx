"use client";

import { Folder, ImagePlay, Settings2 } from "lucide-react";
import { usePathname } from "next/navigation";
import type * as React from "react";
import { useMemo } from "react";
import { NavMain } from "@/components/sidebar/nav-main";
import { LoginButton, NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();

  const mainNav = useMemo(
    () => [
      {
        title: "Playground",
        url: "/",
        icon: ImagePlay,
        isActive: pathname === "/",
      },
      {
        title: "Media",
        url: "/media",
        icon: Folder,
        isActive: pathname.startsWith("/media"),
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
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <NavMain items={mainNav} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        {!isPending && session?.user ? (
          <NavUser
            name={session.user.name}
            email={session.user.email}
            avatar={session.user.image ?? ""}
          />
        ) : (
          <LoginButton />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
