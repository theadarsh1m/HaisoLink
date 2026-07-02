import { db } from "@/lib/db";
import { Prisma, RescheduleStatus } from "@prisma/client";

export class RescheduleRepository {
  async createReschedule(
    orderId: string,
    requestedDate: Date,
    reason: string,
    tx?: Prisma.TransactionClient
  ) {
    const client = tx || db;
    return client.reschedule.create({
      data: {
        orderId,
        requestedDate,
        reason,
        status: "PENDING",
      },
    });
  }

  async findByOrderId(orderId: string) {
    return db.reschedule.findMany({
      where: { orderId },
      orderBy: { requestedDate: "desc" },
    });
  }

  async updateStatus(rescheduleId: string, status: RescheduleStatus, tx?: Prisma.TransactionClient) {
    const client = tx || db;
    return client.reschedule.update({
      where: { id: rescheduleId },
      data: { status },
    });
  }
}
