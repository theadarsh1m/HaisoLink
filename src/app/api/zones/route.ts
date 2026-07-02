import { NextRequest } from "next/server";
import { successResponse } from "@/utils/api-response";

export async function GET() {
  return successResponse(
    [
      {
        id: "zone-uuid-1",
        name: "North Zone",
        description: "North Logistics Area",
      },
    ],
    "Zones retrieved successfully"
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return successResponse(
      {
        id: "zone-uuid-2",
        ...body,
      },
      "Zone created successfully",
      201
    );
  } catch {
    return successResponse({}, "Zone created successfully", 201);
  }
}
