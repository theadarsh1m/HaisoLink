import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { db } from "@/lib/db";
import { z } from "zod";
import { NotificationService } from "@/services/NotificationService";
import { AssignmentService } from "@/services/AssignmentService";

const orderSchema = z.object({
  customerId: z.string().uuid().optional(),
  pickupAreaId: z.string().min(1),
  destinationAreaId: z.string().min(1),
  orderType: z.enum(["B2B", "B2C"]),
  paymentType: z.enum(["PREPAID", "COD"]),
  packageLength: z.number().positive(),
  packageWidth: z.number().positive(),
  packageHeight: z.number().positive(),
  actualWeight: z.number().positive(),
  shippingCharge: z.number().min(0),
  CODCharge: z.number().min(0),
  totalCharge: z.number().min(0),
});

export const POST = withAuth(async (request, user) => {
  try {
    if (user.role !== "CUSTOMER" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const result = orderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid order data", details: result.error.issues },
        { status: 400 }
      );
    }

    let targetUserId = user.id;

    if (user.role === "ADMIN") {
      if (!result.data.customerId) {
        return NextResponse.json({ error: "Admin must provide a customerId to create an order" }, { status: 400 });
      }
      
      const targetCustomer = await db.customerProfile.findUnique({
        where: { id: result.data.customerId },
        include: { user: true },
      });
      
      if (!targetCustomer) {
        return NextResponse.json({ error: "Customer profile not found" }, { status: 404 });
      }
      targetUserId = targetCustomer.userId;
    }

    let customerProfile = await db.customerProfile.findUnique({
      where: { userId: targetUserId },
      include: { user: true },
    });

    if (!customerProfile) {
      // Lazily create profile if missing (e.g. they registered via OAuth)
      customerProfile = await db.customerProfile.create({
        data: {
          userId: targetUserId,
          defaultAddress: "",
        },
        include: { user: true },
      });
    }

    const trackingNumber = `HL-${Math.floor(1000 + Math.random() * 9000)}`;
    const volumetricWeight = (result.data.packageLength * result.data.packageWidth * result.data.packageHeight) / 5000;
    const billableWeight = Math.max(result.data.actualWeight, volumetricWeight);

    const order = await db.order.create({
      data: {
        trackingNumber,
        customerId: customerProfile.id,
        pickupAreaId: result.data.pickupAreaId,
        destinationAreaId: result.data.destinationAreaId,
        orderType: result.data.orderType,
        paymentType: result.data.paymentType,
        packageLength: result.data.packageLength,
        packageWidth: result.data.packageWidth,
        packageHeight: result.data.packageHeight,
        actualWeight: result.data.actualWeight,
        volumetricWeight,
        billableWeight,
        shippingCharge: result.data.shippingCharge,
        CODCharge: result.data.CODCharge,
        totalCharge: result.data.totalCharge,
        status: "CREATED",
        trackingHistories: {
          create: {
            newStatus: "CREATED",
            changedBy: user.name || "Customer",
            remarks: "Order created successfully",
          },
        },
      },
      include: {
        pickupArea: true,
        destinationArea: true,
      }
    });

    let assignedAgentProfile = null;

    // Trigger auto-assignment for the order
    try {
      const assignmentService = new AssignmentService();
      const agentId = await assignmentService.autoAssignAgent(order.id);
      
      // Fetch the assigned agent profile to include in the email
      assignedAgentProfile = await db.deliveryAgentProfile.findUnique({
        where: { id: agentId },
        include: { user: true }
      });
      
      // Update order status in the response
      order.status = "ASSIGNED";
    } catch (assignmentError) {
      console.warn("Auto-assignment failed, order remains CREATED:", assignmentError);
    }

    // Send email notifications in the background
    try {
      const notificationService = new NotificationService();
      
      await notificationService.sendOrderCreated(order, customerProfile);
      
      if (assignedAgentProfile && order.status === "ASSIGNED") {
         await notificationService.sendOrderAssigned(order, customerProfile, assignedAgentProfile);
      }
    } catch (notificationError) {
      console.error("Failed to trigger email notifications:", notificationError);
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Create Order Error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
});
