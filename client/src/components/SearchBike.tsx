"use client";

import * as React from "react";

import { LoaderIcon, Search } from "lucide-react";
import { Notification } from "./Notification";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { BikeCardEmpty, BikeCard } from "./BikeCard";
import axios from "axios";
import { NEXT_PUBLIC_JAVA_URL } from "@/lib/environment";
import { Bike } from "@/lib/types";
import { clearNotification } from "@/lib/utils";
import { bikeSearchedStore } from "@/lib/valtio";

export function SearchBike() {
  const [searchText, setSearchText] = React.useState<string>("");
  const [bikeSearched, setBikeSearched] = React.useState<Bike | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [notification, setNotification] = React.useState<string>("");

  async function searchBike() {
    setLoading(true);

    const plate = searchText;

    try {
      const response = await axios.get(
        `${NEXT_PUBLIC_JAVA_URL}/bikes/plate/${plate}`
      );
      bikeSearchedStore.bikeId = response.data.id;
      setBikeSearched(response.data);
    } catch (err: unknown) {
      if (
        axios.isAxiosError(err) &&
        err.response &&
        err.response.status === 404
      ) {
        setNotification(err.response.data.message);
      } else setNotification("Não foi possível se comunicar com o servidor");
    } finally {
      clearNotification<string>(setNotification, "");
      setLoading(false);
    }
  }

  return (
    <>
      {notification && <Notification title="Ops!" message={notification} />}

      <form className="flex flex-row lg:flex-col gap-4" action="#">
        <div className="flex gap-4 w-full">
          <Label htmlFor="plate">Placa</Label>
          <Input
            type="text"
            name="plate"
            id="plate"
            placeholder="123-ABC"
            className="w-full"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={loading} onClick={searchBike}>
          {loading ? (
            <LoaderIcon className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          <span>Pesquisar</span>
        </Button>
      </form>

      <div className="w-full">
        {bikeSearched ? (
          <BikeCard
            setBike={() => {
              setBikeSearched(null);
              bikeSearchedStore.bikeId = undefined;
            }}
            bike={bikeSearched}
          />
        ) : (
          <BikeCardEmpty />
        )}
      </div>
    </>
  );
}
