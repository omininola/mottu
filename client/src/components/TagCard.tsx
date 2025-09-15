"use client";

import * as React from "react";

import { Apriltag, Subsidiary } from "@/lib/types";
import {
  Card,
  CardContent,
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
import { Link, MapPin, Tag } from "lucide-react";
import { useSnapshot } from "valtio";
import { subsidiaryStore } from "@/lib/valtio";
import { CardInfoField } from "./BikeCard";

export function TagCard({
  tag,
  setTag,
}: {
  tag: Apriltag;
  setTag: React.Dispatch<React.SetStateAction<Apriltag | null>>;
}) {
  const snapSubsidiary = useSnapshot(subsidiaryStore);

  const [notification, setNotification] = React.useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  React.useState<Subsidiary | null>(null);
  const [plate, setPlate] = React.useState<string>("");

  async function linkTagToBike() {
    if (!snapSubsidiary.subsidiary) return;

    setLoading(true);
    try {
      await axios.post(
        `${NEXT_PUBLIC_JAVA_URL}/bikes/${plate}/tag/${tag.code}/subsidiary/${snapSubsidiary.subsidiary?.id}`
      );
      setTag(null);
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
          <CardTitle className="flex items-center border-l-4 rounded-xs border-foreground pl-2">
            <Tag className="mr-2" />
            <span>{tag.code.toUpperCase()}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardInfoField icon={<MapPin className="h-4 w-4" />} text="Filial">
            {tag.subsidiary}
          </CardInfoField>
          <p>Essa tag não está vinculada a nenhuma moto!</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 my-4">
          <form action="#" className="flex flex-col gap-4 w-full">
            <div className="flex items-center gap-4">
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
              type="submit"
              className="w-full"
              onClick={linkTagToBike}
              variant="secondary"
              disabled={
                plate == "" || loading || snapSubsidiary.subsidiary == null
              }
            >
              <Link className="h-4 w-4" /> Vincular tag
            </Button>
          </form>
        </CardFooter>
      </Card>
    </>
  );
}
