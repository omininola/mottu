import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Bike, BikeSummary, YardMongo } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clearNotification<T>(
  cb: React.Dispatch<React.SetStateAction<T>>,
  value: T
) {
  setTimeout(() => {
    cb(value);
  }, 3000);
}

export function mapBike(bike: BikeSummary, data: YardMongo | null) {
  const tagPosition = data?.tags.find((tag) => tag.bike.id === bike.id);

  const newBike: Bike = {
    id: bike.id,
    plate: bike.plate,
    chassis: bike.chassis,
    model: bike.model,
    status: bike.status,
    tagCode: tagPosition?.tag.code || null,
    yard: data?.yard || null,
  };

  return newBike;
}
