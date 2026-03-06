import type React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <main className="p-2">{children}</main>;
}
