import { MapColors } from "@/lib/mapColors";
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
        return MapColors.area.broken;
      case "READY":
        return MapColors.area.ready;
      default:
        return MapColors.area.default;
    }
  }

  const colors = getAreaColor(status);

  return (
    <Line
      points={points}
      closed={true}
      stroke={colors.stroke}
      strokeWidth={3}
      fill={colors.fill}
      lineJoin="round"
      lineCap="round"
    />
  );
}
