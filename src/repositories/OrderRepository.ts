import { db } from "@/lib/db";
import { Prisma, OrderStatus } from "@prisma/client";

export class OrderRepository {
  async findById(id: string) {
    return db.order.findUnique({
      where: { id },
      include: {
        customer: true,
        pickupArea: true,
        destinationArea: true,
        assignedAgent: true,
        trackingHistories: true,
        agentAssignments: true,
        reschedules: true,
      },
    });
  }

  async findByTrackingNumber(trackingNumber: string) {
    return db.order.findUnique({
      where: { trackingNumber },
      include: {
        customer: true,
        pickupArea: true,
        destinationArea: true,
        assignedAgent: true,
        trackingHistories: true,
      },
    });
  }

  async create(data: Prisma.OrderCreateInput) {
    return db.order.create({ data });
  }

  async update(id: string, data: Prisma.OrderUpdateInput) {
    return db.order.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return db.order.delete({
      where: { id },
    });
  }

  async findAll(filters?: { status?: OrderStatus | Prisma.EnumOrderStatusFilter; customerId?: string; assignedAgentId?: string }) {
    return db.order.findMany({
      where: filters,
      include: {
        customer: true,
        pickupArea: true,
        destinationArea: true,
        assignedAgent: true,
      },
    });
  }
}
