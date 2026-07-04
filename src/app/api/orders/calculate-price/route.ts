import { NextRequest, NextResponse } from "next/server";
import { PricingService } from "@/services/PricingService";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { OrderType, PaymentType } from "@prisma/client";
import { db } from "@/lib/db";
import { calculateDistance } from "@/lib/haversine";

const pricingService = new PricingService();

const calculateSchema = z.object({
  pickupLat: z.number(),
  pickupLng: z.number(),
  pickupName: z.string().optional().default("Pickup"),
  destLat: z.number(),
  destLng: z.number(),
  destName: z.string().optional().default("Destination"),
  orderType: z.enum(["STANDARD", "EXPRESS"]),
  paymentType: z.enum(["PREPAID", "COD"]),
  length: z.number().positive(),
  width: z.number().positive(),
  height: z.number().positive(),
  actualWeight: z.number().positive(),
});

async function resolveOrCreateArea(lat: number, lng: number, name: string) {
  const existingAreas = await db.area.findMany({
    where: {
      zone: {
        name: { not: "Default Region" }
      }
    }
  });
  if (existingAreas.length === 0) throw new Error("No pricing zones configured");

  let closestArea = existingAreas[0];
  let minDistance = calculateDistance(lat, lng, closestArea.latitude, closestArea.longitude);

  for (const area of existingAreas) {
    const distance = calculateDistance(lat, lng, area.latitude, area.longitude);
    if (distance < minDistance) {
      minDistance = distance;
      closestArea = area;
    }
  }

  // If extremely close (within 5km), reuse the exact same area ID
  if (minDistance < 5) return closestArea.id;

  // Otherwise, create a new Area but attach it to the closest Zone
  // This guarantees that a RateCard will always exist for the routing
  const newArea = await db.area.create({
    data: {
      areaName: name,
      city: "Auto-Mapped Location",
      state: "Auto",
      pincode: "000000",
      latitude: lat,
      longitude: lng,
      zoneId: closestArea.zoneId,
    },
  });

  return newArea.id;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = calculateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid parameters", details: result.error.format() },
        { status: 400 }
      );
    }

    const pickupAreaId = await resolveOrCreateArea(result.data.pickupLat, result.data.pickupLng, result.data.pickupName);
    const destinationAreaId = await resolveOrCreateArea(result.data.destLat, result.data.destLng, result.data.destName);

    const priceDetails = await pricingService.calculatePrice(
      pickupAreaId,
      destinationAreaId,
      result.data.orderType as OrderType,
      result.data.paymentType as PaymentType,
      result.data.length,
      result.data.width,
      result.data.height,
      result.data.actualWeight
    );

    return NextResponse.json(priceDetails, { status: 200 });
  } catch (error) {
    console.error("Calculate Price Error:", error);
    const message = error instanceof Error ? error.message : "Failed to calculate price";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
