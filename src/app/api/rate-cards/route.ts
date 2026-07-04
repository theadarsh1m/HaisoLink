import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/utils/api-response";
import { db } from "@/lib/db";
import { rateCardSchema } from "@/validations/rate-card";
import { OrderType } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sourceZoneId = searchParams.get("sourceZoneId");
    const destinationZoneId = searchParams.get("destinationZoneId");
    
    const rateCards = await db.rateCard.findMany({
      where: {
        ...(sourceZoneId && { sourceZoneId }),
        ...(destinationZoneId && { destinationZoneId }),
      },
      include: {
        sourceZone: true,
        destinationZone: true,
      },
    });
    
    return successResponse(rateCards, "Rate cards retrieved successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to retrieve rate cards";
    return errorResponse(message, null, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = rateCardSchema.safeParse(body);
    
    if (!result.success) {
      return errorResponse("Invalid rate card data", result.error.format(), 400);
    }
    
    const newRateCard = await db.rateCard.create({
      data: {
        sourceZoneId: result.data.sourceZoneId,
        destinationZoneId: result.data.destinationZoneId,
        orderType: result.data.orderType as OrderType,
        pricePerKg: result.data.pricePerKg,
        minimumCharge: result.data.minimumCharge,
        isActive: result.data.isActive ?? true,
      },
    });
    
    return successResponse(newRateCard, "Rate card created successfully", 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create rate card";
    return errorResponse(message, null, 500);
  }
}
