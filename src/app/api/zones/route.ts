import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/utils/api-response";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const zones = await db.zone.findMany({
      include: {
        areas: true,
      },
    });
    return successResponse(zones, "Zones retrieved successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to retrieve zones";
    return errorResponse(message, null, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name) {
      return errorResponse("Zone name is required", null, 400);
    }
    
    const newZone = await db.zone.create({
      data: {
        name: body.name,
        description: body.description,
      },
    });
    
    return successResponse(newZone, "Zone created successfully", 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create zone";
    return errorResponse(message, null, 500);
  }
}
