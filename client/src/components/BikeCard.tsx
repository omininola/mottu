import * as React from "react";

import { Bike, Point } from "@/lib/types";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Bike as BikeIcon,
  Blocks,
  LandPlot,
  Locate,
  MapPin,
  Tag,
  Trash,
  Unlink,
} from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { NEXT_PUBLIC_JAVA_URL } from "@/lib/environment";
import { clearNotification, toKonvaPoints } from "@/lib/utils";
import { Notification } from "./Notification";
import { useSnapshot } from "valtio";
import { stageStore, subsidiaryStore } from "@/lib/valtio";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";

export function BikeCard({
  bike,
  setBike,
}: {
  bike: Bike;
  setBike: () => void;
}) {
  const snapSubsidiary = useSnapshot(subsidiaryStore);

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
    const TARGET_SCALE = 16;

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
      [tag?.position] as Point[]
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
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center border-l-4 rounded-xs border-foreground pl-2">
            <BikeIcon className="mr-2" />
            <span>{bike.plate}</span>
          </CardTitle>
          <CardAction>
            <Button variant="ghost" onClick={setBike}>
              <Trash className="h-4 w-4" />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <CardInfoField icon={<LandPlot className="h-4 w-4" />} text="Status">
            {bike.status}
          </CardInfoField>
          <CardInfoField icon={<Blocks className="h-4 w-4" />} text="Modelo">
            {bike.model}
          </CardInfoField>
          <CardInfoField icon={<Tag className="h-4 w-4" />} text="Tag">
            {bike.tagCode?.toUpperCase() || "Não vinculada"}
          </CardInfoField>
          <CardInfoField
            icon={<MapPin className="h-4 w-4" />}
            text="Localização"
          >
            {bike.yard?.name
              .toUpperCase()
              .concat(" | ", bike.subsidiary?.name.toUpperCase() || "") ||
              "Sem informação"}
          </CardInfoField>
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

export function CardInfoField({
  icon,
  text,
  children,
}: {
  icon: React.ReactNode;
  text: string;
} & React.PropsWithChildren) {
  return (
    <Label>
      {icon}
      {text}
      <Badge variant="default">{children}</Badge>
    </Label>
  );
}
