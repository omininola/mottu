import { Bike } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Binoculars, MapPin } from "lucide-react";

export default function BikeCard({ bike }: { bike: Bike }) {
  return (
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
        {bike.tagCode ? (
          <p>Tag: {bike.tagCode}</p>
        ) : (
          <p>Moto não está vinculada à uma tag</p>
        )}
      </CardContent>
      <CardFooter>
        {bike.yard ? (
          <p className="flex items-center gap-4">
            <MapPin className="h-4 w-4" /> {bike.yard.name} -{" "}
            {bike.yard.subsidiary}
          </p>
        ) : (
          <p>Moto não está vinculada a um pátio</p>
        )}
      </CardFooter>
    </Card>
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
