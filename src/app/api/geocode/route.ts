import { NextResponse } from "next/server";
import { searchAddress } from "@/lib/services/geocoding-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    const results = await searchAddress(query);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Geocoding API Error:", error);
    return NextResponse.json(
      { error: "Failed to geocode address" },
      { status: 500 }
    );
  }
}
