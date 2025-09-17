"use client";

import * as React from "react";

import { YardCombobox } from "@/components/YardCombobox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubsidiaryCombobox } from "@/components/SubsidiaryCombobox";
import dynamic from "next/dynamic";
import { Point } from "@/lib/types";
import { PointControl } from "@/components/PointControl";

const CameraYardMap = dynamic(
  () => import("@/components/CameraYardMap").then((mod) => mod.CameraYardMap),
  { ssr: false }
);

const CameraTransformationMap = dynamic(
  () =>
    import("@/components/CameraTransformationMap").then(
      (mod) => mod.CameraTransformationMap
    ),
  { ssr: false }
);

export default function NewCamera() {
  const [transformPoints, setTransformPoints] = React.useState<Point[]>([]);
  const [videoSrc, setVideoSrc] = React.useState<string>("");

  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <div className="flex items-center gap-4">
        <SubsidiaryCombobox />
        <YardCombobox />

        <div className="flex items-center gap-4">
          <Label htmlFor="uriAccess">Camera URI</Label>
          <Input
            onChange={(e) => setVideoSrc(e.target.value)}
            value={videoSrc}
          />
        </div>

        <PointControl
          reset={() => setTransformPoints([])}
          rollback={() => setTransformPoints((points) => points.slice(0, -1))}
          disabled={transformPoints.length < 1}
        />
      </div>

      <div className="flex gap-4">
        <div className="w-2/3">
          {videoSrc && <video src={videoSrc} width={640} height={480} />}
          <CameraTransformationMap
            points={transformPoints}
            setPoints={setTransformPoints}
          />
        </div>

        <div className="w-1/3">
          <CameraYardMap />
        </div>
      </div>
    </div>
  );
}
