"use client";

import Notification from "@/components/Notification";
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
import axios from "axios";
import Image from "next/image";
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

export default function Tags() {
  const webcamRef = useRef<Webcam | null>(null);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [uploadStatus, setUploadStatus] = useState<string | undefined>(
    undefined
  );

  const [subsidiary, setSubsidiary] = React.useState<number>(1);
  const [tagCode, setTagCode] = React.useState<string | undefined>(undefined);
  const [plate, setPlate] = React.useState<string | undefined>(undefined);

  function capture() {
    if (webcamRef.current == null) return;
    const image = webcamRef.current.getScreenshot();
    if (image) setImageSrc(image);
  }

  async function upload() {
    if (!imageSrc) return;

    setUploadStatus("Uploading...");

    const response = await fetch(imageSrc);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append("file", blob, "tag.png");

    try {
      const response = await axios.post(
        `${NEXT_PUBLIC_JAVA_URL}/apriltags/detect`,
        formData
      );
      setTagCode(response.data);
      setUploadStatus(JSON.stringify(response.data));
    } catch {
      setUploadStatus("Falha ao tentar enviar imagem para o servidor");
    } finally {
      clearNotification<string | undefined>(setUploadStatus, undefined);
    }
  }

  async function linkTagToBike() {
    try {
      const response = await axios.post(`${NEXT_PUBLIC_JAVA_URL}/bikes/${plate}/tag/${tagCode}/subsidiary/${subsidiary}`);
      console.log(response.data);
    } catch {
      console.log("Bigodou")
    } finally {
      console.log("Finzalizou")
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {uploadStatus && <Notification title="Status" message={uploadStatus} />}

      <div className="flex items-center justify-center gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Identificação de Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/png"
              width={320}
              height={240}
              videoConstraints={{ facingMode: "environment" }}
            />
          </CardContent>
          <CardFooter>
            <Button variant="secondary" onClick={capture}>Tirar foto</Button>
          </CardFooter>
        </Card>

        {imageSrc && (
          <Card>
            <CardHeader>
              <CardTitle>Foto tirada</CardTitle>
            </CardHeader>
            <CardContent>
              <Image src={imageSrc} alt="Foto tirada" style={{ width: 320 }} />
            </CardContent>
            <CardFooter>
              <Button variant="secondary" onClick={upload}>Resgatar o código da Tag</Button>
            </CardFooter>
          </Card>
        )}
      </div>

      {tagCode && (
        <div className="flex items-center justify-center gap-4">
          <Label>Placa</Label>
          <Input type="text" placeholder="123-ABC" value={plate} onChange={(e) => setPlate(e.target.value)}/>
          <Button onClick={linkTagToBike}>Vincular {tagCode} com a moto</Button>
        </div>
      )}
    </div>
  );
}
