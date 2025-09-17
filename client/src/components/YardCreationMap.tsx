"use client";

import * as React from "react";

import { Point } from "@/lib/types";
import Konva from "konva";
import { Stage, Layer, Line, Circle, Text } from "react-konva";
import { Button } from "./ui/button";
import { YardDraw } from "./map/YardDraw";
import { SquarePlus } from "lucide-react";
import { MAP_COLORS, METERS_PER_PIXEL } from "@/lib/map";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { SubsidiaryCombobox } from "./SubsidiaryCombobox";
import { NEXT_PUBLIC_JAVA_URL } from "@/lib/environment";
import axios from "axios";
import { clearNotification } from "@/lib/utils";
import { useSnapshot } from "valtio";
import { subsidiaryStore } from "@/lib/valtio";
import { Notification } from "./Notification";
import { PointVisualization } from "./PointVisualization";
import { PointControl } from "./PointControl";

export function YardCreationMap() {
  const MAP_WIDTH = window.innerWidth;
  const MAP_HEIGHT = window.innerHeight / 2;

  const CLOSE_TO_SNAPPING = 8;

  const [notification, setNotification] = React.useState<string>("");
  const snapSubsidiary = useSnapshot(subsidiaryStore);

  const [yardName, setYardName] = React.useState<string>("");

  const stageRef = React.useRef<Konva.Stage>(null);
  const [points, setPoints] = React.useState<Point[]>([]);
  const [ruler, setRuler] = React.useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null>(null);
  const [rulerSnaping, setRulerSnaping] = React.useState<boolean>(false);

  function handleMouseMove() {
    const stage = stageRef.current;

    const mouse = stage?.getPointerPosition();
    if (!mouse) return;

    if (ruler) {
      setRuler(() => {
        if (
          Math.abs(ruler.x1 - ruler.x2) < CLOSE_TO_SNAPPING ||
          Math.abs(ruler.y1 - ruler.y2) < CLOSE_TO_SNAPPING
        ) {
          setRulerSnaping(true);
        } else {
          setRulerSnaping(false);
        }

        return { ...ruler, x2: mouse.x, y2: mouse.y };
      });
    }
  }

  React.useEffect(() => {
    const lastPoint = points[points.length - 1];
    if (!lastPoint) setRuler(null);
    setRuler((ruler) => {
      if (!ruler?.x2 || !ruler.y2) return null;
      return { x2: ruler.x2, y2: ruler.y2, x1: lastPoint.x, y1: lastPoint.y };
    });
  }, [points]);

  function addPoint() {
    const stage = stageRef.current;
    const mouse = stage?.getPointerPosition();

    if (!mouse) return;

    let x = mouse.x;
    let y = mouse.y;

    if (points.length > 0) {
      const last = points[points.length - 1];
      if (Math.abs(x - last.x) < CLOSE_TO_SNAPPING) {
        x = last.x;
      } else if (Math.abs(y - last.y) < CLOSE_TO_SNAPPING) {
        y = last.y;
      }
    }

    setRuler({ x1: x, y1: y, x2: mouse.x, y2: mouse.y });
    setPoints([...points, { x, y }]);
  }

  function getRulerDistance() {
    if (!ruler) return "";
    const dx = ruler.x2 - ruler.x1;
    const dy = ruler.y2 - ruler.y1;
    const pxLength = Math.sqrt(dx * dx + dy * dy);
    const meters = pxLength * METERS_PER_PIXEL;
    return meters.toFixed(2) + " m";
  }

  function handleResetPoints() {
    setPoints([]);
    setRuler(null);
  }

  function handleDeleteLastPoint() {
    setPoints((points) => points.slice(0, -1));

    const lastPoint = points[points.length - 2];
    if (ruler && lastPoint) {
      setRuler({ ...ruler, x1: lastPoint.x, y1: lastPoint.y });
    } else {
      setRuler(null);
    }
  }

  function normalizePoints(points: Point[]) {
    const xValues = points.flatMap((p) => p.x);
    const yValues = points.flatMap((p) => p.y);

    const leftMostX = Math.min(...xValues);
    const upMostY = Math.min(...yValues);

    return points.map((p) => ({ x: p.x - leftMostX, y: p.y - upMostY }));
  }

  async function handleYardCreation() {
    if (!snapSubsidiary.subsidiary) return;

    const newPoints = normalizePoints(points);

    const newYard = {
      name: yardName,
      boundary: newPoints,
      subsidiaryId: snapSubsidiary.subsidiary.id,
    };

    try {
      await axios.post(`${NEXT_PUBLIC_JAVA_URL}/yards`, newYard);
      setPoints([]);
      setYardName("");
      setNotification("Pátio foi salvo com sucesso");
    } catch {
      setNotification("Não foi possível salvar o pátio");
    } finally {
      clearNotification<string>(setNotification, "");
    }
  }

  return (
    <div className="space-y-4">
      {notification && <Notification title="Pátio" message={notification} />}

      <div className="flex items-center gap-4">
        <SubsidiaryCombobox />

        <div className="flex items-center gap-4">
          <Label htmlFor="yardName">Pátio</Label>
          <Input
            id="yardName"
            onChange={(e) => setYardName(e.target.value)}
            value={yardName}
          />
        </div>

        <PointControl reset={handleResetPoints} rollback={handleDeleteLastPoint} disabled={points.length < 1} />

        <Button
          disabled={yardName == "" || points.length < 3}
          onClick={handleYardCreation}
        >
          <SquarePlus />
          Criar pátio
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3 border-1 rounded-xl w-full p-2 shadow">
          <Stage
            ref={stageRef}
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            className="border-2 rounded-lg overflow-hidden bg-slate-100"
            onClick={addPoint}
            onMouseMove={handleMouseMove}
          >
            <Layer>
              {points.length > 1 && (
                <YardDraw
                  points={points.flatMap((p) => [p.x, p.y])}
                  yardName={yardName}
                />
              )}

              {points.map((point, idx) => {
                const isFirstOrLast = idx == 0 || idx == points.length - 1;

                return (
                  <>
                    <Circle
                      key={"circle" + idx}
                      x={point.x}
                      y={point.y}
                      radius={5}
                      strokeWidth={0.4}
                      stroke="#fff"
                      fill={isFirstOrLast ? "red" : "blue"}
                    />
                    <Text
                      key={"text" + idx}
                      x={point.x - 4}
                      y={point.y - 25}
                      text={(idx + 1).toString()}
                      fontSize={16}
                    />
                  </>
                );
              })}

              {ruler && (
                <>
                  <Line
                    points={[ruler.x1, ruler.y1, ruler.x2, ruler.y2]}
                    stroke={
                      rulerSnaping
                        ? MAP_COLORS.yard.creation.snapping
                        : MAP_COLORS.yard.creation.notSnapping
                    }
                    strokeWidth={2}
                    dash={[10, 5]}
                  />
                  <Text
                    x={(ruler.x1 + ruler.x2) / 2 + 10}
                    y={(ruler.y1 + ruler.y2) / 2 + 10}
                    text={getRulerDistance()}
                    fontSize={16}
                    fill={
                      rulerSnaping
                        ? MAP_COLORS.yard.creation.snapping
                        : MAP_COLORS.yard.creation.notSnapping
                    }
                  />
                </>
              )}
            </Layer>
          </Stage>
        </div>

        <div className="col-span-1">
          <PointVisualization points={points} setPoints={setPoints} />
        </div>
      </div>
    </div>
  );
}
