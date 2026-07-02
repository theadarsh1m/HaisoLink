import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class AssignmentRepository {
  async create(data: Prisma.AgentAssignmentCreateInput) {
    return db.agentAssignment.create({ data });
  }

  async findByOrderId(orderId: string) {
    return db.agentAssignment.findMany({
      where: { orderId },
      include: {
        agent: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { assignedAt: "desc" },
    });
  }

  async findByAgentId(agentId: string) {
    return db.agentAssignment.findMany({
      where: { agentId },
      include: {
        order: true,
      },
      orderBy: { assignedAt: "desc" },
    });
  }

  async getActiveAgentAssignments(agentId: string) {
    return db.order.findMany({
      where: {
        assignedAgentId: agentId,
        status: {
          in: ["ASSIGNED", "PICKED_UP", "IN_TRANSIT"],
        },
      },
    });
  }
}
