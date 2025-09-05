import * as React from "react";

import { MapColors } from "@/lib/mapColors";
import { BikeSummary, Point } from "@/lib/types";
import { RegularPolygon } from "react-konva";

export function BikeDraw({
  pos,
  isSelected,
  inRightArea,
  bike,
  setBikeSummary,
}: {
  pos: Point;
  isSelected: boolean;
  inRightArea: boolean;
  bike: BikeSummary | null;
  setBikeSummary: React.Dispatch<React.SetStateAction<BikeSummary | null>>;
}) {
  const stroke = inRightArea
    ? MapColors.bike.inRightArea
    : MapColors.bike.notInRightArea;

  const fill = isSelected
    ? MapColors.bike.selected
    : MapColors.bike.notSelected;

  function handleMouseOver(tagBike: BikeSummary) {
    if (bike) return;
    setBikeSummary(tagBike);
  }

  function handleMouseDown(tagBike: BikeSummary) {
    if (bike && tagBike.id == bike.id) {
      setBikeSummary(null);
    } else {
      setBikeSummary(tagBike);
    }
  }

  function handleMouseOut() {
    if (bike) return;
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
      onMouseOver={() => bike && handleMouseOver(bike)}
      onMouseDown={() => bike && handleMouseDown(bike)}
      onMouseOut={() => handleMouseOut()}
    />
  );
}
