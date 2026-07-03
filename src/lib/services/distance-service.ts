import { getRouteWithFallback, type LatLng } from "./routing-service";
import { calculateDistance } from "@/lib/haversine";

export async function getRoadDistance(
  pickup: LatLng,
  destination: LatLng
): Promise<number> {
  const route = await getRouteWithFallback(pickup, destination);
  return route.distanceKm;
}

export function getHaversineDistance(
  pickup: LatLng,
  destination: LatLng
): number {
  return parseFloat(
    calculateDistance(pickup.lat, pickup.lng, destination.lat, destination.lng).toFixed(2)
  );
}
