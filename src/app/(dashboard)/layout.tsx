import type React from "react";
import { Suspense } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider
      className="bg-[#070707] text-white"
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      open={true}
    >
      <Suspense fallback={null}>
        <AppSidebar variant="inset" />
      </Suspense>
      <SidebarInset>
        <Suspense fallback={null}>
          <SiteHeader />
        </Suspense>
        <main className="min-h-[calc(100vh-var(--header-height))] bg-[#070707] p-3 text-white sm:p-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
