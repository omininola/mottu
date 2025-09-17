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
import * as React from "react";
import { YardCombobox } from "./YardCombobox";
import { Check, PlusSquare, SquarePen } from "lucide-react";
import { useSnapshot } from "valtio";
import { areaCreationStore, subsidiaryStore } from "@/lib/valtio";
import { clearNotification } from "@/lib/utils";
import axios from "axios";
import { NEXT_PUBLIC_JAVA_URL } from "@/lib/environment";
import { Notification } from "./Notification";
import { PointControl } from "./PointControl";

export function NewAreaCreation() {
  const snapSubsidiary = useSnapshot(subsidiaryStore);
  const snapAreaCreation = useSnapshot(areaCreationStore);

  const [notification, setNotification] = React.useState<string>("");

  function handleCancel() {
    areaCreationStore.isCreating = false;
    areaCreationStore.points = [];
    areaCreationStore.status = "READY";
  }

  async function handleFinishArea() {
    if (!snapAreaCreation.yard?.id || snapAreaCreation.points?.length < 3) {
      areaCreationStore.isCreating = false;
      setNotification("A área deve ter 3 ou mais pontos para ser criada");
      clearNotification<string>(setNotification, "");
      return;
    }

    const newArea = {
      status: snapAreaCreation.status,
      boundary: snapAreaCreation.points,
      yardId: snapAreaCreation.yard.id,
    };

    try {
      await axios.post(`${NEXT_PUBLIC_JAVA_URL}/areas`, newArea);
      areaCreationStore.isCreating = false;
      areaCreationStore.points = [];
      areaCreationStore.status = "READY";
    } catch {
      console.log("[MAIN] Error posting new area");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      {notification != "" && (
        <Notification title="Area" message={notification} />
      )}

      <Dialog>
        <DialogTrigger asChild>
          <Button
            disabled={snapSubsidiary.subsidiary == null}
            variant="secondary"
          >
            {snapAreaCreation.isCreating ? (
              <>
                <SquarePen className="h-4 w-4" /> Mudar informações
              </>
            ) : (
              <>
                <PlusSquare className="h-4 w-4" /> Criar nova área
              </>
            )}
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
              <Button
                variant="default"
                onClick={() => (areaCreationStore.isCreating = true)}
              >
                <Check className="h-4 w-4" />
                Confirmar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PointControl
        reset={() => (areaCreationStore.points = [])}
        rollback={() =>
          (areaCreationStore.points = areaCreationStore.points.slice(0, -1))
        }
        disabled={
          !snapAreaCreation.isCreating || snapAreaCreation.points.length == 0
        }
      />
      <Button
        disabled={snapAreaCreation.points.length < 3}
        variant="default"
        onClick={handleFinishArea}
      >
        <Check className="h-4 w-4" /> Confirmar
      </Button>
    </div>
  );
}
