import { Layer, Stage } from "react-konva";
import { YardDraw } from "./map/YardDraw";
import React from "react";
import { useSnapshot } from "valtio";
import { areaCreationStore } from "@/lib/valtio";
import { toKonvaPoints } from "@/lib/utils";

export function CameraYardMap() {
  const MAP_WIDTH = window.innerWidth / 4;
  const MAP_HEIGHT = window.innerHeight / 3;

  const stageRef = React.useRef(null);
  const snapAreaCreation = useSnapshot(areaCreationStore);

  return (
    <div className="border-1 rounded-md w-full p-1 bg-slate-300">
      <Stage
        ref={stageRef}
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        className="border-2 rounded overflow-hidden bg-slate-100"
      >
        <Layer>
          {snapAreaCreation.yard != null && (
            <YardDraw
              points={toKonvaPoints(
                snapAreaCreation.yard.boundary.map((p) => ({
                  x: p.x,
                  y: p.y,
                })),
              )}
              yardName={snapAreaCreation.yard.name}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
