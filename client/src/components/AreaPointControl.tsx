import { useAreaCreating } from "@/contexts/AreaCreatingContext";
import { Button } from "./ui/button";

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
      <Button variant="outline" onClick={rollbackLastPoint}>Voltar último ponto</Button>
      <Button variant="outline" onClick={clearPoints}>Limpar pontos</Button>
    </>
  );
}