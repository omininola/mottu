"use client";

import { MAP_COLORS } from "@/lib/map";
import { Point } from "@/lib/types";
import Konva from "konva";
import * as React from "react";

import { Circle, Layer, Line, Stage, Text } from "react-konva";
import Webcam from "react-webcam";

export function CameraTransformationMap({
  points,
  setPoints,
  setYardPoints
}: {
  points: Point[];
  setPoints: React.Dispatch<React.SetStateAction<Point[]>>;
  setYardPoints: React.Dispatch<React.SetStateAction<Point[]>>;
}) {
  const MAP_WIDTH = 640;
  const MAP_HEIGHT = 480;

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
    <div className="rounded-xl shadow relative">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/png"
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        className="rounded-lg"
        videoConstraints={{ facingMode: "environment" }}
      />

      <Stage
        ref={stageRef}
        className="absolute w-full h-full top-0 border-2 rounded-lg overflow-hidden bg-transparent"
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        onClick={addPoint}
      >
        <Layer>
          {points.length >= 2 && (
            <Line
              points={points.flatMap((p) => [p.x, p.y])}
              closed={true}
              stroke={MAP_COLORS.camera.stroke}
              strokeWidth={4}
              fill={MAP_COLORS.camera.fill}
              opacity={0.6}
              listening={false}
              lineJoin="round"
              lineCap="round"
            />
          )}

          {points.map((point, idx) => {
            const isFirstOrLast = idx == 0 || idx == points.length - 1;

            return (
              <>
                <Circle
                  key={idx}
                  x={point.x}
                  y={point.y}
                  radius={6}
                  fill={isFirstOrLast ? "red" : "blue"}
                />
                <Text
                  x={point.x - 6}
                  y={point.y - 30}
                  fontSize={16}
                  text={(idx + 1).toString()}
                />
              </>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}
