"use client";

import * as React from "react";

import { AreaDropdownMenu } from "@/components/AreaDropdownMenu";
import { SearchBike } from "@/components/SearchBike";
import { Apriltag, BikeSummary, Subsidiary, SubsidiaryTags } from "@/lib/types";

import dynamic from "next/dynamic";
import { BikeCard } from "@/components/BikeCard";
import { clearNotification, mapBike } from "@/lib/utils";
import { TagCard } from "@/components/TagCard";
import { SubsidiaryCombobox } from "@/components/SubsidiaryCombobox";
import axios from "axios";
import { NEXT_PUBLIC_JAVA_URL } from "@/lib/environment";
import { Notification } from "@/components/Notification";
const MapView = dynamic(
  () => import("@/components/MapView").then((mod) => mod.MapView),
  { ssr: false }
);

export default function Home() {
  
  const [tag, setTag] = React.useState<Apriltag | null>(null)
  const [bike, setBike] = React.useState<BikeSummary | null>(null);
  const [data, setData] = React.useState<SubsidiaryTags | null>(null);

  const [selectedSubsidiary, setSelectedSubsidiary] = React.useState<Subsidiary | null>(null);

  const [notification, setNotification] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    async function fetchYardsTags() {
      if (!selectedSubsidiary) return;

      console.log("[SUBSIDIARY] Fetching tag data");

      try {
        const response = await axios.get(
          `${NEXT_PUBLIC_JAVA_URL}/subsidiaries/${selectedSubsidiary.id}/tags`
        );
        setData(response.data);
      } catch {
        setNotification(
          "Não foi possível buscar as Tags dos pátio da filial: " + selectedSubsidiary.name
        );
      } finally {
        clearNotification<string | undefined>(setNotification, undefined);
      }
    }
    
    fetchYardsTags();
    const timer = setInterval(() => {
      fetchYardsTags();
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [setData, selectedSubsidiary]);

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {notification && <Notification title="Tags" message={notification} />}

      <div className="col-span-3 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <AreaDropdownMenu />
          <SubsidiaryCombobox
            selectedSubsidiary={selectedSubsidiary}
            setSelectedSubsidiary={setSelectedSubsidiary}
          />
        </div>

        <div className="border-2 rounded-2xl w-full p-4">
          <MapView data={data} setBikeSummary={setBike} setTag={setTag} apriltag={tag} bike={bike} />
        </div>
      </div>

      <div className="col-span-1 flex flex-col gap-4">
        <SearchBike />
        {bike && <BikeCard bike={mapBike(bike, data)} />}
        {(tag && !tag.bike) && <TagCard tag={tag} selectedSubsidiary={selectedSubsidiary} />}
      </div>
    </div>
  );
}
