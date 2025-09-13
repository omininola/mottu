import * as React from "react";

import { Bike, Point } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Binoculars, Locate, MapPin, Unlink } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { NEXT_PUBLIC_JAVA_URL } from "@/lib/environment";
import { clearNotification, toKonvaPoints } from "@/lib/utils";
import { Notification } from "./Notification";
import { useSnapshot } from "valtio";
import { stageStore, subsidiaryStore } from "@/lib/valtio";

export function BikeCard({ bike }: { bike: Bike }) {
  const snapSubsidiary = useSnapshot(subsidiaryStore);
  const snapStage = useSnapshot(stageStore);

  const [notification, setNotification] = React.useState<string | undefined>(
    undefined
  );

  const [isTagUnlinked, setTagUnlinked] = React.useState<boolean>(false);

  async function unlinkBikeFromTag() {
    try {
      axios.delete(`${NEXT_PUBLIC_JAVA_URL}/bikes/${bike.plate}/tag`);
      setTagUnlinked(true);
      setNotification("A moto foi desvinculada com sucesso!");
    } catch {
      setNotification("Não foi possível desvincular a moto da tag");
    } finally {
      clearNotification<string | undefined>(setNotification, undefined);
    }
  }

  async function locateBikeOnMap() {
    const TARGET_SCALE = 8;

    if (bike.subsidiary?.id != snapSubsidiary.subsidiary?.id) {
      try {
        const response = await axios.get(
          `${NEXT_PUBLIC_JAVA_URL}/subsidiaries/${bike.subsidiary?.id}`
        );
        const responseTags = await axios.get(
          `${NEXT_PUBLIC_JAVA_URL}/subsidiaries/${bike.subsidiary?.id}/tags`
        );

        Object.assign(subsidiaryStore, {
          subsidiary: response.data,
          subsidiaryTags: responseTags.data,
        });
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.status == 404) {
          console.log(err.response?.data);
        }
      }
    }

    const yardId = bike.yard?.id;
    const yard = subsidiaryStore.subsidiaryTags?.yards.find(
      (yardMongo) => yardMongo.yard.id == yardId
    );
    const tag = yard?.tags.find((tag) => tag.tag.code == bike.tagCode);
    const konvaPos = toKonvaPoints(
      [tag?.position] as Point[],
      snapStage.center
    );

    // IDK why this math works, but it works :D
    const actualPos = {
      x: konvaPos[0] * -1 * TARGET_SCALE + konvaPos[0],
      y: konvaPos[1] * -1 * TARGET_SCALE + konvaPos[1],
    };

    Object.assign(stageStore, {
      pos: actualPos,
      scale: TARGET_SCALE,
    });
  }

  return (
    <>
      {notification && (
        <Notification title="Vinculo de tags" message={notification} />
      )}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Binoculars className="mr-2" /> {bike.plate}
          </CardTitle>
          <CardDescription>Informações da moto pesquisada</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Chassi: {bike.chassis}</p>
          <p>Modelo: {bike.model}</p>
          <p>Status: {bike.status}</p>
          {bike.tagCode && !isTagUnlinked ? (
            <p>Tag: {bike.tagCode}</p>
          ) : (
            <p>Sem dados da tag</p>
          )}
          {bike.yard && bike.subsidiary && !isTagUnlinked ? (
            <p className="flex items-center gap-4">
              <MapPin className="h-4 w-4" />
              <span>
                {bike.yard.name} - {bike.subsidiary.name}
              </span>
            </p>
          ) : (
            <p>Sem dados da localização</p>
          )}
        </CardContent>
        {(bike.yard || bike.tagCode) && !isTagUnlinked && (
          <CardFooter>
            <div className="flex flex-col gap-4 w-full">
              {bike.yard && (
                <Button variant="secondary" onClick={locateBikeOnMap}>
                  <Locate className="h-4 w-4" /> Achar no Mapa
                </Button>
              )}

              {bike.tagCode && (
                <Button variant="outline" onClick={unlinkBikeFromTag}>
                  <Unlink className="h-4 w-4" /> Desvincular tag
                </Button>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    </>
  );
}

export function BikeCardEmpty() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pesquise uma moto!</CardTitle>
        <CardDescription>
          Todas as informações vão aparecer aqui.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
