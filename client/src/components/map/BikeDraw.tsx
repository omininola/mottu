import * as React from "react";

import { MapColors } from "@/lib/mapColors";
import { BikeSummary, Point } from "@/lib/types";
import { RegularPolygon } from "react-konva";
import { useSnapshot } from "valtio";
import { bikeSearchedStore } from "@/lib/valtio";

export function BikeDraw({
  pos,
  isSelected,
  inRightArea,
  bikeSummary,
  setBikeSummary,
  bikeObj,
}: {
  pos: Point;
  isSelected: boolean;
  inRightArea: boolean;
  bikeSummary: BikeSummary | null;
  setBikeSummary: React.Dispatch<React.SetStateAction<BikeSummary | null>>;
  bikeObj: BikeSummary;
}) {
  const snapBikeSearched = useSnapshot(bikeSearchedStore);
  const [isPinned, setPinned] = React.useState<boolean>(false);

  const isSearched = snapBikeSearched.bikeId == bikeObj.id;

  let stroke = undefined;
  if (isSearched) {
    stroke = MapColors.bike.searched;
  } else {
    if (isSelected) {
      stroke = MapColors.bike.selected;
    } else {
      stroke = MapColors.bike.notSelected;
    }
  }

  const fill = inRightArea
    ? MapColors.bike.inRightArea
    : MapColors.bike.notInRightArea;

  function handleMouseOver(tagBike: BikeSummary) {
    if (isPinned || isSearched) return;
    setBikeSummary(tagBike);
  }

  function handleMouseDown(tagBike: BikeSummary) {
    if (isSearched) return;
    if (isPinned && tagBike.id == bikeSummary?.id) {
      setPinned(false);
      setBikeSummary(null);
    } else {
      setPinned(true);
      setBikeSummary(tagBike);
    }
  }

  function handleMouseOut() {
    if (isPinned || isSearched) return;
    setBikeSummary(null);
  }

  return (
    <RegularPolygon
      x={pos.x}
      y={pos.y}
      sides={3}
      radius={5}
      stroke={stroke}
      strokeWidth={1}
      lineJoin="round"
      fill={fill}
      onMouseOver={() => handleMouseOver(bikeObj)}
      onMouseDown={() => handleMouseDown(bikeObj)}
      onMouseOut={() => handleMouseOut()}
    />
  );
}
