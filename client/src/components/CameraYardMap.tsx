import { Layer, Stage } from "react-konva";
import { YardDraw } from "./map/YardDraw";
import React from "react";
import { useSnapshot } from "valtio";
import { areaCreationStore } from "@/lib/valtio";
import { toKonvaPoints } from "@/lib/utils";

export function CameraYardMap() {
  const MAP_WIDTH = window.innerWidth;
  const MAP_HEIGHT = window.innerHeight / 2;
  const CENTER_X = MAP_WIDTH / 2;
  const CENTER_Y = MAP_HEIGHT / 2;

  const stageRef = React.useRef(null);
  const snapAreaCreation = useSnapshot(areaCreationStore);

  return (
    <div className="border-1 rounded-xl w-full p-2 shadow">
      <Stage
        ref={stageRef}
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        className="border-2 rounded-lg overflow-hidden bg-slate-100"
      >
        <Layer>
          {snapAreaCreation.yard != null && (
            <YardDraw
              points={toKonvaPoints(
                snapAreaCreation.yard.boundary.map((p) => ({
                  x: p.x,
                  y: p.y,
                })),
                { x: CENTER_X, y: CENTER_Y }
              )}
              yardName={snapAreaCreation.yard.name}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
