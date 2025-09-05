"use client";

import * as React from "react";

import { Point } from "@/lib/types";

type AreaCreatingContextType = {
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>
  points: Point[];
  setPoints: React.Dispatch<React.SetStateAction<Point[]>>
}

const AreaCreatingContext = React.createContext<AreaCreatingContextType | undefined>(undefined);

export function AreaCreatingProvider({ children }: React.PropsWithChildren) {
  const [status, setStatus] = React.useState<string>("");
  const [points, setPoints] = React.useState<Point[]>([]);

  return (
    <AreaCreatingContext.Provider value={{ status, setStatus, points, setPoints }}>
      {children}
    </AreaCreatingContext.Provider>
  );
}

export function useAreaCreating() {
  const context = React.useContext(AreaCreatingContext);
  if (!context) throw new Error("[CONTEXTS] useAreaCreating must be used within AreaCreatingProvider");
  return context;
}
