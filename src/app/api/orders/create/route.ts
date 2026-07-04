import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { db } from "@/lib/db";
import { z } from "zod";
import { NotificationService } from "@/services/NotificationService";

const orderSchema = z.object({
  pickupAreaId: z.string().min(1),
  destinationAreaId: z.string().min(1),
  orderType: z.enum(["STANDARD", "EXPRESS"]),
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
    if (user.role !== "CUSTOMER") {
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

    let customerProfile = await db.customerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!customerProfile) {
      // Lazily create profile if missing (e.g. they registered via OAuth)
      customerProfile = await db.customerProfile.create({
        data: {
          userId: user.id,
          defaultAddress: "",
        },
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

    // Send email notification in the background
    try {
      const notificationService = new NotificationService();
      // Attach user from session to the customer profile for the email service
      (customerProfile as any).user = user;
      await notificationService.sendOrderCreated(order, customerProfile);
    } catch (notificationError) {
      console.error("Failed to trigger order creation email:", notificationError);
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
