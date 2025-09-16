"use client";

import * as React from "react";

import { YardCombobox } from "@/components/YardCombobox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubsidiaryCombobox } from "@/components/SubsidiaryCombobox";
import dynamic from "next/dynamic";

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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          {videoSrc && <video src={videoSrc} width={640} height={480} />}
          <CameraTransformationMap />
        </div>

        <div className="col-span-1">
          <CameraYardMap />
        </div>
      </div>
    </div>
  );
}
