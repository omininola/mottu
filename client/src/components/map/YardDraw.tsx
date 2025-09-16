import { MAP_COLORS } from "@/lib/map";
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
        fill={MAP_COLORS.yard.text}
        listening={false}
      />
      <Line
        points={points}
        closed={true}
        stroke={MAP_COLORS.yard.stroke}
        strokeWidth={2}
        listening={false}
        fill={MAP_COLORS.yard.fill}
      />
    </>
  );
}
