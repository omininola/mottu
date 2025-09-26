import { Point } from "@/lib/types";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useSnapshot } from "valtio";
import { areaCreationStore } from "@/lib/valtio";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";

export function PointVisualization({
  points,
  setPoints,
  setYardPoints,
  transformCamera,
}: {
  points: Point[];
  setPoints: React.Dispatch<React.SetStateAction<Point[]>>;
  setYardPoints?: React.Dispatch<React.SetStateAction<Point[]>>;
  transformCamera?: true;
}) {
  function handlePointChange(
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
    axis: string
  ) {
    const value = parseFloat(e.target.value);
    if (!value) return;
    setPoints((points) =>
      points.map((point, pIdx) =>
        idx == pIdx ? { ...point, [axis]: value } : point
      )
    );
  }

  return (
    <Table className="col-span-1">
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Eixo X</TableHead>
          <TableHead>Eixo Y</TableHead>
          {transformCamera && <TableHead>Ponto no Pátio</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {points.map((point, idx) => (
          <TableRow key={idx}>
            <TableCell>Ponto {idx + 1}</TableCell>
            <TableCell>
              <Input
                value={point.x.toFixed(2)}
                onChange={(e) => handlePointChange(e, idx, "x")}
              />
            </TableCell>
            <TableCell>
              <Input
                value={point.y.toFixed(2)}
                onChange={(e) => handlePointChange(e, idx, "y")}
              />
            </TableCell>
            {(transformCamera && setYardPoints) && (
              <TableCell className="w-1/3">
                <YardPointDropdown setYardPoints={setYardPoints} arrayPos={idx} />
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function YardPointDropdown({
  setYardPoints,
  arrayPos
}: {
  setYardPoints: React.Dispatch<React.SetStateAction<Point[]>>
  arrayPos: number
}) {
  const snapAreaCreation = useSnapshot(areaCreationStore);

  const [yardPoint, setYardPoint] = React.useState<Point | undefined>(
    undefined
  );

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Selecionar o ponto</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Ponto vinculado</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={`${yardPoint?.x};${yardPoint?.y}`}
            onValueChange={(value) => {
              const splited = value.split(";"); // "90;178" -> ["90", "178"]
              const parsed = splited.map((point) => parseFloat(point)); // ["90", "178"] -> [90, 178]
              const newPoint = {
                x: parsed[0],
                y: parsed[1],
              };
              setYardPoint(newPoint);
              setYardPoints(points => points.map((point, idx) =>
                idx == arrayPos ? newPoint : point
              ))
            }}
          >
            {snapAreaCreation.yard?.boundary.map((point, idx) => (
              <DropdownMenuRadioItem
                key={idx}
                value={`${point?.x};${point?.y}`}
              >
                <span>Ponto {idx + 1}</span>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label>Eixo X</Label>
                    <Badge>{point.x}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label>Eixo Y</Label>
                    <Badge>{point.y}</Badge>
                  </div>
                </div>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label>Eixo X</Label>
          <Badge>{yardPoint?.x || 0}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Label>Eixo Y</Label>
          <Badge>{yardPoint?.y || 0}</Badge>
        </div>
      </div>
    </div>
  );
}
