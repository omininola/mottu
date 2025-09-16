import { stageStore } from "@/lib/valtio";
import { Button } from "./ui/button";

export function ResetMapButton() {
  function handleMapReset() {
    Object.assign(stageStore, {
      pos: { x: 0, y: 0 },
      scale: 1,
    });
  }

  return (
    <Button variant="secondary" onClick={handleMapReset}>
      Resetar mapa
    </Button>
  );
}
