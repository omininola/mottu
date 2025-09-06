import { useAreaCreating } from "@/contexts/AreaCreatingContext";
import { Button } from "./ui/button";
import { Eraser, Undo } from "lucide-react";

export function AreaPointControl() {
  const { setPoints } = useAreaCreating();
  
  function rollbackLastPoint() {
    setPoints(prev => prev.slice(0, -1));
  }

  function clearPoints() {
    setPoints([]);
  }

  return (
    <>
      <Button variant="outline" onClick={rollbackLastPoint}><Undo className="h-4 w-4"/> Voltar último ponto</Button>
      <Button variant="outline" onClick={clearPoints}><Eraser className="h-4 w-4"/> Limpar pontos</Button>
    </>
  );
}