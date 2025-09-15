"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MapPin } from "lucide-react";
import { useSnapshot } from "valtio";
import { areaCreationStore, subsidiaryStore } from "@/lib/valtio";
import { Yard } from "@/lib/types";

export function YardCombobox() {
  const snapSubsidiary = useSnapshot(subsidiaryStore);
  const snapAreaCreation = useSnapshot(areaCreationStore);

  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center space-x-4 relative">

      <p className="text-muted-foreground text-sm">Pátio</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="justify-start"
          >
            {snapAreaCreation.yard ? (
              <>
                <MapPin className="h-4 w-4" /> {snapAreaCreation.yard.name}
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4" /> Selecione o pátio
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder="Mudar o pátio..." />
            <CommandList>
              <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
              <CommandGroup>
                {snapSubsidiary.subsidiary?.yards.map((yard) => (
                  <CommandItem
                    key={yard.id}
                    value={yard.name.toString()}
                    onSelect={(value) => {
                      areaCreationStore.yard =
                        snapSubsidiary.subsidiary?.yards.find(
                          (priority) => priority.name.toString() == value
                        ) as Yard || undefined;
                      setOpen(false);
                    }}
                  >
                    {yard.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
