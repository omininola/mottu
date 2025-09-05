"use client";

import * as React from "react";

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
import { NewAreaCreation } from "@/components/NewAreaCreation";
import { Button } from "@/components/ui/button";
import { useAreaCreating } from "@/contexts/AreaCreatingContext";
import { useSelectedYard } from "@/contexts/SelectedYardContext";
const MapView = dynamic(
  () => import("@/components/MapView").then((mod) => mod.MapView),
  { ssr: false }
);

export default function Home() {
  const [tag, setTag] = React.useState<Apriltag | null>(null);
  const [bike, setBike] = React.useState<BikeSummary | null>(null);
  const [data, setData] = React.useState<SubsidiaryTags | null>(null);

  const [selectedSubsidiary, setSelectedSubsidiary] =
    React.useState<Subsidiary | null>(null);
  const { yard, setYard } = useSelectedYard();

  const { status, setStatus, points, setPoints } = useAreaCreating();

  const [notification, setNotification] = React.useState<string | undefined>(
    undefined
  );

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
          "Não foi possível buscar as Tags dos pátio da filial: " +
            selectedSubsidiary.name
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

  const handleFinishArea = async () => {
    if (!yard?.id || points?.length < 3) {
      console.log(
        "[MAIN] (handleFinishedArea) -> New Area must have 3 or more points"
      );
      return;
    }

    const newArea = {
      status,
      boundary: points,
      yardId: yard.id,
    };

    try {
      await axios.post(`${NEXT_PUBLIC_JAVA_URL}/areas`, newArea);
      setYard(null);
      setStatus("");
      setPoints([]);
    } catch {
      console.log("[MAIN] Error posting new area");
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {notification && <Notification title="Tags" message={notification} />}

      <div className="col-span-3 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <SubsidiaryCombobox
            selectedSubsidiary={selectedSubsidiary}
            setSelectedSubsidiary={setSelectedSubsidiary}
          />

          {selectedSubsidiary && (
            <div className="flex flex-row-reverse gap-4">
              <NewAreaCreation />

              {points.length >= 3 && status != "" && (
                <Button variant="default" onClick={handleFinishArea}>Confirmar criação</Button>
              )}
            </div>
          )}
        </div>

        <div className="border-2 rounded-2xl w-full p-4">
          <MapView
            data={data}
            setBikeSummary={setBike}
            setTag={setTag}
            apriltag={tag}
            bike={bike}
          />
        </div>
      </div>

      <div className="col-span-1 flex flex-col gap-4">
        <SearchBike />
        {bike && <BikeCard bike={mapBike(bike, data)} />}
        {tag && !tag.bike && (
          <TagCard tag={tag} selectedSubsidiary={selectedSubsidiary} />
        )}
      </div>
    </div>
  );
}
