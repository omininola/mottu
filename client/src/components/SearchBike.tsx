"use client";

import { LoaderIcon, Search } from "lucide-react";
import Notification from "./Notification";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import BikeCard, { BikeCardEmpty } from "./BikeCard";
import React from "react";
import axios from "axios";
import { NEXT_PUBLIC_JAVA_URL } from "@/lib/environment";
import { Bike } from "@/lib/types";

export default function SearchBike() {
  const [searchText, setSearchText] = React.useState<string>("");
  const [bikeSearched, setBikeSearched] = React.useState<Bike | undefined>(
    undefined
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>(undefined);

  async function searchBike() {
    setLoading(true);

    const plate = searchText;

    try {
      const response = await axios.get(
        `${NEXT_PUBLIC_JAVA_URL}/bikes/plate/${plate}`
      );
      setBikeSearched(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response && err.response.status === 404) {
        setError(err.response.data.message);
      } else setError("Não foi possível se comunicar com o servidor");
    } finally {
      setTimeout(() => {
        setError(undefined);
      }, 3000);

      setLoading(false);
    }
  }

  return (
    <>
      {error && <Notification title="Ops!" message={error} />}

      <div className="flex gap-4">
        <Label htmlFor="plate">Placa</Label>
        <Input
          type="text"
          name="plate"
          id="plate"
          placeholder="123-ABC"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <Button type="button" disabled={loading} onClick={searchBike}>
          {loading ? (
            <LoaderIcon className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-1 h-4 w-4" />
          )}{" "}
          Pesquisar
        </Button>
      </div>

      <div className="w-full">
        {bikeSearched ? <BikeCard bike={bikeSearched} /> : <BikeCardEmpty />}
      </div>
    </>
  );
}
