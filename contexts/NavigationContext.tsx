"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface NavigationContextType {
  backButton: {
    show: boolean;
    label: string;
    onClick: () => void;
  } | null;
  setBackButton: (
    button: {
      show: boolean;
      label: string;
      onClick: () => void;
    } | null
  ) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [backButton, setBackButton] = useState<{
    show: boolean;
    label: string;
    onClick: () => void;
  } | null>(null);

  return (
    <NavigationContext.Provider value={{ backButton, setBackButton }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
