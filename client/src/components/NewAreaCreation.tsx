import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AreaDropdownMenu } from "./AreaDropdownMenu";
import { Yard } from "@/lib/types";
import React from "react";
import { YardCombobox } from "./YardCombobox";

export function NewAreaCreation({
  selectedYard,
  setSelectedYard,
  newAreaStatus,
  setNewAreaStatus,
}: {
  selectedYard: Yard | null;
  setSelectedYard: React.Dispatch<React.SetStateAction<Yard | null>>;
  newAreaStatus: string;
  setNewAreaStatus: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="flex items-center gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            {selectedYard ? "Criando" : "Criar"} uma nova área
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Selecione um pátio para criar a nova área</DialogTitle>
            <DialogDescription>
              Clique no mapa dentro do pátio selecionado e depois clique para
              confirmar a criação!
            </DialogDescription>
          </DialogHeader>

          <YardCombobox
            selectedYard={selectedYard}
            setSelectedYard={setSelectedYard}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setSelectedYard(null)}>
                Cancelar
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="secondary">Selecionar pátio</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedYard && (
        <AreaDropdownMenu status={newAreaStatus} setStatus={setNewAreaStatus} />
      )}
    </div>
  );
}
