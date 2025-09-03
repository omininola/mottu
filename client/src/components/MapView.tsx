"use client";

import * as React from "react";

import { Apriltag, BikeSummary, SubsidiaryTags } from "@/lib/types";
import { Stage, Layer, Circle, Line, RegularPolygon } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva";
import { MapColors } from "@/lib/mapColors";

export function MapView({
  data,
  bike,
  setBikeSummary,
  apriltag,
  setTag,
}: {
  data: SubsidiaryTags | null;
  bike: BikeSummary | null;
  setBikeSummary: React.Dispatch<React.SetStateAction<BikeSummary | null>>;
  apriltag: Apriltag | null;
  setTag: React.Dispatch<React.SetStateAction<Apriltag | null>>;
}) {
  const MAP_WIDTH = window.innerWidth;
  const MAP_HEIGHT = window.innerHeight;
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

  function getAreaColor(status: string) {
    switch (status) {
      case "BROKEN":
        return MapColors.area.broken;
      case "READY":
        return MapColors.area.ready;
      default:
        return MapColors.area.default;
    }
  }

  // Pan & zoom state
  const [stageScale, setStageScale] = React.useState(1);
  const [stagePos, setStagePos] = React.useState({ x: 0, y: 0 });
  const isDragging = React.useRef(false);
  const lastPointerPos = React.useRef<{ x: number; y: number } | null>(null);

  const [isBikePinned, setBikePinned] = React.useState<boolean>(false);

  function handleMouseOverTagWithBike(tagBike: BikeSummary) {
    if (isBikePinned) return;
    setBikeSummary(tagBike);
  }

  function handleMouseDownTagWithBike(tagBike: BikeSummary) {
    if (isBikePinned && tagBike.id == bike?.id) {
      setBikePinned(false);
      setBikeSummary(null);
    } else {
      setBikePinned(true);
      setBikeSummary(tagBike);
    }
  }

  function handleMouseOutTagWithBike() {
    if (isBikePinned) return;
    setBikeSummary(null);
  }

  function handleMouseOverTagWithoutBike(tag: Apriltag) {
    console.log("[MAP_VIEW] Mouse over tag");
    setTag(tag);
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
      className="border-2 rounded-2xl overflow-hidden bg-slate-100"
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
    >
      <Layer>
        {data?.yards.map((yardMongo) => (
          <>
            <Line
              points={toKonvaPoints(yardMongo.yard.boundary)}
              closed={true}
              stroke="#6ee7b7"
              strokeWidth={2}
              fill="#a7f3d0"
            />

            {yardMongo.yard.areas.map((area) => {
              const colors = getAreaColor(area.status);

              return (
                <Line
                  key={area.id}
                  points={toKonvaPoints(area.boundary)}
                  closed={true}
                  stroke={colors.stroke}
                  strokeWidth={3}
                  fill={colors.fill}
                />
              );
            })}

            {yardMongo.tags.map((tag) => {
              const centeredTagPosition = {
                x: tag.position.x + CENTER_X,
                y: tag.position.y + CENTER_Y,
              };

              if (tag.bike != null) {
                const stroke = tag.inRightArea
                  ? MapColors.bike.inRightArea
                  : MapColors.bike.notInRightArea;

                return (
                  <React.Fragment key={tag.tag.id}>
                    <RegularPolygon
                      x={centeredTagPosition.x}
                      y={centeredTagPosition.y}
                      sides={3}
                      radius={5}
                      stroke={stroke}
                      strokeWidth={1}
                      lineJoin="round"
                      fill={
                        bike?.id == tag.bike.id
                          ? MapColors.bike.selected
                          : MapColors.bike.notSelected
                      }
                      onMouseOver={() =>
                        tag.bike && handleMouseOverTagWithBike(tag.bike)
                      }
                      onMouseDown={() =>
                        tag.bike && handleMouseDownTagWithBike(tag.bike)
                      }
                      onMouseOut={() => handleMouseOutTagWithBike()}
                    />
                  </React.Fragment>
                );
              } else {
                return (
                  <React.Fragment key={tag.tag.id}>
                    <Circle
                      x={centeredTagPosition.x}
                      y={centeredTagPosition.y}
                      radius={5}
                      fill={
                        apriltag?.id == tag.tag.id
                          ? MapColors.tag.selected
                          : MapColors.tag.notSelected
                      }
                      onMouseOver={() => handleMouseOverTagWithoutBike(tag.tag)}
                    />
                  </React.Fragment>
                );
              }
            })}
          </>
        ))}
      </Layer>
    </Stage>
  );
}
