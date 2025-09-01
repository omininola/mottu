"use client";

import * as React from "react";

import { BikeSummary, YardMongo } from "@/lib/types";
import { Stage, Layer, Circle, Line } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva";

const MAP_WIDTH = (window.innerWidth * 3) / 4;
const MAP_HEIGHT = (window.innerHeight * 2) / 3;
const CENTER_X = MAP_WIDTH / 2;
const CENTER_Y = MAP_HEIGHT / 2;

function centerPoints(
  points: { x: number; y: number }[]
): { x: number; y: number }[] {
  return points.map((pt) => ({
    x: pt.x + CENTER_X,
    y: pt.y + CENTER_Y,
  }));
}

function toKonvaPoints(points: { x: number; y: number }[]): number[] {
  return centerPoints(points).flatMap((pt) => [pt.x, pt.y]);
}

export function MapView({
  data,
  bike,
  setBikeSummary,
}: {
  data: YardMongo | null;
  bike: BikeSummary | null;
  setBikeSummary: React.Dispatch<React.SetStateAction<BikeSummary | null>>;
}) {
  // Pan & zoom state
  const [stageScale, setStageScale] = React.useState(1);
  const [stagePos, setStagePos] = React.useState({ x: 0, y: 0 });
  const isDragging = React.useRef(false);
  const lastPointerPos = React.useRef<{ x: number; y: number } | null>(null);

  const [isBikePinned, setBikePinned] = React.useState<boolean>(false);

  function handleMouseOverTag(tagBike: BikeSummary) {
    if (isBikePinned) return;
    setBikeSummary(tagBike);
  }

  function handleMouseDownTag(tagBike: BikeSummary) {
    if (isBikePinned && tagBike.id == bike?.id) {
      setBikePinned(false);
      setBikeSummary(null);
    } else {
      setBikePinned(true);
      setBikeSummary(tagBike);
    }
  }

  function handleMouseOutTag() {
    if (isBikePinned) return;
    setBikeSummary(null);
  }

  // Drag to pan
  const handleMouseDown = (e: KonvaEventObject<PointerEvent>) => {
    isDragging.current = true;
    const stage = e.target.getStage() as Konva.Stage;
    lastPointerPos.current = stage.getStage().getPointerPosition();
  };

  const handleMouseMove = (e: KonvaEventObject<PointerEvent>) => {
    if (!isDragging.current) return;
    const stage = e.target.getStage() as Konva.Stage;
    const pointer = stage.getPointerPosition();
    if (pointer && lastPointerPos.current) {
      const dx = pointer.x - lastPointerPos.current.x;
      const dy = pointer.y - lastPointerPos.current.y;
      setStagePos((pos) => ({
        x: pos.x + dx,
        y: pos.y + dy,
      }));
      lastPointerPos.current = pointer;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    lastPointerPos.current = null;
  };

  // Wheel to zoom
  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = e.target.getStage() as Konva.Stage;
    const oldScale = stageScale;
    const pointer = stage.getStage().getPointerPosition();
    if (!pointer) return;

    // Calculate new scale
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    setStageScale(newScale);

    // Keep the pointer position stable during zoom
    const mousePointTo = {
      x: (pointer.x - stagePos.x) / oldScale,
      y: (pointer.y - stagePos.y) / oldScale,
    };
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    setStagePos(newPos);
  };

  return (
    <Stage
      width={MAP_WIDTH}
      height={MAP_HEIGHT}
      className="border-2 rounded-2xl overflow-hidden"
      scaleX={stageScale}
      scaleY={stageScale}
      x={stagePos.x}
      y={stagePos.y}
      draggable={false}
      onMouseDown={handleMouseDown}
      //onTouchStart={handleMouseDown}
      onMouseMove={handleMouseMove}
      //onTouchMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
      onWheel={handleWheel}
      style={{ background: "#222" }}
    >
      <Layer>
        {data?.yard.boundary && (
          <Line
            points={toKonvaPoints(data.yard.boundary)}
            closed={true}
            stroke="#417e3e"
            strokeWidth={4}
            fill="#417e3e22"
          />
        )}

        {data?.yard.areas.map((area) => (
          <Line
            key={area.id}
            points={toKonvaPoints(area.boundary)}
            closed={true}
            stroke="orange"
            strokeWidth={3}
            fill="#ffa50044"
          />
        ))}

        {data?.tags.map((tag) => {
          const centeredTagPosition = {
            x: tag.position.x + CENTER_X,
            y: tag.position.y + CENTER_Y,
          };

          return (
            <React.Fragment key={tag.tag.id}>
              <Circle
                x={centeredTagPosition.x}
                y={centeredTagPosition.y}
                radius={5}
                fill={bike?.id == tag.bike.id ? "limegreen" : "blue"}
                onMouseOver={() => handleMouseOverTag(tag.bike)}
                onMouseDown={() => handleMouseDownTag(tag.bike)}
                onMouseOut={() => handleMouseOutTag()}
              />
            </React.Fragment>
          );
        })}
      </Layer>
    </Stage>
  );
}
