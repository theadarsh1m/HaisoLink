import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class DeliveryRepository {
  async createProof(
    orderId: string,
    data: {
      recipientName: string;
      otp?: string;
      signaturePath?: string;
      photoUrl?: string;
      notes?: string;
    },
    tx?: Prisma.TransactionClient
  ) {
    const client = tx || db;
    return client.deliveryProof.create({
      data: {
        orderId,
        recipientName: data.recipientName,
        otp: data.otp || null,
        signaturePath: data.signaturePath || null,
        photoUrl: data.photoUrl || null,
        notes: data.notes || null,
      },
    });
  }

  async createAttempt(
    orderId: string,
    data: {
      attemptNumber: number;
      reason: string;
      notes?: string;
    },
    tx?: Prisma.TransactionClient
  ) {
    const client = tx || db;
    return client.deliveryAttempt.create({
      data: {
        orderId,
        attemptNumber: data.attemptNumber,
        reason: data.reason,
        notes: data.notes || null,
      },
    });
  }

  async getAttemptsCount(orderId: string): Promise<number> {
    return db.deliveryAttempt.count({
      where: { orderId },
    });
  }

  async getAttempts(orderId: string) {
    return db.deliveryAttempt.findMany({
      where: { orderId },
      orderBy: { timestamp: "asc" },
    });
  }

  async getProof(orderId: string) {
    return db.deliveryProof.findUnique({
      where: { orderId },
    });
  }
}
