"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type * as React from "react";
import { ThemeProvider } from "../providers/theme-provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      staleTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      gcTime: 1000 * 60 * 30,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      structuralSharing: true,
      notifyOnChangeProps: ["data", "error", "isLoading"],
    },
  },
});

type RootProviderProps = {
  children: React.ReactNode;
};

export function RootProvider({ children }: RootProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
