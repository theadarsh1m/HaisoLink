import { NextRequest } from "next/server";
import { successResponse } from "@/utils/api-response";

export async function GET() {
  return successResponse(
    [
      {
        id: "area-uuid-1",
        areaName: "Downtown",
        city: "Metro",
        state: "State A",
        pincode: "110001",
        zoneId: "zone-uuid-1",
      },
    ],
    "Areas retrieved successfully"
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return successResponse(
      {
        id: "area-uuid-2",
        ...body,
      },
      "Area created successfully",
      201
    );
  } catch {
    return successResponse({}, "Area created successfully", 201);
  }
}
