import * as React from "react";

import { Bike } from "@/lib/types";
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
import { clearNotification } from "@/lib/utils";
import { Notification } from "./Notification";
import { useSubsidiary } from "@/contexts/SubsidiaryContext";

export function BikeCard({ bike }: { bike: Bike }) {
  const { subsidiary, setSubsidiary } = useSubsidiary();

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

  // TODO: Locate bike on map
  async function locateBikeOnMap() {
    
    // 1. Check if bike.yard.subsidiary is the same on current map
    if (bike.subsidiary?.id != subsidiary?.id) {
      try {
        const response = await axios.get(`${NEXT_PUBLIC_JAVA_URL}/subsidiaries/${bike.subsidiary?.id}`);
        setSubsidiary(response.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.status == 404) {
          console.log(err.response?.data);
        }
      }
    }
    
    // 2. Check bike position and move camera there
    

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
          {(bike.tagCode && !isTagUnlinked) ? <p>Tag: {bike.tagCode}</p> : <p>Sem dados da tag</p>}
          {(bike.yard && bike.subsidiary && !isTagUnlinked) ? (
            <p className="flex items-center gap-4">
              <MapPin className="h-4 w-4" />
              <span>{bike.yard.name} - {bike.subsidiary.name}</span>
            </p>
          ) : (
            <p>Sem dados da localização</p>
          )}
        </CardContent>
        {((bike.yard || bike.tagCode) && !isTagUnlinked) && (
          <CardFooter>
            <div className="flex flex-col gap-4 w-full">
              {bike.yard && (
                <Button variant="secondary" onClick={locateBikeOnMap}>
                  <Locate className="h-4 w-4" /> Achar no Mapa
                </Button>
              )}

              {(bike.tagCode) && (
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
