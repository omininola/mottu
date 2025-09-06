import * as React from "react";

import { MapColors } from "@/lib/mapColors";
import { BikeSummary, Point } from "@/lib/types";
import { RegularPolygon } from "react-konva";

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
  const [isPinned, setPinned] = React.useState<boolean>(false);

  const stroke = inRightArea
    ? MapColors.bike.inRightArea
    : MapColors.bike.notInRightArea;

  const fill = isSelected
    ? MapColors.bike.selected
    : MapColors.bike.notSelected;

  function handleMouseOver(tagBike: BikeSummary) {
    if (isPinned) return;
    setBikeSummary(tagBike);
  }

  function handleMouseDown(tagBike: BikeSummary) {
    if (isPinned && tagBike.id == bikeSummary?.id) {
      setPinned(false);
      setBikeSummary(null);
    } else {
      setPinned(true);
      setBikeSummary(tagBike);
    }
  }

  function handleMouseOut() {
    if (isPinned) return;
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
