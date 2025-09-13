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
  const MAP_WIDTH = (window.innerWidth * 3) / 4;
  const MAP_HEIGHT = (window.innerHeight * 3) / 4;
  const CENTER_X = MAP_WIDTH / 2;
  const CENTER_Y = MAP_HEIGHT / 2;
  const OFFSET_X = 20;
  
  stageStore.center = { x: CENTER_X, y: CENTER_Y };
  const snapSubsidiary = useSnapshot(subsidiaryStore);
  const snapAreaCreation = useSnapshot(areaCreationStore);

  const [notification, setNotification] = React.useState<string>("");

  const handleMapClick = (e: KonvaEventObject<PointerEvent>) => {
    if (!snapAreaCreation.yard || !snapAreaCreation.yard?.id) return;
    const stage = e.target.getStage() as Konva.Stage;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mapX = (pointer.x - snapStage.pos.x) / snapStage.scale;
    const mapY = (pointer.y - snapStage.pos.y) / snapStage.scale;

    const clickPoint = { x: mapX - CENTER_X, y: mapY - CENTER_Y };

    let idxFound = 0;
    let xValuesPreviousYard: number[] = [];
    const yardMongoFound = snapSubsidiary.subsidiaryTags?.yards.find(
      (y, idx) => {
        if (y.yard.id == snapAreaCreation.yard?.id) {
          idxFound = idx;
          if (snapSubsidiary.subsidiaryTags?.yards[idx - 1] != null)
            xValuesPreviousYard = snapSubsidiary.subsidiaryTags.yards[
              idx - 1
            ].yard.boundary.map((point) => point.x);
          return true;
        }
        return false;
      }
    );
    if (!yardMongoFound) return;

    let yardOffsetX = 0;
    if (xValuesPreviousYard.length != 0) {
      const rightMostPreviusYard = Math.max(...xValuesPreviousYard);
      yardOffsetX = rightMostPreviusYard + idxFound * OFFSET_X;
    }

    if (
      isPointInsideYard(
        clickPoint,
        yardMongoFound.yard.boundary as Point[],
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
      stageStore.pos = { x: snapStage.pos.x + dx, y: snapStage.pos.y + dy };
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
    const oldScale = snapStage.scale;
    const pointer = stage.getStage().getPointerPosition();
    if (!pointer) return;

    // Calculate new scale
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
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
  };

  return (
    <>
      {notification != "" && (
        <Notification title="Nova área" message={notification} />
      )}

      <Stage
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        className="border-2 rounded-2xl overflow-hidden bg-slate-100"
        scaleX={snapStage.scale}
        scaleY={snapStage.scale}
        x={snapStage.pos.x}
        y={snapStage.pos.y}
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
          {snapSubsidiary.subsidiaryTags?.yards &&
            snapSubsidiary.subsidiaryTags?.yards.length > 0 &&
            snapSubsidiary.subsidiaryTags?.yards.map((yardMongo, idx) => {
              let xValues: number[] = [];
              if (snapSubsidiary.subsidiaryTags?.yards[idx - 1] != null) {
                xValues = snapSubsidiary.subsidiaryTags.yards[
                  idx - 1
                ].yard.boundary.map((point) => point.x);
              }

              let rightMost = 0;
              if (xValues.length >= 1) rightMost = Math.max(...xValues);
              const yardOffsetX = rightMost + idx * OFFSET_X;

              return (
                <>
                  <YardDraw
                    key={"yard" + yardMongo.yard.id}
                    points={toKonvaPoints(
                      yardMongo.yard.boundary as Point[],
                      { x: CENTER_X, y: CENTER_Y },
                      yardOffsetX
                    )}
                    yardName={yardMongo.yard.name}
                  />

                  {yardMongo.yard.areas.map((area) => (
                    <AreaDraw
                      key={"area" + area.id}
                      status={area.status}
                      points={toKonvaPoints(area.boundary as Point[], {
                        x: CENTER_X,
                        y: CENTER_Y,
                      })}
                    />
                  ))}

                  {snapAreaCreation.yard &&
                    snapAreaCreation.points.length > 0 && (
                      <>
                        <AreaDraw
                          status={snapAreaCreation.status}
                          points={toKonvaPoints(
                            snapAreaCreation.points as Point[],
                            { x: CENTER_X, y: CENTER_Y }
                          )}
                        />

                        {snapAreaCreation.points.map((point, idx) => {
                          const pointKonva = toKonvaPoints(
                            [{ x: point.x, y: point.y }],
                            { x: CENTER_X, y: CENTER_Y }
                          );
                          const isFirstOrLast =
                            idx == 0 ||
                            idx == snapAreaCreation.points.length - 1;

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
                          key={"bike" + tag.bike.id}
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
                          key={"tag" + tag.tag.id}
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
