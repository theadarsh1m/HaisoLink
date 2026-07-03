import { NextResponse } from "next/server";
import { getRouteWithFallback } from "@/lib/services/routing-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pickupLat = searchParams.get("pickupLat");
    const pickupLng = searchParams.get("pickupLng");
    const destLat = searchParams.get("destLat");
    const destLng = searchParams.get("destLng");

    if (!pickupLat || !pickupLng || !destLat || !destLng) {
      return NextResponse.json(
        { error: "Missing pickup or destination coordinates" },
        { status: 400 }
      );
    }

    const pickup = { lat: parseFloat(pickupLat), lng: parseFloat(pickupLng) };
    const destination = { lat: parseFloat(destLat), lng: parseFloat(destLng) };

    if (
      isNaN(pickup.lat) ||
      isNaN(pickup.lng) ||
      isNaN(destination.lat) ||
      isNaN(destination.lng)
    ) {
      return NextResponse.json(
        { error: "Invalid coordinates" },
        { status: 400 }
      );
    }

    const route = await getRouteWithFallback(pickup, destination);
    return NextResponse.json(route);
  } catch (error) {
    console.error("Routing API Error:", error);
    return NextResponse.json(
      { error: "Failed to calculate route" },
      { status: 500 }
    );
  }
}
