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
  const existingAreas = await db.area.findMany();
  let closestArea = null;
  let minDistance = 5;

  for (const area of existingAreas) {
    const distance = calculateDistance(lat, lng, area.latitude, area.longitude);
    if (distance < minDistance) {
      minDistance = distance;
      closestArea = area;
    }
  }

  if (closestArea) return closestArea.id;

  let defaultZone = await db.zone.findFirst({ where: { name: "Default Region" } });
  if (!defaultZone) {
    defaultZone = await db.zone.create({
      data: { name: "Default Region", description: "Auto-generated region" },
    });
  }

  const newArea = await db.area.create({
    data: {
      areaName: name,
      city: "",
      state: "",
      pincode: "",
      latitude: lat,
      longitude: lng,
      zoneId: defaultZone.id,
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
