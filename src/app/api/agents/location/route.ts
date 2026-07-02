import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/utils/api-response";
import { LocationRepository } from "@/repositories/LocationRepository";
import { locationUpdateSchema } from "@/validations/agent";

const locationRepo = new LocationRepository();

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    const body = await request.json();

    const result = locationUpdateSchema.safeParse(body);
    if (!result.success) {
      return errorResponse("Invalid input coordinates", result.error.format(), 400);
    }

    const { latitude, longitude } = result.data;
    let userId = session?.user?.id;

    if (!userId) {
      const parsedBody = body as { userId?: string; agentId?: string };
      userId = parsedBody.userId;

      if (!userId && parsedBody.agentId) {
        await locationRepo.updateAgentLocation(parsedBody.agentId, latitude, longitude);
        return successResponse({}, "Agent location updated successfully");
      }
    }

    if (!userId) {
      return errorResponse("Unauthorized", null, 401);
    }

    await locationRepo.updateAgentLocationByUserId(userId, latitude, longitude);
    return successResponse({}, "Agent location updated successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update location";
    return errorResponse(message, null, 500);
  }
}
