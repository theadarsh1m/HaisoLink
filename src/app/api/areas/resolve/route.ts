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

    const existingAreas = await db.area.findMany({
      where: { zone: { name: { not: "Default Region" } } }
    });
    
    if (existingAreas.length === 0) {
      return NextResponse.json({ error: "No pricing zones configured" }, { status: 500 });
    }

    let closestArea = existingAreas[0];
    let minDistance = calculateDistance(data.latitude, data.longitude, closestArea.latitude, closestArea.longitude);

    for (const area of existingAreas) {
      const distance = calculateDistance(data.latitude, data.longitude, area.latitude, area.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        closestArea = area;
      }
    }

    if (minDistance < 5) {
      return NextResponse.json(closestArea);
    }

    const newArea = await db.area.create({
      data: {
        areaName: data.areaName || "Unknown Area",
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        latitude: data.latitude,
        longitude: data.longitude,
        zoneId: closestArea.zoneId,
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
