import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/utils/api-response";
import { OrderLifecycleService } from "@/services/OrderLifecycleService";
import { rescheduleSchema } from "@/validations/workflow";
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

    const result = rescheduleSchema.safeParse(body);
    if (!result.success) {
      return errorResponse("Invalid reschedule parameters", result.error.format(), 400);
    }

    const { requestedDate, reason } = result.data;
    const dateObj = new Date(requestedDate);

    let actorId = session?.user?.id;
    let actorRole = session?.user?.role as Role;

    if (!actorId) {
      const parsed = body as { actorId?: string; actorRole?: Role };
      actorId = parsed.actorId;
      actorRole = parsed.actorRole || "CUSTOMER";
    }

    if (!actorId) {
      return errorResponse("Unauthorized", null, 401);
    }

    await lifecycleService.rescheduleOrder(id, dateObj, reason, actorId, actorRole);
    return successResponse({}, "Order rescheduled successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to reschedule order";
    return errorResponse(message, null, 500);
  }
}
