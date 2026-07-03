import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { db } from "@/lib/db";

export const GET = withAuth(async (request, user) => {
  try {
    if (user.role !== "CUSTOMER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const customerProfile = await db.customerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!customerProfile) {
      return NextResponse.json(
        { error: "Customer profile not found" },
        { status: 404 }
      );
    }

    const orders = await db.order.findMany({
      where: { customerId: customerProfile.id },
      include: {
        pickupArea: true,
        destinationArea: true,
        trackingHistories: {
          orderBy: { timestamp: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
});
