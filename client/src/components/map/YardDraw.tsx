import { MapColors } from "@/lib/mapColors";
import { Line, Text } from "react-konva";

export function YardDraw({
  points,
  yardName,
}: {
  points: number[];
  yardName: string;
}) {
  const OFFSET_Y = 20;

  const xValues = points.filter((_, idx) => idx % 2 == 0);
  const yValues = points.filter((_, idx) => idx % 2 == 1);

  const leftMost = Math.min(...xValues);
  const upMost = Math.min(...yValues);

  return (
    <>
      <Text
        x={leftMost}
        y={upMost - OFFSET_Y}
        text={yardName}
        fontSize={20}
        fontFamily="Arial"
        fill={MapColors.yard.text}
      />
      <Line
        points={points}
        closed={true}
        stroke={MapColors.yard.stroke}
        strokeWidth={2}
        fill={MapColors.yard.fill}
      />
    </>
  );
}
