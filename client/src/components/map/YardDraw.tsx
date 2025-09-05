import { Line } from "react-konva";

export function YardDraw({ points }: { points: number[] }) {
  return (
    <Line
      points={points}
      closed={true}
      stroke="#6ee7b7"
      strokeWidth={2}
      fill="#a7f3d0"
    />
  );
}