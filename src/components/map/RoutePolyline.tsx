"use client";

import { Polyline } from "react-leaflet";

interface RoutePolylineProps {
  positions: [number, number][];
  color?: string;
  weight?: number;
  opacity?: number;
  dashArray?: string;
}

export function RoutePolyline({
  positions,
  color = "#3b82f6",
  weight = 4,
  opacity = 0.8,
  dashArray,
}: RoutePolylineProps) {
  if (!positions || positions.length < 2) return null;

  return (
    <Polyline
      positions={positions}
      pathOptions={{
        color,
        weight,
        opacity,
        dashArray,
      }}
    />
  );
}
