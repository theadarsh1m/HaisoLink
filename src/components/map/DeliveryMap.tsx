"use client";

import * as React from "react";
import LeafletMap from "./LeafletMap";
import { PickupMarker } from "./PickupMarker";
import { DestinationMarker } from "./DestinationMarker";
import { AgentMarker } from "./AgentMarker";
import { RoutePolyline } from "./RoutePolyline";

interface DeliveryMapProps {
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

export default function DeliveryMap({
  pickup,
  destination,
  agent,
  agentName,
  agentVehicle,
  routeCoordinates,
  center,
  zoom,
  onClick,
  style,
}: DeliveryMapProps) {
  return (
    <LeafletMap center={center} zoom={zoom} onClick={onClick} style={style}>
      {pickup && <PickupMarker position={pickup} />}
      {destination && <DestinationMarker position={destination} />}
      {agent && <AgentMarker position={agent} name={agentName} vehicle={agentVehicle} />}
      {routeCoordinates && <RoutePolyline positions={routeCoordinates} />}
    </LeafletMap>
  );
}
