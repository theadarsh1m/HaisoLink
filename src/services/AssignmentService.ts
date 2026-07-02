import { db } from "@/lib/db";
import { calculateDistance } from "@/lib/haversine";

const DISTANCE_WEIGHT = 1;
const WORKLOAD_WEIGHT = 10;
const RATING_WEIGHT = 1;
const DEFAULT_DISTANCE_FALLBACK = 9999;

export class AssignmentService {
  async manualAssignAgent(orderId: string, agentId: string, dispatcherId: string): Promise<boolean> {
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    const agent = await db.deliveryAgentProfile.findUnique({
      where: { id: agentId },
      include: { user: true },
    });

    if (!agent) {
      throw new Error("Agent not found");
    }

    if (agent.availabilityStatus !== "AVAILABLE") {
      throw new Error("Agent is not available for assignment");
    }

    await db.$transaction(async (tx) => {
      await tx.agentAssignment.create({
        data: {
          orderId,
          agentId,
          assignedBy: dispatcherId,
          assignmentType: "MANUAL",
        },
      });

      await tx.order.update({
        where: { id: orderId },
        data: {
          assignedAgentId: agentId,
          status: "ASSIGNED",
        },
      });

      await tx.trackingHistory.create({
        data: {
          orderId,
          previousStatus: order.status,
          newStatus: "ASSIGNED",
          changedBy: dispatcherId,
          remarks: "Manual agent assignment",
        },
      });

      await tx.deliveryAgentProfile.update({
        where: { id: agentId },
        data: {
          availabilityStatus: "BUSY",
        },
      });
    });

    return true;
  }

  async autoAssignAgent(orderId: string): Promise<string> {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        pickupArea: true,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    const pickupArea = order.pickupArea;
    if (!pickupArea) {
      throw new Error("Pickup area is not defined for this order");
    }

    let candidateAgents = await db.deliveryAgentProfile.findMany({
      where: {
        availabilityStatus: "AVAILABLE",
        zoneId: pickupArea.zoneId,
      },
      include: {
        user: true,
        orders: {
          where: {
            status: {
              in: ["ASSIGNED", "PICKED_UP", "IN_TRANSIT"],
            },
          },
        },
      },
    });

    if (candidateAgents.length === 0) {
      candidateAgents = await db.deliveryAgentProfile.findMany({
        where: {
          availabilityStatus: "AVAILABLE",
        },
        include: {
          user: true,
          orders: {
            where: {
              status: {
                in: ["ASSIGNED", "PICKED_UP", "IN_TRANSIT"],
              },
            },
          },
        },
      });
    }

    if (candidateAgents.length === 0) {
      throw new Error("No agents available");
    }

    let bestAgent = candidateAgents[0];
    let lowestScore = Infinity;

    for (const agent of candidateAgents) {
      let distance = DEFAULT_DISTANCE_FALLBACK;
      if (agent.currentLatitude !== null && agent.currentLongitude !== null) {
        distance = calculateDistance(
          pickupArea.latitude,
          pickupArea.longitude,
          agent.currentLatitude,
          agent.currentLongitude
        );
      }

      const activeDeliveries = agent.orders.length;
      const averageRating = agent.averageRating || 0.0;

      const score =
        distance * DISTANCE_WEIGHT +
        activeDeliveries * WORKLOAD_WEIGHT -
        averageRating * RATING_WEIGHT;

      if (score < lowestScore) {
        lowestScore = score;
        bestAgent = agent;
      }
    }

    await db.$transaction(async (tx) => {
      await tx.agentAssignment.create({
        data: {
          orderId,
          agentId: bestAgent.id,
          assignedBy: "SYSTEM",
          assignmentType: "AUTO",
        },
      });

      await tx.order.update({
        where: { id: orderId },
        data: {
          assignedAgentId: bestAgent.id,
          status: "ASSIGNED",
        },
      });

      await tx.trackingHistory.create({
        data: {
          orderId,
          previousStatus: order.status,
          newStatus: "ASSIGNED",
          changedBy: "SYSTEM",
          remarks: "Automated routing assignment",
        },
      });

      await tx.deliveryAgentProfile.update({
        where: { id: bestAgent.id },
        data: {
          availabilityStatus: "BUSY",
        },
      });
    });

    return bestAgent.id;
  }
}
