import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || session.user.role !== "DELIVERY_AGENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const active = searchParams.get("active"); // true if wanting ASSIGNED, PICKED_UP, IN_TRANSIT, OUT_FOR_DELIVERY

    const agentProfile = await db.deliveryAgentProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (!agentProfile) {
      return NextResponse.json({ error: "Agent profile not found" }, { status: 404 });
    }

    let statusFilter = {};
    if (active === "true") {
      statusFilter = {
        in: [
          OrderStatus.ASSIGNED,
          OrderStatus.PICKED_UP,
          OrderStatus.IN_TRANSIT,
          OrderStatus.OUT_FOR_DELIVERY
        ]
      };
    } else if (status) {
      statusFilter = status;
    }

    const orders = await db.order.findMany({
      where: {
        assignedAgentId: agentProfile.id,
        ...(Object.keys(statusFilter).length > 0 && { status: statusFilter as any })
      },
      include: {
        customer: { include: { user: true } },
        pickupArea: true,
        destinationArea: true
      },
      orderBy: { updatedAt: "desc" }
    });

    const formattedOrders = orders.map(order => ({
      id: order.id,
      trackingNumber: order.trackingNumber,
      client: order.customer.user.fullName,
      pickup: `${order.pickupArea.areaName}, ${order.pickupArea.city}`,
      destination: `${order.destinationArea.areaName}, ${order.destinationArea.city}`,
      packageType: order.orderType,
      weight: `${order.billableWeight} kg`,
      status: order.status,
      paymentType: order.paymentType,
      totalCharge: order.totalCharge,
      latitude: order.destinationArea.latitude,
      longitude: order.destinationArea.longitude
    }));

    return NextResponse.json(formattedOrders, { status: 200 });
  } catch (error) {
    console.error("Agent Orders API Error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
