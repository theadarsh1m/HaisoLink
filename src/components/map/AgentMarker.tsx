"use client";

import * as React from "react";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";

const agentIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface AgentMarkerProps {
  position: [number, number];
  name?: string;
  vehicle?: string;
}

export function AgentMarker({ position, name = "Delivery Agent", vehicle }: AgentMarkerProps) {
  return (
    <Marker position={position} icon={agentIcon}>
      <Popup>
        <div className="font-sans">
          <p className="font-bold text-sm text-blue-600">🚚 {name}</p>
          {vehicle && <p className="text-xs text-gray-500 mt-1">Vehicle: {vehicle}</p>}
          <p className="text-xs text-gray-500 mt-1">
            {position[0].toFixed(5)}, {position[1].toFixed(5)}
          </p>
        </div>
      </Popup>
    </Marker>
  );
}
