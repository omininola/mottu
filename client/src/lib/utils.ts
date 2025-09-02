import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Bike, BikeSummary, SubsidiaryTags } from "./types";

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

// i am sorry :c
export function mapBike(bike: BikeSummary, data: SubsidiaryTags | null) {
  let tagCode = null;
  const yardMongo = data?.yards.find((yard) => {
    if (
      yard.tags.find((tag) => {
        if (tag.bike != null && tag.bike.id === bike.id) {
          tagCode = tag.tag.code;
          return tag;
        }
      })
    )
      return yard;
  });

  const newBike: Bike = {
    id: bike.id,
    plate: bike.plate,
    chassis: bike.chassis,
    model: bike.model,
    status: bike.status,
    tagCode: tagCode || null,
    yard: yardMongo?.yard || null,
  };

  return newBike;
}
