"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Studio } from "./version-switcher";

const data = {
  versions: ["Image generate", "Edit Images"],
};

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Studio</SidebarGroupLabel>
      <SidebarMenu>
        <Studio versions={data.versions} defaultVersion={data.versions[0]} />
      </SidebarMenu>
    </SidebarGroup>
  );
}
