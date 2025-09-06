import { MapColors } from "@/lib/mapColors";
import { Apriltag, Point } from "@/lib/types";
import { Circle } from "react-konva";

export function TagDraw({
  pos,
  isSelected,
  tag,
  setTag,
}: {
  pos: Point;
  isSelected: boolean;
  tag: Apriltag;
  setTag: React.Dispatch<React.SetStateAction<Apriltag | null>>;
}) {
  const fill = isSelected ? MapColors.tag.selected : MapColors.tag.notSelected;

  function handleMouseOver(tag: Apriltag) {
    setTag(tag);
  }

  return (
    <Circle
      x={pos.x}
      y={pos.y}
      radius={3}
      fill={fill}
      stroke={MapColors.tag.stroke}
      strokeWidth={1}
      onMouseOver={() => handleMouseOver(tag)}
    />
  );
}
