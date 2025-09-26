import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Bike, BikeSummary, Point, SubsidiaryTags } from "./types";

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
export function mapBike(bike: BikeSummary, data: SubsidiaryTags) {
  let tagCode = null;
  let yardMongo = null;
  if (data.yards != null) {
    yardMongo = data?.yards.find((yard) => {
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
  }

  const newBike: Bike = {
    id: bike.id,
    plate: bike.plate,
    chassis: bike.chassis,
    model: bike.model,
    status: bike.status,
    tagCode: tagCode || null,
    yard: yardMongo?.yard || null,
    subsidiary: data.subsidiary,
  };

  return newBike;
}

export function pointInPolygon(
  point: Point,
  boundary: Point[],
  offset: number
): boolean {
  const { x, y } = point;
  let inside = false;
  for (let i = 0, j = boundary.length - 1; i < boundary.length; j = i++) {
    const xi = boundary[i].x + offset,
      yi = boundary[i].y;
    const xj = boundary[j].x + offset,
      yj = boundary[j].y;
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + 1e-10) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function toKonvaPoints(
  points: Point[],
  offsetX?: number
): number[] {
  const padding: Point = { x: 20, y: 40 };
  return points.flatMap((pt) => [
    pt.x + (offsetX || 0) + padding.x,
    pt.y + padding.y,
  ]);
}

export const isPointInsideYard = (
  point: Point,
  yardBoundary: Point[],
  yardOffset: number
) => {
  return pointInPolygon(point, yardBoundary, yardOffset);
};
