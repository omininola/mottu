"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSnapshot } from "valtio";
import { areaCreationStore } from "@/lib/valtio";

const statuses = [
  { value: "BROKEN", label: "Quebrado" },
  { value: "READY", label: "Pronto" },
];

export function AreaDropdownMenu() {
  const snapAreaCreation = useSnapshot(areaCreationStore);

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Selecionar a área</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Status da nova área</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={snapAreaCreation.status} onValueChange={(value) => areaCreationStore.status = value}>
            {statuses.map((status) => (
              <DropdownMenuRadioItem key={status.value} value={status.value}>
                {status.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <p className="text-muted-foreground text-sm">{snapAreaCreation.status}</p>
    </div>
  );
}
