"use client";

import { Polygon, Tooltip } from "react-leaflet";

interface ZoneData {
  id: string;
  name: string;
  coordinates: [number, number][];
  color?: string;
}

interface ZoneOverlayProps {
  zones: ZoneData[];
}

const ZONE_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
];

export function ZoneOverlay({ zones }: ZoneOverlayProps) {
  return (
    <>
      {zones.map((zone, index) => (
        <Polygon
          key={zone.id}
          positions={zone.coordinates}
          pathOptions={{
            color: zone.color || ZONE_COLORS[index % ZONE_COLORS.length],
            fillOpacity: 0.15,
            weight: 2,
          }}
        >
          <Tooltip sticky>{zone.name}</Tooltip>
        </Polygon>
      ))}
    </>
  );
}

export type { ZoneData };
