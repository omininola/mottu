"use client";

import * as React from "react";

import { YardCombobox } from "@/components/YardCombobox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubsidiaryCombobox } from "@/components/SubsidiaryCombobox";
import dynamic from "next/dynamic";
import { Point } from "@/lib/types";
import { PointControl } from "@/components/PointControl";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, SquarePlus } from "lucide-react";
import axios from "axios";
import { NEXT_PUBLIC_JAVA_URL } from "@/lib/environment";
import { useSnapshot } from "valtio";
import { areaCreationStore } from "@/lib/valtio";
import { clearNotification } from "@/lib/utils";
import { Notification } from "@/components/Notification";
import { PointVisualization } from "@/components/PointVisualization";

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
  const snapAreaCreation = useSnapshot(areaCreationStore);

  const [transformPoints, setTransformPoints] = React.useState<Point[]>([]);
  const [yardPoints, setYardPoints] = React.useState<Point[]>([]);
  const [videoSrc, setVideoSrc] = React.useState<string>("");

  const [isYardShowing, setYardShowing] = React.useState<boolean>(false);

  const [notification, setNotification] = React.useState<string>("");

  const isDataOk =
    transformPoints.length >= 4 &&
    yardPoints.filter(point => point.x == 0 && point.y == 0).length < 2 &&
    videoSrc;

  async function handleCameraCreation() {
    const yard = snapAreaCreation.yard;
    if (!isDataOk || !yard) return;

    const newCamera = {
      yardId: yard.id,
      uriAccess: videoSrc,
      transformPoints,
      yardPoints
    }

    try {
      await axios.post(`${NEXT_PUBLIC_JAVA_URL}/cameras`, newCamera);
      setNotification("Câmera adicionada com sucesso!")
    } catch {
      setNotification("Erro ao tentar cadastrar nova câmera")
    } finally {
      clearNotification<string>(setNotification, "");
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      {notification && <Notification title="Câmera" message={notification} />}

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <SubsidiaryCombobox />
          <YardCombobox />

          <Button variant="secondary" onClick={() => setYardShowing(isYardShowing => !isYardShowing)}>
            {isYardShowing ? (
              <>
                <EyeOff />
                Esconder
              </>
            ) : (
              <>
                <Eye />
                Mostrar
              </>
            )} pátio
          </Button>
        </div>

        <div className="flex items-center gap-4">
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

          <Button
            onClick={handleCameraCreation}
            disabled={!isDataOk}
          >
            <SquarePlus />Cadastrar câmera
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-start md:flex-row gap-4">
        <div className="w-full md:w-1/2 relative">
          {/* {videoSrc && <video src={videoSrc} width={640} height={480} />} */}
          <CameraTransformationMap
            points={transformPoints}
            setPoints={setTransformPoints}
            setYardPoints={setYardPoints}
          />

          {isYardShowing && (
            <div className="absolute top-0 right-0 z-10 w-[300px]">
              <CameraYardMap />
            </div>
          )}
        </div>

        <div className="w-full gap-4">
          <PointVisualization
            points={transformPoints}
            setPoints={setTransformPoints}
            setYardPoints={setYardPoints}
            transformCamera
          />
        </div>
      </div>
    </div>
  );
}
