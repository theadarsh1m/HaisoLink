import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/utils/api-response";
import { OrderLifecycleService } from "@/services/OrderLifecycleService";
import { deliveryProofSchema } from "@/validations/workflow";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

const lifecycleService = new OrderLifecycleService();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: request.headers });
    const body = await request.json();

    const result = deliveryProofSchema.safeParse(body);
    if (!result.success) {
      return errorResponse("Invalid delivery proof parameters", result.error.format(), 400);
    }

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

    await lifecycleService.deliverOrder(id, result.data, actorId, actorRole);
    return successResponse({}, "Order marked as delivered successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to mark order as delivered";
    return errorResponse(message, null, 500);
  }
}
