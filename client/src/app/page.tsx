"use client";

import * as React from "react";

import { AreaDropdownMenu } from "@/components/AreaDropdownMenu";
import { SearchBike } from "@/components/SearchBike";
import { YardCombobox } from "@/components/YardCombobox";
import { BikeSummary, YardMongo } from "@/lib/types";

import dynamic from "next/dynamic";
import { BikeCard } from "@/components/BikeCard";
import { mapBike } from "@/lib/utils";
const MapView = dynamic(
  () => import("@/components/MapView").then((mod) => mod.MapView),
  { ssr: false }
);

export default function Home() {
  const [bike, setBike] = React.useState<BikeSummary | null>(null);
  const [data, setData] = React.useState<YardMongo | null>(null);

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <div className="col-span-3 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <AreaDropdownMenu />
          <YardCombobox setData={setData} />
        </div>

        <div className="border-2 rounded-2xl w-full p-4">
          <MapView data={data} setBikeSummary={setBike} bike={bike} />
        </div>
      </div>

      <div className="col-span-1 flex flex-col gap-4">
        <SearchBike />
        {bike && <BikeCard bike={mapBike(bike, data)} />}
      </div>
    </div>
  );
}
