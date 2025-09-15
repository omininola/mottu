"use client";

import * as React from "react";

import { SearchBike } from "@/components/SearchBike";
import { Apriltag, BikeSummary, SubsidiaryTags } from "@/lib/types";

import dynamic from "next/dynamic";
import { BikeCard } from "@/components/BikeCard";
import { clearNotification, mapBike } from "@/lib/utils";
import { TagCard } from "@/components/TagCard";
import { SubsidiaryCombobox } from "@/components/SubsidiaryCombobox";
import axios from "axios";
import { NEXT_PUBLIC_JAVA_URL } from "@/lib/environment";
import { Notification } from "@/components/Notification";
import { NewAreaCreation } from "@/components/NewAreaCreation";
import { useSnapshot } from "valtio";
import { subsidiaryStore } from "@/lib/valtio";
import { ResetMapButton } from "@/components/ResetMapButton";
const MapView = dynamic(
  () => import("@/components/MapView").then((mod) => mod.MapView),
  { ssr: false }
);

export default function Home() {
  const UPDATE_DATA_TIME = 2 * 1000; // 2 seconds

  const snapSubsidiary = useSnapshot(subsidiaryStore);

  const [tag, setTag] = React.useState<Apriltag | null>(null);
  const [bike, setBike] = React.useState<BikeSummary | null>(null);

  const [notification, setNotification] = React.useState<string>("");

  React.useEffect(() => {
    async function fetchYardsTags() {
      if (!snapSubsidiary.subsidiary) return;

      console.log("[SUBSIDIARY] Fetching tag data");

      try {
        const response = await axios.get(
          `${NEXT_PUBLIC_JAVA_URL}/subsidiaries/${snapSubsidiary.subsidiary.id}/tags`
        );
        subsidiaryStore.subsidiaryTags = response.data;
      } catch {
        setNotification(
          "Não foi possível buscar as Tags dos pátio da filial: " +
            snapSubsidiary.subsidiary.name
        );
      } finally {
        clearNotification<string>(setNotification, "");
      }
    }

    fetchYardsTags();
    const timer = setInterval(() => {
      fetchYardsTags();
    }, UPDATE_DATA_TIME);

    return () => {
      clearInterval(timer);
    };
  }, [snapSubsidiary, UPDATE_DATA_TIME]);

  return (
    <div className="flex flex-col lg:grid grid-cols-7 gap-4 p-4">
      {notification && <Notification title="Tags" message={notification} />}

      <div className="col-span-5 flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <SubsidiaryCombobox />
            <ResetMapButton />
          </div>

          <NewAreaCreation />
        </div>

        <div className="border-1 rounded-xl w-full p-2 shadow">
          <MapView
            setBikeSummary={setBike}
            setTag={setTag}
            apriltag={tag}
            bike={bike}
          />
        </div>
      </div>

      <div className="col-span-2 flex flex-col gap-4">
        <SearchBike />
        {bike && snapSubsidiary.subsidiaryTags && (
          <BikeCard
            setBike={() => setBike(null)}
            bike={mapBike(
              bike,
              snapSubsidiary.subsidiaryTags as SubsidiaryTags
            )}
          />
        )}
        {tag && !tag.bike && <TagCard tag={tag} setTag={setTag} />}
      </div>
    </div>
  );
}
