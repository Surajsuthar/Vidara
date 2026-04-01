"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

export type GenerateContext = {
  resource: string | null;
  setResource: (resource: string | null) => void;
};

const GenerateContextCtx = createContext<GenerateContext | null>(null);

export function GenerateContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [resource, setResource] = useState<string | null>(null);

  return (
    <GenerateContextCtx.Provider value={{ resource, setResource }}>
      {children}
    </GenerateContextCtx.Provider>
  );
}

export function useGenerateContext() {
  const context = useContext(GenerateContextCtx);
  if (!context) {
    throw new Error(
      "useGenerateContext must be used within a GenerateContextProvider",
    );
  }
  return context;
}
