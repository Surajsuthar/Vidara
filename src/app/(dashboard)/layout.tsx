import type React from "react";
import { DashboardProvider } from "@/components/providers/dashboard-provider";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={false} open={false}>
      <AppSidebar />
      <DashboardProvider>{children}</DashboardProvider>
    </SidebarProvider>
  );
}
