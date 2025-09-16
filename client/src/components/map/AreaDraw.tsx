import { MAP_COLORS } from "@/lib/map";
import { Line } from "react-konva";

export function AreaDraw({
  status,
  points,
}: {
  status: string;
  points: number[];
}) {
  function getAreaColor(status: string) {
    switch (status) {
      case "BROKEN":
        return MAP_COLORS.area.broken;
      case "READY":
        return MAP_COLORS.area.ready;
      default:
        return MAP_COLORS.area.default;
    }
  }

  const colors = getAreaColor(status);

  return (
    <Line
      points={points}
      closed={true}
      stroke={colors.stroke}
      strokeWidth={1}
      dash={[1]}
      fill={colors.fill}
      opacity={0.6}
      listening={false}
      lineJoin="round"
      lineCap="round"
    />
  );
}
