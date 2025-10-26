"use client";

import * as React from "react";

import { Apriltag, BikeSummary, Point } from "@/lib/types";
import { Stage, Layer, Circle } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva";
import {
  clearNotification,
  isPointInsideYard,
  toKonvaPoints,
} from "@/lib/utils";
import { YardDraw } from "./map/YardDraw";
import { AreaDraw } from "./map/AreaDraw";
import { BikeDraw } from "./map/BikeDraw";
import { TagDraw } from "./map/TagDraw";
import { Notification } from "./Notification";
import { useSnapshot } from "valtio";
import { areaCreationStore, stageStore, subsidiaryStore } from "@/lib/valtio";

export function MapView({
  bike,
  setBikeSummary,
  apriltag,
  setTag,
}: {
  bike: BikeSummary | null;
  setBikeSummary: React.Dispatch<React.SetStateAction<BikeSummary | null>>;
  apriltag: Apriltag | null;
  setTag: React.Dispatch<React.SetStateAction<Apriltag | null>>;
}) {
  const LG_BREAKPOINT = 1024; // Tailwind lg breakpoint
  const MAP_WIDTH =
    window.innerWidth <= LG_BREAKPOINT
      ? window.innerWidth
      : (window.innerWidth * 5) / 7;
  const MAP_HEIGHT = window.innerHeight / 2;
  const CENTER_X = MAP_WIDTH / 2;
  const CENTER_Y = MAP_HEIGHT / 2;
  const OFFSET_X = 20;

  stageStore.center = { x: CENTER_X, y: CENTER_Y };
  const snapSubsidiary = useSnapshot(subsidiaryStore);
  const snapAreaCreation = useSnapshot(areaCreationStore);

  const [notification, setNotification] = React.useState<string>("");

  const handleMapClick = (e: KonvaEventObject<PointerEvent>) => {
    if (!snapAreaCreation.isCreating) return;
    const stage = e.target.getStage() as Konva.Stage;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mapX = (pointer.x - snapStage.pos.x) / snapStage.scale;
    const mapY = (pointer.y - snapStage.pos.y) / snapStage.scale;

    const clickPoint = { x: mapX - CENTER_X, y: mapY - CENTER_Y };

    const idxFound =
      snapSubsidiary.subsidiaryTags?.yards.findIndex(
        (yardMongo) => yardMongo.yard.id == snapAreaCreation.yard?.id
      ) || 0;

    let yardOffsetX = 0;

    if (idxFound > 0) {
      const initialValue = 0;
      const stopSign = idxFound;

      const totalOffsetX = snapSubsidiary.subsidiaryTags?.yards.reduce(
        (acc, curr, idx) => {
          if (idx >= stopSign) return acc;

          const xValues = curr.yard.boundary.flatMap((yard) => yard.x);
          const rightMostValue = Math.max(...xValues);

          return acc + rightMostValue;
        },
        initialValue
      );

      yardOffsetX = (totalOffsetX || 0) + idxFound * OFFSET_X;
    }

    if (
      isPointInsideYard(
        clickPoint,
        snapSubsidiary.subsidiaryTags?.yards[idxFound].yard.boundary as Point[],
        yardOffsetX
      )
    ) {
      areaCreationStore.points.push(clickPoint);
    } else {
      setNotification("O ponto deve ser colocado dentro da área do pátio!");
      clearNotification<string>(setNotification, "");
    }
  };

  const snapStage = useSnapshot(stageStore);

  const stage = React.useRef<Konva.Stage>(null);
  const isDragging = React.useRef(false);
  const lastPointerPos = React.useRef<Point | null>(null);

  // Drag to pan
  function handleMouseDown() {
    isDragging.current = true;
    if (stage.current) {
      lastPointerPos.current = stage.current?.getPointerPosition();
    }
  }

  function handleMouseMove() {
    if (!isDragging.current) return;
    const pointer = stage.current?.getPointerPosition();
    if (pointer && lastPointerPos.current) {
      const dx = pointer.x - lastPointerPos.current.x;
      const dy = pointer.y - lastPointerPos.current.y;
      stageStore.pos = { x: snapStage.pos.x + dx, y: snapStage.pos.y + dy };
      lastPointerPos.current = pointer;
    }
  }

  function handleMouseUp() {
    isDragging.current = false;
    lastPointerPos.current = null;
  }

  // Wheel to zoom
  function handleWheel(e: KonvaEventObject<WheelEvent>) {
    const scaleBy = 1.1;
    const maxZoomOut = 1;
    const oldScale = snapStage.scale;

    const pointer = stage.current?.getPointerPosition();
    if (!pointer) return;

    // Calculate new scale
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    if (newScale < maxZoomOut) {
      stageStore.scale = maxZoomOut;
      return;
    }
    stageStore.scale = newScale;

    // Keep the pointer position stable during zoom
    const mousePointTo = {
      x: (pointer.x - snapStage.pos.x) / oldScale,
      y: (pointer.y - snapStage.pos.y) / oldScale,
    };
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    stageStore.pos = newPos;
  }

  return (
    <>
      {notification && (
        <Notification title="Nova área" message={notification} />
      )}

      <Stage
        ref={stage}
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        className="border-2 rounded-lg overflow-hidden bg-accent"
        scaleX={snapStage.scale}
        scaleY={snapStage.scale}
        x={snapStage.pos.x}
        y={snapStage.pos.y}
        draggable={false}
        onClick={handleMapClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
        onWheel={handleWheel}
      >
        <Layer>
          {snapSubsidiary.subsidiaryTags?.yards &&
            snapSubsidiary.subsidiaryTags?.yards.length > 0 &&
            snapSubsidiary.subsidiaryTags?.yards.map((yardMongo, idx) => {
              const initialValue = 0;
              const stopSign = idx;
              const totalOffsetX = snapSubsidiary.subsidiaryTags?.yards.reduce(
                (acc, curr, idx) => {
                  if (idx >= stopSign) return acc;

                  const xValues = curr.yard.boundary.flatMap((yard) => yard.x);
                  const rightMostValue = Math.max(...xValues);

                  return acc + rightMostValue;
                },
                initialValue
              );

              const yardOffsetX = (totalOffsetX || 0) + idx * OFFSET_X;

              return (
                <>
                  <YardDraw
                    key={"yard" + yardMongo.yard.id}
                    points={toKonvaPoints(
                      yardMongo.yard.boundary as Point[],
                      yardOffsetX
                    )}
                    yardName={yardMongo.yard.name}
                  />

                  {yardMongo.yard.areas.map((area) => (
                    <AreaDraw
                      key={"area" + area.id}
                      status={area.status}
                      points={toKonvaPoints(area.boundary as Point[])}
                    />
                  ))}

                  {snapAreaCreation.yard &&
                    snapAreaCreation.points.length > 0 && (
                      <>
                        <AreaDraw
                          status={snapAreaCreation.status}
                          points={toKonvaPoints(
                            snapAreaCreation.points as Point[])}
                        />

                        {snapAreaCreation.points.map((point, idx) => {
                          const pointKonva = toKonvaPoints(
                            [{ x: point.x, y: point.y }],
                          );
                          const isFirstOrLast =
                            idx == 0 ||
                            idx == snapAreaCreation.points.length - 1;

                          return (
                            <Circle
                              key={idx}
                              x={pointKonva[0]}
                              y={pointKonva[1]}
                              radius={0.8}
                              strokeWidth={0.4}
                              stroke="#fff"
                              fill={isFirstOrLast ? "red" : "yellow"}
                            />
                          );
                        })}
                      </>
                    )}
                  {yardMongo.tags.map((tag) => {
                    const pointKonva = toKonvaPoints(
                      [{ x: tag.position.x, y: tag.position.y }],
                    );

                    const pos: Point = { x: pointKonva[0], y: pointKonva[1] };

                    if (tag.bike != null) {
                      return (
                        <BikeDraw
                          key={"bike" + tag.bike.id}
                          pos={pos}
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
                          key={"tag" + tag.tag.id}
                          pos={pos}
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
