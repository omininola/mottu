import { Button } from "./ui/button";
import { Eraser, Undo } from "lucide-react";
import { areaCreationStore } from "@/lib/valtio";

export function AreaPointControl() {  
  function rollbackLastPoint() {
    areaCreationStore.points = areaCreationStore.points.slice(0, -1);
  }

  function clearPoints() {
    areaCreationStore.points = [];
  }

  return (
    <>
      <Button variant="outline" onClick={rollbackLastPoint}><Undo className="h-4 w-4"/> Voltar último ponto</Button>
      <Button variant="outline" onClick={clearPoints}><Eraser className="h-4 w-4"/> Limpar pontos</Button>
    </>
  );
}