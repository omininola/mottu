import { Button } from "./ui/button";
import { Eraser, Undo } from "lucide-react";
import { ButtonGroup, ButtonGroupSeparator } from "./ui/button-group";

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
    <ButtonGroup>
      <Button variant="outline" disabled={disabled} onClick={handleResetPoints}>
        <Eraser className="h-4 w-4" />
        Limpar pontos
      </Button>

      <ButtonGroupSeparator/>

      <Button
        variant="outline"
        disabled={disabled}
        onClick={handleRollbackLastPoint}
      >
        <Undo className="h-4 w-4" />
        Voltar ultimo ponto
      </Button>
    </ButtonGroup>
  );
}
