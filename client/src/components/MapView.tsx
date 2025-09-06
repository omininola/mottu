"use client";

import * as React from "react";

import { Apriltag, BikeSummary, Point, SubsidiaryTags } from "@/lib/types";
import { Stage, Layer, Circle } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva";
import { clearNotification, pointInPolygon } from "@/lib/utils";
import { useSelectedYard } from "@/contexts/SelectedYardContext";
import { useAreaCreating } from "@/contexts/AreaCreatingContext";
import { YardDraw } from "./map/YardDraw";
import { AreaDraw } from "./map/AreaDraw";
import { BikeDraw } from "./map/BikeDraw";
import { TagDraw } from "./map/TagDraw";
import { Notification } from "./Notification";

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
  const MAP_WIDTH = (window.innerWidth * 3) / 4;
  const MAP_HEIGHT = (window.innerHeight * 3) / 4;
  const CENTER_X = MAP_WIDTH / 2;
  const CENTER_Y = MAP_HEIGHT / 2;
  const OFFSET_X = 20;

  const { yard } = useSelectedYard();
  const { status, points, setPoints } = useAreaCreating();

  const [notification, setNotification] = React.useState<string>("");

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

  const isPointInsideYard = (point: Point, yardBoundary: Point[], yardOffset: number) => {
    return pointInPolygon(point, yardBoundary, yardOffset);
  };

  const handleMapClick = (e: KonvaEventObject<PointerEvent>) => {
    if (!yard || !yard?.id) return;
    const stage = e.target.getStage() as Konva.Stage;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mapX = (pointer.x - stagePos.x) / stageScale;
    const mapY = (pointer.y - stagePos.y) / stageScale;

    const clickPoint = { x: mapX - CENTER_X, y: mapY - CENTER_Y };

    let idxFound = 0;
    let xValuesPreviousYard: number[] = [];
    const yardMongoFound = data?.yards.find((y, idx) => {
      if (y.yard.id == yard.id) {
        idxFound = idx;
        if (data.yards[idx - 1] != null) xValuesPreviousYard = data.yards[idx - 1].yard.boundary.map(point => point.x);
        return true;
      }
      return false;
    });
    if (!yardMongoFound) return;

    let yardOffsetX = 0;
    if (xValuesPreviousYard.length != 0) {
      const rightMostPreviusYard = Math.max(...xValuesPreviousYard);
       yardOffsetX = rightMostPreviusYard + idxFound * OFFSET_X;
    }

    if (isPointInsideYard(clickPoint, yardMongoFound.yard.boundary, yardOffsetX)) {
      setPoints((prev: Point[]) => [...prev, clickPoint]);
    } else {
      setNotification("O ponto deve ser colocado dentro da área do pátio!");
      clearNotification<string>(setNotification, "");
    }
  };

  const [stageScale, setStageScale] = React.useState(1);
  const [stagePos, setStagePos] = React.useState({ x: 0, y: 0 });
  const isDragging = React.useRef(false);
  const lastPointerPos = React.useRef<{ x: number; y: number } | null>(null);

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
    <>
      {notification != "" && <Notification title="Nova área" message={notification} />}

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
              xValues = data.yards[idx - 1].yard.boundary.map((point) => point.x);
            }

            let rightMost = 0;
            if (xValues.length >= 1) rightMost = Math.max(...xValues);
            const yardOffsetX = rightMost + idx * OFFSET_X;

            return (
              <>
                <YardDraw
                  points={toKonvaPoints(yardMongo.yard.boundary, yardOffsetX)}
                  yardName={yardMongo.yard.name}
                />

                {yardMongo.yard.areas.map((area) => (
                  <AreaDraw
                    key={area.id}
                    status={area.status}
                    points={toKonvaPoints(area.boundary)}
                  />
                ))}

                {yard && points.length > 0 && (
                  <>
                    <AreaDraw status={status} points={toKonvaPoints(points)} />

                    {points.map((point, idx) => {
                      const pointKonva = toKonvaPoints([{ x: point.x, y: point.y }]);
                      const isFirstOrLast = idx == 0 || idx == points.length -1; 

                      return (
                        <Circle
                          key={point.x + point.y}
                          x={pointKonva[0]}
                          y={pointKonva[1]}
                          radius={2}
                          fill={isFirstOrLast ? "red" : "yellow"}
                        />
                      );
                    })}
                  </>
                )}

                {yardMongo.tags.map((tag) => {
                  const centerTagPos = {
                    x: tag.position.x + CENTER_X + yardOffsetX,
                    y: tag.position.y + CENTER_Y,
                  };

                  if (tag.bike != null) {
                    return (
                      <BikeDraw
                        key={tag.bike.id}
                        pos={{ x: centerTagPos.x, y: centerTagPos.y }}
                        isSelected={bike?.id == tag.bike.id}
                        inRightArea={tag.inRightArea}
                        bikeSummary={bike}
                        setBikeSummary={setBikeSummary}
                        bikeObj={tag.bike}
                      />
                    );
                  } else {
                    return (
                      <TagDraw
                        key={tag.tag.id}
                        pos={{ x: centerTagPos.x, y: centerTagPos.y }}
                        isSelected={apriltag?.id == tag.tag.id}
                        tag={tag.tag}
                        setTag={setTag}
                      />
                    );
                  }
                })}
              </>
            );
          })}
        </Layer>
      </Stage>
    </>
  );
}
