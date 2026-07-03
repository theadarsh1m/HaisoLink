"use client";

import * as React from "react";
import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] rounded-2xl bg-secondary/20 border border-border/40 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground font-medium">Loading map...</p>
      </div>
    </div>
  ),
});

interface MapWrapperProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  children?: React.ReactNode;
  onClick?: (lat: number, lng: number) => void;
  style?: React.CSSProperties;
}

export function MapWrapper(props: MapWrapperProps) {
  return <DynamicMap {...props} />;
}
