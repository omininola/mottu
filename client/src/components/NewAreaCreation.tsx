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
import { useAreaCreating } from "@/contexts/AreaCreatingContext";
import { Check, PlusSquare, SquarePen } from "lucide-react";

export function NewAreaCreation() {
  const { yard, setYard } = useSelectedYard();
  const { status, setStatus, setPoints } = useAreaCreating();

  React.useEffect(() => {
    setStatus("");
    setPoints([]);
  }, [yard, setPoints, setStatus]) 

  function handleCancel() {
    setYard(null);
    setStatus("");
    setPoints([]);
  }

  return (
    <div className="flex items-center gap-4">
      {(yard && status) && <AreaPointControl />}

      <Dialog>
        <DialogTrigger asChild>
          {yard ? (
            <Button variant="default"><SquarePen className="h-4 w-4"/> Mudar status ou pátio</Button>
          ) : (
            <Button variant="default"><PlusSquare className="h-4 w-4" /> Criar nova área</Button>
          )}          
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Selecione um pátio para criar a nova área</DialogTitle>
            <DialogDescription>
              Clique no mapa dentro do pátio selecionado e depois clique para
              confirmar a criação!
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col my-4 gap-4">
            <YardCombobox />
            <AreaDropdownMenu />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="default"><Check className="h-4 w-4"/> Confirmar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
