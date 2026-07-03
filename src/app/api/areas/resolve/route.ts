import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { calculateDistance } from "@/lib/haversine";

const resolveSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  areaName: z.string(),
  city: z.string().optional().default(""),
  state: z.string().optional().default(""),
  pincode: z.string().optional().default(""),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = resolveSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const data = result.data;

    // Check for an existing area within 5km radius
    const existingAreas = await db.area.findMany();
    let closestArea = null;
    let minDistance = 5; // Max 5km radius

    for (const area of existingAreas) {
      const distance = calculateDistance(data.latitude, data.longitude, area.latitude, area.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        closestArea = area;
      }
    }

    if (closestArea) {
      return NextResponse.json(closestArea);
    }

    // If no area found, create a new one. We need a Zone first.
    let defaultZone = await db.zone.findFirst({ where: { name: "Default Region" } });
    if (!defaultZone) {
      defaultZone = await db.zone.create({
        data: { name: "Default Region", description: "Auto-generated region" },
      });
    }

    const newArea = await db.area.create({
      data: {
        areaName: data.areaName || "Unknown Area",
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        latitude: data.latitude,
        longitude: data.longitude,
        zoneId: defaultZone.id,
      },
    });

    return NextResponse.json(newArea, { status: 201 });
  } catch (error) {
    console.error("Resolve Area Error:", error);
    return NextResponse.json(
      { error: "Failed to resolve area" },
      { status: 500 }
    );
  }
}
