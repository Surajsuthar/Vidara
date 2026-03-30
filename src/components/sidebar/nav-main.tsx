"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { MessageHistorys } from "../message-history";
import { Studio } from "./studio";

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Studio</SidebarGroupLabel>
      <SidebarMenu>
        <Studio />
      </SidebarMenu>
      <SidebarGroupLabel>Previews Chats</SidebarGroupLabel>
      <SidebarGroup>
        <MessageHistorys />
      </SidebarGroup>
    </SidebarGroup>
  );
}
