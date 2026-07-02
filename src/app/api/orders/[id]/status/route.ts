import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/utils/api-response";
import { OrderLifecycleService } from "@/services/OrderLifecycleService";
import { statusUpdateSchema } from "@/validations/workflow";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

const lifecycleService = new OrderLifecycleService();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: request.headers });
    const body = await request.json();

    const result = statusUpdateSchema.safeParse(body);
    if (!result.success) {
      return errorResponse("Invalid status update input parameters", result.error.format(), 400);
    }

    const { status, remarks, latitude, longitude } = result.data;
    const forceOverride = body.forceOverride === true;

    let actorId = session?.user?.id;
    let actorRole = session?.user?.role as Role;

    if (!actorId) {
      const parsed = body as { actorId?: string; actorRole?: Role };
      actorId = parsed.actorId;
      actorRole = parsed.actorRole || "DELIVERY_AGENT";
    }

    if (!actorId) {
      return errorResponse("Unauthorized", null, 401);
    }

    await lifecycleService.transitionStatus(
      id,
      status,
      actorId,
      actorRole,
      remarks,
      latitude,
      longitude,
      forceOverride
    );

    return successResponse({}, "Order status updated successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update order status";
    return errorResponse(message, null, 500);
  }
}
