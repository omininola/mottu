"use client";

import * as React from "react";

import { Apriltag, Subsidiary } from "@/lib/types";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { NEXT_PUBLIC_JAVA_URL } from "@/lib/environment";
import axios from "axios";
import { clearNotification } from "@/lib/utils";
import { Notification } from "./Notification";

export function TagCard({
  tag,
  selectedSubsidiary,
}: {
  tag: Apriltag;
  selectedSubsidiary: Subsidiary | null;
}) {
  const [notification, setNotification] = React.useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  React.useState<Subsidiary | null>(null);
  const [plate, setPlate] = React.useState<string>("");

  async function linkTagToBike() {
    if (!selectedSubsidiary) return;

    setLoading(true);
    try {
      await axios.post(
        `${NEXT_PUBLIC_JAVA_URL}/bikes/${plate}/tag/${tag.code}/subsidiary/${selectedSubsidiary?.id}`
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
    <>
      {notification && <Notification title="Tag" message={notification} />}

      <Card>
        <CardHeader>
          <CardTitle>Tag: {tag.code}</CardTitle>
          <CardDescription>
            <p>Filial: {tag.subsidiary}</p>
            <p>A tag não está vinculada a nenhuma moto</p>
          </CardDescription>
          <CardFooter className="flex flex-col gap-4 w-full p-0">
            <div className="flex items-center gap-4 w-full">
              <Label htmlFor="plate">Placa</Label>
              <Input
                className="w-full"
                type="text"
                placeholder="123-ABC"
                id="plate"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
              />
            </div>

            <Button
              className="w-full"
              onClick={linkTagToBike}
              variant="secondary"
              disabled={plate == "" || loading || selectedSubsidiary == null}
            >
              Vincular tag
            </Button>
          </CardFooter>
        </CardHeader>
      </Card>
    </>
  );
}
