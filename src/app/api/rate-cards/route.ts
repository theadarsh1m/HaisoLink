import { NextRequest } from "next/server";
import { successResponse } from "@/utils/api-response";

export async function GET() {
  return successResponse(
    [
      {
        id: "rate-uuid-1",
        sourceZoneId: "zone-uuid-1",
        destinationZoneId: "zone-uuid-1",
        orderType: "STANDARD",
        pricePerKg: 2.5,
        minimumCharge: 10.0,
        isActive: true,
      },
    ],
    "Rate cards retrieved successfully"
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return successResponse(
      {
        id: "rate-uuid-2",
        ...body,
      },
      "Rate card created successfully",
      201
    );
  } catch {
    return successResponse({}, "Rate card created successfully", 201);
  }
}
