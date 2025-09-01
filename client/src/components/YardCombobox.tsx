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
import { Yard, YardMongo } from "@/lib/types";
import axios from "axios";
import { NEXT_PUBLIC_JAVA_URL } from "@/lib/environment";
import { MapPin } from "lucide-react";
import { Notification } from "./Notification";
import { clearNotification } from "@/lib/utils";

export function YardCombobox({
  setData,
}: {
  setData: React.Dispatch<React.SetStateAction<YardMongo | null>>;
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedYard, setSelectedYard] = React.useState<Yard | null>(null);

  const [yards, setYards] = React.useState<Yard[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [notification, setNotification] = React.useState<string | undefined>(
    undefined
  );

  React.useEffect(() => {
    async function fetchYards() {
      setLoading(true);

      try {
        const response = await axios.get(`${NEXT_PUBLIC_JAVA_URL}/yards`);
        setYards(response.data);
      } catch {
        setNotification("Não foi possível buscar os pátios");
      } finally {
        clearNotification<string | undefined>(setNotification, undefined);
        setLoading(false);
      }
    }

    fetchYards();
  }, []);

  React.useEffect(() => {
    async function fetchYardMongos() {
      if (!selectedYard) return;

      console.log("[YARD] Fetching tag data");

      try {
        const response = await axios.get(
          `${NEXT_PUBLIC_JAVA_URL}/yards/${selectedYard?.id}/tags`
        );
        setData(response.data);
      } catch {
        setNotification(
          "Não foi possível buscar as Tags do pátio: " + selectedYard?.name
        );
      } finally {
        clearNotification<string | undefined>(setNotification, undefined);
      }
    }

    const timer = setInterval(() => {
      fetchYardMongos();
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [setData, selectedYard]);

  return (
    <div className="flex items-center space-x-4 relative">
      {notification && <Notification title="Ops!" message={notification} />}

      <p className="text-muted-foreground text-sm">Pátio</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={loading}
            className="justify-start"
          >
            {selectedYard ? (
              <>
                <MapPin className="h-4 w-4" /> {selectedYard.name}
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
                {yards.map((yard) => (
                  <CommandItem
                    key={yard.id}
                    value={yard.name.toString()}
                    onSelect={(value) => {
                      setSelectedYard(
                        yards.find(
                          (priority) => priority.name.toString() === value
                        ) || null
                      );
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
