"use client";

import { Notification } from "@/components/Notification";
import { SubsidiaryCombobox } from "@/components/SubsidiaryCombobox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NEXT_PUBLIC_JAVA_URL } from "@/lib/environment";
import { clearNotification } from "@/lib/utils";
import { subsidiaryStore } from "@/lib/valtio";
import axios from "axios";
import { Camera, ScanQrCode } from "lucide-react";
import Image from "next/image";
import React, { PropsWithChildren, useEffect } from "react";
import Webcam from "react-webcam";
import { useSnapshot } from "valtio";

export default function Tags() {
  const webcamRef = React.useRef<Webcam | null>(null);
  const [imageSrc, setImageSrc] = React.useState<string | undefined>(undefined);

  const snapSubsidiary = useSnapshot(subsidiaryStore);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [notification, setNotification] = React.useState<string | undefined>(
    undefined
  );

  const [tagCode, setTagCode] = React.useState<string | undefined>(undefined);
  const [plate, setPlate] = React.useState<string | undefined>(undefined);

  useEffect(() => {
    setTagCode(undefined);
  }, [imageSrc]);

  function capture() {
    if (webcamRef.current == null) return;
    const image = webcamRef.current.getScreenshot();
    if (image) setImageSrc(image);
  }

  async function detect() {
    if (!imageSrc) return;

    const response = await fetch(imageSrc);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append("file", blob, "tag.png");

    setLoading(true);
    try {
      const response = await axios.post(
        `${NEXT_PUBLIC_JAVA_URL}/apriltags/detect`,
        formData
      );
      setTagCode(response.data);
      setNotification("Tag retornada: " + JSON.stringify(response.data));
    } catch {
      setNotification("Falha ao tentar enviar imagem para o servidor");
    } finally {
      setLoading(false);
      clearNotification<string | undefined>(setNotification, undefined);
    }
  }

  async function linkTagToBike() {
    setLoading(true);
    try {
      await axios.post(
        `${NEXT_PUBLIC_JAVA_URL}/bikes/${plate}/tag/${tagCode}/subsidiary/${snapSubsidiary.subsidiary?.id}`
      );
      setNotification("Tag foi vinculada com sucesso!");
    } catch (err: unknown) {
      if (
        axios.isAxiosError(err) &&
        err.response &&
        (err.response.status === 400 || err.response.status === 404)
      ) {
        setNotification(err.response.data.message);
      } else setNotification("Não foi possível se comunicar com o servidor");
    } finally {
      setLoading(false);
      clearNotification<string | undefined>(setNotification, undefined);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {notification && <Notification title="Status" message={notification} />}

      <div className="flex items-center justify-center gap-4">
        <CardCapture
          title="Identificação de Tags"
          footerNode={
            <>
              <Camera className="h-4 w-4" /> Tirar foto
            </>
          }
          footerAction={capture}
        >
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            width={320}
            height={240}
            videoConstraints={{ facingMode: "environment" }}
          />
        </CardCapture>

        {imageSrc && (
          <CardCapture
            title="Foto tirada"
            footerNode={
              <>
                <ScanQrCode className="h-4 w-4" /> Resgatar o código da Tag
              </>
            }
            footerAction={detect}
            loading={loading}
          >
            <Image src={imageSrc} alt="Foto tirada" style={{ width: 320 }} />
          </CardCapture>
        )}
      </div>

      {tagCode && (
        <div className="flex items-center justify-center gap-4">
          <Label>Placa</Label>
          <Input
            type="text"
            placeholder="123-ABC"
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
          />

          <SubsidiaryCombobox />

          <Button
            onClick={linkTagToBike}
            disabled={loading || !snapSubsidiary.subsidiary || plate == ""}
          >
            Vincular {tagCode} com a moto
          </Button>
        </div>
      )}
    </div>
  );
}

function CardCapture({
  title,
  footerNode,
  footerAction,
  children,
  loading,
}: {
  title: string;
  footerNode: React.ReactNode;
  footerAction: () => void;
  loading?: boolean;
} & PropsWithChildren) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <Button variant="secondary" onClick={footerAction} disabled={loading}>
          {footerNode}
        </Button>
      </CardFooter>
    </Card>
  );
}
