import { getRouteWithFallback, type LatLng } from "./routing-service";

const DEFAULT_SPEED_KMH = 30;

export function calculateETA(
  distanceKm: number,
  speedKmh: number = DEFAULT_SPEED_KMH
): number {
  if (distanceKm <= 0 || speedKmh <= 0) return 0;
  return Math.ceil((distanceKm / speedKmh) * 60);
}

export async function calculateETAFromCoords(
  pickup: LatLng,
  destination: LatLng,
  speedKmh: number = DEFAULT_SPEED_KMH
): Promise<{ etaMinutes: number; distanceKm: number }> {
  const route = await getRouteWithFallback(pickup, destination);
  return {
    etaMinutes: route.durationMinutes || calculateETA(route.distanceKm, speedKmh),
    distanceKm: route.distanceKm,
  };
}

export function formatETA(minutes: number): string {
  if (minutes < 1) return "< 1 min";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}
