"use client";

import * as React from "react";

import {
  Apriltag,
  BikeSummary,
  Point,
  SubsidiaryTags,
  Yard,
} from "@/lib/types";
import { Stage, Layer, Circle, Line, RegularPolygon } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva";
import { MapColors } from "@/lib/mapColors";
import { pointInPolygon } from "@/lib/utils";

export function MapView({
  data,
  bike,
  setBikeSummary,
  apriltag,
  setTag,
  selectedYard,
  setNewAreaPoints,
  newAreaPoints,
}: {
  data: SubsidiaryTags | null;
  bike: BikeSummary | null;
  setBikeSummary: React.Dispatch<React.SetStateAction<BikeSummary | null>>;
  apriltag: Apriltag | null;
  setTag: React.Dispatch<React.SetStateAction<Apriltag | null>>;
  selectedYard: Yard | null;
  setNewAreaPoints: React.Dispatch<React.SetStateAction<Point[]>>;
  newAreaPoints: Point[];
}) {
  const MAP_WIDTH = window.innerWidth;
  const MAP_HEIGHT = window.innerHeight;
  const CENTER_X = MAP_WIDTH / 2;
  const CENTER_Y = MAP_HEIGHT / 2;
  const OFFSET_X = 20;

  function centerPoints(
    points: { x: number; y: number }[]
  ): { x: number; y: number }[] {
    return points.map((pt) => ({
      x: pt.x + CENTER_X,
      y: pt.y + CENTER_Y,
    }));
  }

  function toKonvaPoints(points: Point[], offsetX?: number): number[] {
    return centerPoints(points).flatMap((pt) => [pt.x + (offsetX || 0), pt.y]);
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

  // Helper to check if point is inside yard
  const isPointInsideYard = (point: Point, yardBoundary: Point[]) => {
    return pointInPolygon(point, yardBoundary);
  };

  // Handler: click map to add point
  const handleMapClick = (e: KonvaEventObject<PointerEvent>) => {
    if (!selectedYard || !selectedYard?.id) return;
    const stage = e.target.getStage() as Konva.Stage;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    // Correct for pan and zoom:
    const mapX = (pointer.x - stagePos.x) / stageScale;
    const mapY = (pointer.y - stagePos.y) / stageScale;

    // Convert back from centered coords if needed (depends on your yard system)
    const clickPoint = { x: mapX - CENTER_X, y: mapY - CENTER_Y };

    // Find the selected yard
    const yard = data?.yards.find((y) => y.yard.id === selectedYard.id);
    if (!yard) return;

    if (isPointInsideYard(clickPoint, yard.yard.boundary)) {
      setNewAreaPoints((prev) => [...prev, clickPoint]);
    } else {
      // Optionally, warn the user
      alert("Point not inside yard boundary!");
    }
  };

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
      onClick={handleMapClick}
      onMouseDown={handleMouseDown}
      //onTouchStart={handleMouseDown}
      onMouseMove={handleMouseMove}
      //onTouchMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
      onWheel={handleWheel}
    >
      <Layer>
        {data?.yards.map((yardMongo, idx) => {
          
          let xValues: number[] = [];
          if (data.yards[idx - 1] != null) {
            xValues = data.yards[idx - 1].yard.boundary.map(point => point.x);
          }

          let rightMostX = 0;
          if (xValues.length >= 1) rightMostX = Math.max(...xValues);
          const yard_offset_x = rightMostX + (idx * OFFSET_X);

          console.log(`[MAP_VIEW] Found: yardId = ${idx} | offsetX = ${yard_offset_x}`);

          return (
          <>
            <Line
              points={toKonvaPoints(yardMongo.yard.boundary, yard_offset_x)}
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
                  points={toKonvaPoints(area.boundary, yard_offset_x)}
                  closed={true}
                  stroke={colors.stroke}
                  strokeWidth={3}
                  fill={colors.fill}
                />
              );
            })}

            {selectedYard && newAreaPoints.length > 0 && (
              <Line
                points={toKonvaPoints(newAreaPoints)}
                closed={true}
                stroke="#f59e42"
                strokeWidth={2}
                fill="#fbbf24aa"
              />
            )}

            {yardMongo.tags.map((tag) => {
              const centeredTagPosition = {
                x: tag.position.x + CENTER_X + yard_offset_x,
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
        )})}
      </Layer>
    </Stage>
  );
}
