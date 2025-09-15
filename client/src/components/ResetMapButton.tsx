import { stageStore } from "@/lib/valtio";
import { Button } from "./ui/button";

export function ResetMapButton() {
  return (
    <Button
      variant="secondary"
      onClick={() => {
        Object.assign(stageStore, {
          pos: { x: 0, y: 0 },
          scale: 1,
        });
      }}
    >
      Resetar mapa
    </Button>
  );
}
