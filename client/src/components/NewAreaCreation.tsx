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
import React from "react";
import { YardCombobox } from "./YardCombobox";
import { useSelectedYard } from "@/contexts/SelectedYardContext";
import { AreaPointControl } from "./AreaPointControl";

export function NewAreaCreation() {
  const { yard, setYard } = useSelectedYard();

  return (
    <div className="flex items-center gap-4">
      {yard && (
        <>
          <AreaPointControl />
          <AreaDropdownMenu />
        </>
      )}


      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">
            {yard ? "Mudar o pátio de criação" : "Criar uma nova área"}
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

          <div className="my-4">
            <YardCombobox />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setYard(null)}>
                Cancelar
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="secondary">Selecionar pátio</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
