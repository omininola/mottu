"use client";

import * as React from "react";

import { Subsidiary } from "@/lib/types";

type SubsidiaryContextType = {
  subsidiary: Subsidiary | null;
  setSubsidiary: React.Dispatch<React.SetStateAction<Subsidiary | null>>;
}

const SubsidiaryContext = React.createContext<SubsidiaryContextType | undefined>(undefined);

export function SubsidiaryProvider({ children }: React.PropsWithChildren) {
  const [subsidiary, setSubsidiary] = React.useState<Subsidiary | null>(null);

  return (
    <SubsidiaryContext.Provider value={{ subsidiary, setSubsidiary }}>
      {children}
    </SubsidiaryContext.Provider>
  );
}

export function useSubsidiary() {
  const context = React.useContext(SubsidiaryContext);
  if (!context) throw new Error("[CONTEXTS] useSubsidiary must be used within SubsidiaryProvider");
  return context;
}
