import { db } from "@/lib/db";
import { Prisma, AvailabilityStatus } from "@prisma/client";

export class AgentRepository {
  async findById(id: string) {
    return db.deliveryAgentProfile.findUnique({
      where: { id },
      include: {
        user: true,
        zone: true,
        assignments: true,
        orders: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return db.deliveryAgentProfile.findUnique({
      where: { userId },
      include: {
        user: true,
        zone: true,
      },
    });
  }

  async create(data: Prisma.DeliveryAgentProfileCreateInput) {
    return db.deliveryAgentProfile.create({ data });
  }

  async update(id: string, data: Prisma.DeliveryAgentProfileUpdateInput) {
    return db.deliveryAgentProfile.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return db.deliveryAgentProfile.delete({
      where: { id },
    });
  }

  async updateAvailability(id: string, availabilityStatus: AvailabilityStatus) {
    return db.deliveryAgentProfile.update({
      where: { id },
      data: { availabilityStatus },
    });
  }

  async updateAvailabilityByUserId(userId: string, availabilityStatus: AvailabilityStatus) {
    return db.deliveryAgentProfile.update({
      where: { userId },
      data: { availabilityStatus },
    });
  }

  async findAvailableInZone(zoneId: string) {
    return db.deliveryAgentProfile.findMany({
      where: {
        availabilityStatus: "AVAILABLE",
        zoneId,
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

  async findAvailableAll() {
    return db.deliveryAgentProfile.findMany({
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

  async findAll(filters?: { availabilityStatus?: AvailabilityStatus; zoneId?: string; vehicleType?: string }) {
    return db.deliveryAgentProfile.findMany({
      where: filters,
      include: {
        user: true,
        zone: true,
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
}
