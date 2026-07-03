import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { db } from "@/lib/db";

export const GET = withAuth(async (request, user, { params }) => {
  try {
    const { id } = await params;

    // Support both UUID and tracking number (e.g. HL-8094)
    const order = await db.order.findFirst({
      where: {
        OR: [
          { id },
          { trackingNumber: id }
        ]
      },
      include: {
        customer: true,
        pickupArea: true,
        destinationArea: true,
        assignedAgent: true,
        trackingHistories: {
          orderBy: { timestamp: "desc" },
        },
        agentAssignments: true,
        reschedules: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to retrieve order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
});
