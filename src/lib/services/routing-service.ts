export interface LatLng {
  lat: number;
  lng: number;
}

export interface RouteResult {
  coordinates: [number, number][];
  distanceKm: number;
  durationMinutes: number;
}

export async function getRoute(
  pickup: LatLng,
  destination: LatLng
): Promise<RouteResult | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (data.code !== "Ok" || !data.routes?.length) return null;

    const route = data.routes[0];
    const coordinates: [number, number][] =
      route.geometry.coordinates.map((coord: [number, number]) => [
        coord[1],
        coord[0],
      ]);

    return {
      coordinates,
      distanceKm: route.distance / 1000,
      durationMinutes: Math.ceil(route.duration / 60),
    };
  } catch {
    return null;
  }
}

export async function getRouteWithFallback(
  pickup: LatLng,
  destination: LatLng
): Promise<RouteResult> {
  const osrmResult = await getRoute(pickup, destination);
  if (osrmResult) return osrmResult;

  const R = 6371;
  const dLat = ((destination.lat - pickup.lat) * Math.PI) / 180;
  const dLon = ((destination.lng - pickup.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((pickup.lat * Math.PI) / 180) *
      Math.cos((destination.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;

  const AVG_SPEED_KMH = 30;
  const durationMinutes = Math.ceil((distanceKm / AVG_SPEED_KMH) * 60);

  return {
    coordinates: [
      [pickup.lat, pickup.lng],
      [destination.lat, destination.lng],
    ],
    distanceKm: parseFloat(distanceKm.toFixed(2)),
    durationMinutes,
  };
}

export type { LatLng as RouteLatLng };
