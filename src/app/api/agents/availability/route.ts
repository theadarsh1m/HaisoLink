import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/utils/api-response";
import { AgentRepository } from "@/repositories/AgentRepository";
import { availabilityUpdateSchema } from "@/validations/agent";

const agentRepo = new AgentRepository();

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    const body = await request.json();

    const result = availabilityUpdateSchema.safeParse(body);
    if (!result.success) {
      return errorResponse("Invalid availability status", result.error.format(), 400);
    }

    const { status } = result.data;
    let userId = session?.user?.id;

    if (!userId) {
      const parsedBody = body as { userId?: string; agentId?: string };
      userId = parsedBody.userId;

      if (!userId && parsedBody.agentId) {
        await agentRepo.updateAvailability(parsedBody.agentId, status);
        return successResponse({}, "Agent availability updated successfully");
      }
    }

    if (!userId) {
      return errorResponse("Unauthorized", null, 401);
    }

    await agentRepo.updateAvailabilityByUserId(userId, status);
    return successResponse({}, "Agent availability updated successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update availability";
    return errorResponse(message, null, 500);
  }
}
