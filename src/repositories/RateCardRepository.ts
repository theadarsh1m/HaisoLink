import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class RateCardRepository {
  async findById(id: string) {
    return db.rateCard.findUnique({
      where: { id },
      include: {
        sourceZone: true,
        destinationZone: true,
      },
    });
  }

  async findPricing(sourceZoneId: string, destinationZoneId: string, orderType: Prisma.EnumOrderTypeFilter | "B2B" | "B2C") {
    return db.rateCard.findFirst({
      where: {
        sourceZoneId,
        destinationZoneId,
        orderType,
        isActive: true,
      },
    });
  }

  async create(data: Prisma.RateCardCreateInput) {
    return db.rateCard.create({ data });
  }

  async update(id: string, data: Prisma.RateCardUpdateInput) {
    return db.rateCard.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return db.rateCard.delete({
      where: { id },
    });
  }

  async findAll() {
    return db.rateCard.findMany({
      include: {
        sourceZone: true,
        destinationZone: true,
      },
    });
  }
}
