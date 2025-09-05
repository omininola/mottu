"use client";

import * as React from "react";

import { Yard } from "@/lib/types";

type SelectedYardContextType = {
  yard: Yard | null;
  setYard: React.Dispatch<React.SetStateAction<Yard | null>>
}

const SelectedYardContext = React.createContext<SelectedYardContextType | undefined>(undefined);

export function SelectedYardProvider({ children }: React.PropsWithChildren) {
  const [yard, setYard] = React.useState<Yard | null>(null);

  return (
    <SelectedYardContext.Provider value={{ yard, setYard }}>
      {children}
    </SelectedYardContext.Provider>
  );
}

export function useSelectedYard() {
  const context = React.useContext(SelectedYardContext);
  if (!context) throw new Error("[CONTEXTS] useSelectedYard must be used within SelectedYardProvider");
  return context;
}
