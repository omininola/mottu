import * as React from "react";

import { MAP_COLORS } from "@/lib/map";
import { BikeSummary, Point } from "@/lib/types";
import { Path } from "react-konva";
import { useSnapshot } from "valtio";
import { bikeSearchedStore } from "@/lib/valtio";
import Konva from "konva";

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
  const snapBikeSearched = useSnapshot(bikeSearchedStore);
  const [isPinned, setPinned] = React.useState<boolean>(false);

  const isSearched = snapBikeSearched.bikeId == bikeObj.id;

  let stroke = undefined;
  if (isSearched) {
    stroke = MAP_COLORS.bike.searched;
  } else {
    if (isSelected) {
      stroke = MAP_COLORS.bike.selected;
    } else {
      stroke = MAP_COLORS.bike.notSelected;
    }
  }

  const fill = inRightArea
    ? MAP_COLORS.bike.inRightArea
    : MAP_COLORS.bike.notInRightArea;

  function handleMouseOver(tagBike: BikeSummary) {
    if (isPinned || isSearched) return;
    setBikeSummary(tagBike);
  }

  function handleMouseDown(tagBike: BikeSummary) {
    if (isSearched) return;
    if (isPinned && tagBike.id == bikeSummary?.id) {
      setPinned(false);
      setBikeSummary(null);
    } else {
      setPinned(true);
      setBikeSummary(tagBike);
    }
  }

  function handleMouseOut() {
    if (isPinned || isSearched) return;
    setBikeSummary(null);
  }

  const bikePath = `M19.24 0h-2.481c-0.387 0 -0.704 0.292 -0.75 0.667h-1.676c-0.005 0 -0.01 0.003 -0.015 0.003 -0.023 0.001 -0.045 0.008 -0.068 0.014 -0.02 0.005 -0.04 0.008 -0.058 0.017 -0.018 0.008 -0.033 0.022 -0.049 0.033 -0.019 0.014 -0.039 0.026 -0.054 0.044 -0.004 0.004 -0.009 0.005 -0.012 0.009L12.948 2.142C12.703 0.922 11.624 0 10.333 0c-1.346 0 -2.459 1.003 -2.638 2.3l-1.812 -1.553c-0.012 -0.01 -0.027 -0.014 -0.04 -0.022 -0.02 -0.013 -0.04 -0.026 -0.062 -0.035 -0.022 -0.008 -0.045 -0.01 -0.068 -0.014 -0.016 -0.002 -0.03 -0.01 -0.047 -0.01h-1.676C3.944 0.292 3.627 0 3.24 0H0.76C0.341 0 0 0.341 0 0.76v0.48C0 1.659 0.341 2 0.76 2h2.481c0.387 0 0.704 -0.292 0.75 -0.667h1.553l2.177 1.866c0.094 0.464 0.311 0.883 0.613 1.225v2.242h-0.393c-0.703 0 -1.288 0.55 -1.332 1.249l-0.542 7.667a1.341 1.341 0 0 0 0.36 0.997c0.251 0.267 0.606 0.42 0.972 0.42H8v0.667c0 1.287 1.047 2.333 2.333 2.333s2.333 -1.047 2.333 -2.333V17h0.601c0.367 0 0.721 -0.153 0.972 -0.42 0.251 -0.268 0.382 -0.631 0.359 -1l-0.541 -7.663c-0.045 -0.701 -0.629 -1.25 -1.332 -1.25h-0.393v-2.242c0.305 -0.347 0.523 -0.772 0.616 -1.243l1.541 -1.849h1.52c0.047 0.375 0.363 0.667 0.75 0.667h2.481C19.659 2 20 1.659 20 1.24V0.76C20 0.341 19.659 0 19.24 0m-10.907 12.47c-0.002 0.003 -0.003 0.007 -0.005 0.01 -0.101 0.17 -0.182 0.354 -0.237 0.548 -0.005 0.017 -0.009 0.035 -0.014 0.053a2.266 2.266 0 0 0 -0.047 0.228c-0.004 0.024 -0.008 0.048 -0.011 0.072 -0.011 0.094 -0.019 0.19 -0.019 0.287v2.667h-0.601c-0.186 0 -0.359 -0.075 -0.487 -0.21 -0.128 -0.136 -0.191 -0.313 -0.18 -0.497l0.542 -7.667c0.022 -0.351 0.315 -0.626 0.667 -0.626h0.393v5.136zm2 -11.136a0.333 0.333 0 0 1 0.333 0.333 0.333 0.333 0 0 1 -0.333 0.333c-0.368 0 -0.667 0.299 -0.667 0.667 0 0.184 -0.149 0.333 -0.333 0.333s-0.333 -0.149 -0.333 -0.333c0 -0.735 0.598 -1.333 1.333 -1.333m1.333 5.333v5.088c-0.001 0 -0.002 -0.001 -0.002 -0.001 -0.09 -0.063 -0.185 -0.118 -0.283 -0.168 -0.014 -0.007 -0.028 -0.013 -0.042 -0.02a2.305 2.305 0 0 0 -0.615 -0.196 2.266 2.266 0 0 0 -0.069 -0.011c-0.106 -0.015 -0.213 -0.025 -0.322 -0.025 -0.11 0 -0.217 0.01 -0.322 0.025 -0.023 0.003 -0.046 0.007 -0.069 0.011a2.305 2.305 0 0 0 -0.615 0.196c-0.014 0.007 -0.028 0.013 -0.042 0.02 -0.098 0.05 -0.193 0.105 -0.283 0.168 -0.001 0 -0.002 0.001 -0.002 0.001V4.976c0.01 0.006 0.021 0.01 0.031 0.015 0.385 0.217 0.829 0.342 1.302 0.342s0.917 -0.125 1.302 -0.342c0.01 -0.006 0.021 -0.009 0.031 -0.015zm1.059 0.667c0.352 0 0.645 0.275 0.667 0.626l0.542 7.664c0.011 0.186 -0.052 0.363 -0.18 0.499 -0.128 0.136 -0.301 0.21 -0.487 0.21h-0.601v-2.667c0 -0.097 -0.008 -0.192 -0.019 -0.287 -0.003 -0.024 -0.007 -0.048 -0.011 -0.071a2.344 2.344 0 0 0 -0.047 -0.229c-0.005 -0.018 -0.009 -0.035 -0.014 -0.053 -0.055 -0.194 -0.136 -0.378 -0.237 -0.548 -0.002 -0.003 -0.003 -0.007 -0.005 -0.01v-5.136z`;

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
  }, [bikePath, scale]);

  return (
    <Path
      ref={pathRef}
      offset={offset}
      x={pos.x}
      y={pos.y}
      data={bikePath}
      stroke={stroke}
      strokeWidth={0.4}
      lineJoin="round"
      fill={fill}
      scale={{ x: scale, y: scale }}
      onMouseOver={() => handleMouseOver(bikeObj)}
      onMouseDown={() => handleMouseDown(bikeObj)}
      onMouseOut={() => handleMouseOut()}
    />
  );
}
