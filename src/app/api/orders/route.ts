import { NextRequest } from "next/server";
import { successResponse } from "@/utils/api-response";

export async function GET() {
  return successResponse(
    [
      {
        id: "order-uuid-1",
        trackingNumber: "HL-8094",
        customerId: "cust-uuid-1",
        pickupAreaId: "area-uuid-1",
        destinationAreaId: "area-uuid-2",
        status: "PENDING",
        totalCharge: 15.0,
      },
    ],
    "Orders retrieved successfully"
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return successResponse(
      {
        id: "order-uuid-2",
        trackingNumber: "HL-8095",
        ...body,
      },
      "Order created successfully",
      201
    );
  } catch {
    return successResponse({}, "Order created successfully", 201);
  }
}
