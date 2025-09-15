import { Button } from "./ui/button";
import { Eraser, Undo } from "lucide-react";
import { areaCreationStore } from "@/lib/valtio";

export function AreaPointControl({
  disabled
}: {
  disabled: boolean
}) {  
  function rollbackLastPoint() {
    areaCreationStore.points = areaCreationStore.points.slice(0, -1);
  }

  function clearPoints() {
    areaCreationStore.points = [];
  }

  return (
    <>
      <Button disabled={disabled} variant="outline" onClick={clearPoints}><Eraser className="h-4 w-4"/> Limpar pontos</Button>
      <Button disabled={disabled} variant="outline" onClick={rollbackLastPoint}><Undo className="h-4 w-4"/> Voltar último ponto</Button>
    </>
  );
}