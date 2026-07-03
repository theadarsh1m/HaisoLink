"use client";

import L from "leaflet";
import { Marker, Popup } from "react-leaflet";

const pickupIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface PickupMarkerProps {
  position: [number, number];
  label?: string;
}

export function PickupMarker({ position, label = "Pickup Location" }: PickupMarkerProps) {
  return (
    <Marker position={position} icon={pickupIcon}>
      <Popup>
        <div className="font-sans">
          <p className="font-bold text-sm text-emerald-600">📦 {label}</p>
          <p className="text-xs text-gray-500 mt-1">
            {position[0].toFixed(5)}, {position[1].toFixed(5)}
          </p>
        </div>
      </Popup>
    </Marker>
  );
}
