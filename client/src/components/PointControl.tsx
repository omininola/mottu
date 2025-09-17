import { Button } from "./ui/button";
import { Eraser, Undo } from "lucide-react";

export function PointControl({
  reset,
  rollback,
  disabled,
}: {
  reset: () => void;
  rollback: () => void;
  disabled: boolean;
}) {
  function handleResetPoints() {
    reset();
  }

  function handleRollbackLastPoint() {
    rollback();
  }

  return (
    <>
      <Button variant="outline" disabled={disabled} onClick={handleResetPoints}>
        <Eraser className="h-4 w-4" />
        Limpar pontos
      </Button>
      <Button
        variant="outline"
        disabled={disabled}
        onClick={handleRollbackLastPoint}
      >
        <Undo className="h-4 w-4" />
        Voltar ultimo ponto
      </Button>
    </>
  );
}
