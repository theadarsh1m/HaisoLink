import { successResponse, errorResponse } from "@/utils/api-response";
import { AgentRepository } from "@/repositories/AgentRepository";

const agentRepo = new AgentRepository();

export async function GET() {
  try {
    const agents = await agentRepo.findAvailableAll();
    const formatted = agents.map((agent) => ({
      id: agent.id,
      fullName: agent.user.fullName,
      vehicleType: agent.vehicleType,
      currentLatitude: agent.currentLatitude,
      currentLongitude: agent.currentLongitude,
      activeDeliveries: agent.orders.length,
      averageRating: agent.averageRating,
    }));
    return successResponse(formatted, "Available agents retrieved successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to retrieve available agents";
    return errorResponse(message, null, 500);
  }
}
