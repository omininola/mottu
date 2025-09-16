"use client";

import dynamic from "next/dynamic";
import React from "react";

const YardCreationMap = dynamic(
  () =>
    import("@/components/YardCreationMap").then((mod) => mod.YardCreationMap),
  { ssr: false }
);

export default function NewYard() {
  return (
    <div className="p-4">
      <YardCreationMap />
    </div>
  );
}
