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

  function capture() {
    if (webcamRef.current == null) return;
    const image = webcamRef.current.getScreenshot();
    if (image) setImageSrc(image);
  }

  async function upload() {
    if (!imageSrc) return;

    setUploadStatus("Uploading...");

    const response = await fetch(imageSrc);

    console.log(response);

    const blob = await response.blob();

    console.log(blob);

    const formData = new FormData();
    formData.append("image", blob, "tag.png");

    console.log(formData);

    try {
      const response = await axios.post(
        `${NEXT_PUBLIC_JAVA_URL}/apriltag/detection`,
        formData
      );
      setUploadStatus(JSON.stringify(response.data));
    } catch {
      setUploadStatus("Falha ao tentar enviar imagem para o servidor");
    } finally {
      setUploadStatus("Operação finalizada");
      clearNotification<string | undefined>(setUploadStatus, undefined);
    }
  }

  return (
    <div>
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
            <Button onClick={capture}>Tirar foto</Button>
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
              <Button onClick={upload}>Resgatar o código da Tag</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
