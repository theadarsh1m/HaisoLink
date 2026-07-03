"use client";

import * as React from "react";
import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] rounded-2xl bg-secondary/20 border border-border/40 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground font-medium">Loading map visualizer...</p>
      </div>
    </div>
  ),
});

interface DynamicDeliveryMapProps {
  pickup?: [number, number] | null;
  destination?: [number, number] | null;
  agent?: [number, number] | null;
  agentName?: string;
  agentVehicle?: string;
  routeCoordinates?: [number, number][];
  center?: [number, number];
  zoom?: number;
  onClick?: (lat: number, lng: number) => void;
  style?: React.CSSProperties;
}

export function DynamicDeliveryMap(props: DynamicDeliveryMapProps) {
  return <DynamicMap {...props} />;
}
