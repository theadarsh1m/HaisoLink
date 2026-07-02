import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/utils/api-response";
import { AgentRepository } from "@/repositories/AgentRepository";
import { AvailabilityStatus } from "@prisma/client";

const agentRepo = new AgentRepository();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const zoneId = searchParams.get("zoneId") || undefined;
    const availabilityStatus = (searchParams.get("availabilityStatus") as AvailabilityStatus) || undefined;
    const vehicleType = searchParams.get("vehicleType") || undefined;

    const agents = await agentRepo.findAll({
      zoneId,
      availabilityStatus,
      vehicleType,
    });

    const formattedAgents = agents.map((agent) => ({
      id: agent.id,
      userId: agent.userId,
      fullName: agent.user.fullName,
      email: agent.user.email,
      phoneNumber: agent.user.phoneNumber,
      vehicleType: agent.vehicleType,
      licenseNumber: agent.licenseNumber,
      currentLatitude: agent.currentLatitude,
      currentLongitude: agent.currentLongitude,
      availabilityStatus: agent.availabilityStatus,
      zoneId: agent.zoneId,
      zoneName: agent.zone?.name || null,
      totalDeliveries: agent.totalDeliveries,
      averageRating: agent.averageRating,
      activeDeliveries: agent.orders.length,
      lastLocationUpdate: agent.lastLocationUpdate,
    }));

    return successResponse(formattedAgents, "Agents retrieved successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to retrieve agents";
    return errorResponse(message, null, 500);
  }
}
