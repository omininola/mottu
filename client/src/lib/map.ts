export const METERS_PER_PIXEL = 0.1; // 1px = 1m

export const MAP_COLORS = {
  yard: {
    fill: "oklch(1 0 0)",
    stroke: "oklch(0.84 0 0)",
    text: "oklch(0.84 0 0)",
    creation: {
      snapping: "oklch(0.6636 0.2049 143.8100)",
      notSnapping: "oklch(0.84 0 0)",
    }
  },
  
  camera: {
    fill: "oklch(0.76 0 0)",
    stroke: "oklch(0.84 0 0)",
  },

  area: {
    broken: {
      fill: "#fda4af",
      stroke: "#fb7185",
    },
    ready: {
      fill: "#93c5fd",
      stroke: "#60a5fa",
    },
    default: {
      fill: "#cbd5e1",
      stroke: "#94a3b8"
    },
  },

  bike: {
    searched: "oklch(0.4208 0.2274 292.8500)",
    selected: "oklch(0.6636 0.2049 143.8100)",
    notSelected: "#64748b",
    inRightArea: "#fff",
    notInRightArea: "#ec4899",
  },

  tag: {
    stroke: "#fff",
    selected: "#f97316",
    notSelected: "#64748b",
  },
};
