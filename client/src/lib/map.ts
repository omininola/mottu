export const METERS_PER_PIXEL = 0.1; // 1px = 1m

export const MAP_COLORS = {
  yard: {
    fill: "#cbd5e1",
    stroke: "#94a3b8",
    text: "#94a3b8",
    creation: {
      snapping: "#16a34a",
      notSnapping: "#f97316",
    }
  },
  
  camera: {
    fill: "#cbd5e1",
    stroke: "#94a3b8",
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
    searched: "#4f46e5",
    selected: "#16a34a",
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
