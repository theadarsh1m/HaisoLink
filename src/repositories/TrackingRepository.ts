import { db } from "@/lib/db";
import { Prisma, OrderStatus } from "@prisma/client";

export class TrackingRepository {
  async createHistory(
    orderId: string,
    data: {
      previousStatus: OrderStatus | null;
      newStatus: OrderStatus;
      changedBy: string;
      remarks?: string;
      latitude?: number;
      longitude?: number;
    },
    tx?: Prisma.TransactionClient
  ) {
    const client = tx || db;
    return client.trackingHistory.create({
      data: {
        orderId,
        previousStatus: data.previousStatus,
        newStatus: data.newStatus,
        changedBy: data.changedBy,
        remarks: data.remarks || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
      },
    });
  }

  async getTimeline(orderId: string) {
    return db.trackingHistory.findMany({
      where: { orderId },
      orderBy: { timestamp: "asc" },
    });
  }
}
