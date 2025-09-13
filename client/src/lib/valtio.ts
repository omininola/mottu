import { proxy } from "valtio";
import { Point, Subsidiary, SubsidiaryTags, Yard } from "./types";

export const areaCreationStore = proxy<{
  points: Point[];
  status: string;
  yard: Yard | undefined;
}>({
  points: [],
  status: "READY",
  yard: undefined,
});

export const subsidiaryStore = proxy<{
  subsidiary: Subsidiary | undefined;
  subsidiaryTags: SubsidiaryTags | undefined;
}>({
  subsidiary: undefined,
  subsidiaryTags: undefined,
});

export const stageStore = proxy<{ center: Point; pos: Point; scale: number }>({
  center: { x: 0, y: 0 },
  pos: { x: 0, y: 0 },
  scale: 1,
});

export const bikeSearchedStore = proxy<{ bikeId: number | undefined }>({
  bikeId: undefined,
});
