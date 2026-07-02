import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/utils/api-response";
import { OrderRepository } from "@/repositories/OrderRepository";

export const dynamic = "force-dynamic";

const orderRepo = new OrderRepository();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await orderRepo.findById(id);
    if (!order) {
      return errorResponse("Order not found", null, 404);
    }
    return successResponse(order, "Order retrieved successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to retrieve order";
    return errorResponse(message, null, 500);
  }
}
