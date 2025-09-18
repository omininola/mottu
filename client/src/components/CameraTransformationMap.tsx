"use client";

import { MAP_COLORS } from "@/lib/map";
import { Point } from "@/lib/types";
import Konva from "konva";
import * as React from "react";

import { Circle, Layer, Line, Stage } from "react-konva";
import Webcam from "react-webcam";
import { PointVisualization } from "./PointVisualization";

export function CameraTransformationMap({
  points,
  setPoints,
  setYardPoints
}: {
  points: Point[];
  setPoints: React.Dispatch<React.SetStateAction<Point[]>>;
  setYardPoints: React.Dispatch<React.SetStateAction<Point[]>>;
}) {
  const webcamRef = React.useRef(null);
  const stageRef = React.useRef<Konva.Stage>(null);

  function addPoint() {
    const stage = stageRef.current;
    const mouse = stage?.getPointerPosition();

    if (!mouse) return;

    setPoints([...points, { x: mouse.x, y: mouse.y }]);
    setYardPoints(points => [...points, { x: 0, y: 0 }]);
  }

  return (
    <div className="grid grid-cols-2 gap-4 rounded-xl w-full shadow relative">
      <div className="col-span-1">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/png"
          width={640}
          height={480}
          className="rounded-lg"
          videoConstraints={{ facingMode: "environment" }}
        />

        <Stage
          ref={stageRef}
          className="absolute w-full h-full top-0 border-2 rounded-lg overflow-hidden opacity-60"
          width={640}
          height={480}
          onClick={addPoint}
        >
          <Layer>
            {points.map((point, idx) => {
              const isFirstOrLast = idx == 0 || idx == points.length - 1;

              return (
                <Circle
                  key={idx}
                  x={point.x}
                  y={point.y}
                  radius={5}
                  strokeWidth={0.4}
                  stroke="#fff"
                  fill={isFirstOrLast ? "red" : "yellow"}
                />
              );
            })}

            {points.length >= 2 && (
              <Line
                points={points.flatMap((p) => [p.x, p.y])}
                closed={true}
                stroke={MAP_COLORS.yard.creation.snapping}
                strokeWidth={1}
                dash={[1]}
                fill={MAP_COLORS.yard.creation.notSnapping}
                opacity={0.6}
                listening={false}
                lineJoin="round"
                lineCap="round"
              />
            )}
          </Layer>
        </Stage>
      </div>

      <div className="col-span-1">
        <PointVisualization
          points={points}
          setPoints={setPoints}
          setYardPoints={setYardPoints}
          transformCamera
        />
      </div>
    </div>
  );
}
