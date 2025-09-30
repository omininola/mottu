import { MAP_COLORS } from "@/lib/map";
import { Apriltag, Point } from "@/lib/types";
import Konva from "konva";
import React from "react";
import { Path } from "react-konva";

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
  const fill = isSelected ? MAP_COLORS.tag.selected : MAP_COLORS.tag.notSelected;

  function handleMouseOver(tag: Apriltag) {
    setTag(tag);
  }

  const tagPath = `M7.5 2.5H2.5v5h1.667V4.167h3.333zM2.5 17.5v-5h1.667v3.333h3.333v1.667zM12.5 2.5v1.667h3.333v3.333h1.667V2.5zm3.333 10h1.667v5h-5v-1.667h3.333zM5.833 5.833h3.333v3.333H5.833zm0 5h3.333v3.333H5.833zm8.333 -5h-3.333v3.333h3.333zm-3.333 5h3.333v3.333h-3.333z`;

  const pathRef = React.useRef<Konva.Path>(null);

  const scale = 0.8;
  const [offset, setOffset] = React.useState<Point>({
    x: 0,
    y: 0,
  });

  React.useEffect(() => {
    if (pathRef.current) {
      const box = pathRef.current.getClientRect({
        relativeTo: pathRef.current,
      });
      const offsetX = box.width / 2;
      const offsetY = box.height / 2;
      const offsetUpdated = { x: offsetX, y: offsetY };
      setOffset(offsetUpdated);
    }
  }, [tagPath, scale]);

  return (
    <Path
      ref={pathRef}
      x={pos.x}
      y={pos.y}
      offset={offset}
      data={tagPath}
      fill={fill}
      stroke={MAP_COLORS.tag.stroke}
      strokeWidth={0.5}
      scale={{ x: scale, y: scale }}
      onMouseOver={() => handleMouseOver(tag)}
    />
  );
}
