"use client";

import L from "leaflet";
import { Marker, Popup } from "react-leaflet";

const destinationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface DestinationMarkerProps {
  position: [number, number];
  label?: string;
}

export function DestinationMarker({ position, label = "Destination" }: DestinationMarkerProps) {
  return (
    <Marker position={position} icon={destinationIcon}>
      <Popup>
        <div className="font-sans">
          <p className="font-bold text-sm text-rose-600">📍 {label}</p>
          <p className="text-xs text-gray-500 mt-1">
            {position[0].toFixed(5)}, {position[1].toFixed(5)}
          </p>
        </div>
      </Popup>
    </Marker>
  );
}
