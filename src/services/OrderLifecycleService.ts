import { db } from "@/lib/db";
import { OrderStatus, Role } from "@prisma/client";
import { TrackingRepository } from "@/repositories/TrackingRepository";
import { DeliveryRepository } from "@/repositories/DeliveryRepository";
import { RescheduleRepository } from "@/repositories/RescheduleRepository";

const trackingRepo = new TrackingRepository();
const deliveryRepo = new DeliveryRepository();
const rescheduleRepo = new RescheduleRepository();

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  CREATED: ["ASSIGNED", "CANCELLED"],
  ASSIGNED: ["PICKED_UP", "CANCELLED"],
  PICKED_UP: ["IN_TRANSIT"],
  IN_TRANSIT: ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED", "FAILED"],
  FAILED: ["RESCHEDULED"],
  RESCHEDULED: ["ASSIGNED"],
  CANCELLED: [],
  DELIVERED: [],
};

export class OrderLifecycleService {
  async transitionStatus(
    orderId: string,
    nextStatus: OrderStatus,
    actorId: string,
    actorRole: Role,
    remarks?: string,
    latitude?: number,
    longitude?: number,
    forceOverride = false
  ): Promise<boolean> {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { customer: true },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === nextStatus) {
      throw new Error("Duplicate submission: Order is already in this status");
    }

    if (forceOverride) {
      if (actorRole !== "ADMIN") {
        throw new Error("Access Denied: Only administrators can override order statuses");
      }
    } else {
      const allowed = ALLOWED_TRANSITIONS[order.status] || [];
      if (!allowed.includes(nextStatus)) {
        throw new Error(`Invalid status transition from ${order.status} to ${nextStatus}`);
      }

      if (actorRole === "DELIVERY_AGENT") {
        if (order.assignedAgentId !== actorId) {
          throw new Error("Access Denied: You are not the assigned agent for this order");
        }
      } else if (actorRole === "CUSTOMER") {
        if (order.customer.userId !== actorId) {
          throw new Error("Access Denied: You are not authorized to update this order");
        }
        if (nextStatus !== "CANCELLED" && nextStatus !== "RESCHEDULED") {
          throw new Error("Access Denied: Customers can only cancel or reschedule orders");
        }
      }
    }

    await db.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: nextStatus },
      });

      await trackingRepo.createHistory(
        orderId,
        {
          previousStatus: order.status,
          newStatus: nextStatus,
          changedBy: actorId,
          remarks: forceOverride ? `[ADMIN OVERRIDE] ${remarks || ""}` : remarks,
          latitude,
          longitude,
        },
        tx
      );
    });

    return true;
  }

  async failAttempt(
    orderId: string,
    reason: string,
    notes: string | undefined,
    actorId: string,
    actorRole: Role
  ): Promise<boolean> {
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (actorRole !== "ADMIN" && order.status !== "OUT_FOR_DELIVERY") {
      throw new Error("Invalid State: Order must be OUT_FOR_DELIVERY to record a failed attempt");
    }

    if (actorRole === "DELIVERY_AGENT" && order.assignedAgentId !== actorId) {
      throw new Error("Access Denied: You are not the assigned agent for this order");
    }

    await db.$transaction(async (tx) => {
      const attemptsCount = await tx.deliveryAttempt.count({
        where: { orderId },
      });

      const nextAttemptNumber = attemptsCount + 1;

      await deliveryRepo.createAttempt(
        orderId,
        {
          attemptNumber: nextAttemptNumber,
          reason,
          notes,
        },
        tx
      );

      await tx.order.update({
        where: { id: orderId },
        data: { status: "FAILED" },
      });

      await trackingRepo.createHistory(
        orderId,
        {
          previousStatus: order.status,
          newStatus: "FAILED",
          changedBy: actorId,
          remarks: `Delivery attempt ${nextAttemptNumber} failed: ${reason}. Notes: ${notes || ""}`,
        },
        tx
      );
    });

    return true;
  }

  async deliverOrder(
    orderId: string,
    proof: {
      recipientName: string;
      otp?: string;
      signaturePath?: string;
      photoUrl?: string;
      notes?: string;
    },
    actorId: string,
    actorRole: Role
  ): Promise<boolean> {
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (actorRole !== "ADMIN" && order.status !== "OUT_FOR_DELIVERY") {
      throw new Error("Invalid State: Order must be OUT_FOR_DELIVERY to be delivered");
    }

    if (actorRole === "DELIVERY_AGENT" && order.assignedAgentId !== actorId) {
      throw new Error("Access Denied: You are not the assigned agent for this order");
    }

    await db.$transaction(async (tx) => {
      await deliveryRepo.createProof(orderId, proof, tx);

      await tx.order.update({
        where: { id: orderId },
        data: { status: "DELIVERED" },
      });

      await trackingRepo.createHistory(
        orderId,
        {
          previousStatus: order.status,
          newStatus: "DELIVERED",
          changedBy: actorId,
          remarks: `Order delivered to recipient: ${proof.recipientName}`,
        },
        tx
      );
    });

    return true;
  }

  async rescheduleOrder(
    orderId: string,
    requestedDate: Date,
    reason: string,
    actorId: string,
    actorRole: Role
  ): Promise<boolean> {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { customer: true },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (actorRole !== "ADMIN" && order.status !== "FAILED") {
      throw new Error("Invalid State: Order must be in FAILED status to request rescheduling");
    }

    if (actorRole === "CUSTOMER" && order.customer.userId !== actorId) {
      throw new Error("Access Denied: You are not authorized to reschedule this order");
    }

    await db.$transaction(async (tx) => {
      await rescheduleRepo.createReschedule(orderId, requestedDate, reason, tx);

      await tx.order.update({
        where: { id: orderId },
        data: { status: "RESCHEDULED" },
      });

      await trackingRepo.createHistory(
        orderId,
        {
          previousStatus: order.status,
          newStatus: "RESCHEDULED",
          changedBy: actorId,
          remarks: `Rescheduled for ${requestedDate.toLocaleDateString()}: ${reason}`,
        },
        tx
      );
    });

    return true;
  }
}
