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
import { Subsidiary } from "@/lib/types";
import axios from "axios";
import { NEXT_PUBLIC_JAVA_URL } from "@/lib/environment";
import { MapPin } from "lucide-react";
import { Notification } from "./Notification";
import { clearNotification } from "@/lib/utils";
import { useSnapshot } from "valtio";
import { subsidiaryStore } from "@/lib/valtio";

export function SubsidiaryCombobox() {
  const snapSubsidiary = useSnapshot(subsidiaryStore);

  const [open, setOpen] = React.useState(false);

  const [subsidiaries, setSubsidiaries] = React.useState<Subsidiary[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [notification, setNotification] = React.useState<string | undefined>(
    undefined
  );

  React.useEffect(() => {
    async function fetchSubsidiaries() {
      setLoading(true);

      try {
        const response = await axios.get(
          `${NEXT_PUBLIC_JAVA_URL}/subsidiaries`
        );
        setSubsidiaries(response.data);
      } catch {
        setNotification("Não foi possível buscar as filiais");
      } finally {
        clearNotification<string | undefined>(setNotification, undefined);
        setLoading(false);
      }
    }

    fetchSubsidiaries();
  }, []);

  return (
    <div className="flex items-center space-x-4 relative">
      {notification && <Notification title="Ops!" message={notification} />}

      <p className="text-md text-base">Filial</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={loading}
            className="justify-start"
          >
            {snapSubsidiary.subsidiary ? (
              <>
                <MapPin className="h-4 w-4" /> {snapSubsidiary.subsidiary.name}
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4" /> Selecione a filial
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
                {subsidiaries.map((subsidiary) => (
                  <CommandItem
                    key={subsidiary.id}
                    value={subsidiary.name.toString()}
                    onSelect={(value) => {
                      subsidiaryStore.subsidiary = subsidiaries.find(priority => priority.name.toString() === value || undefined);
                      setOpen(false);
                    }}
                  >
                    {subsidiary.name}
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
