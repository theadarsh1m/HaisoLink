import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { startOfDay, endOfDay, subWeeks, subMonths } from "date-fns";

export const GET = withAuth(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "daily"; // daily, weekly, monthly, custom
    const startDateStr = searchParams.get("startDate");
    const endDateStr = searchParams.get("endDate");
    
    let startDate: Date;
    let endDate: Date = endOfDay(new Date());

    if (type === "custom" && startDateStr && endDateStr) {
      startDate = startOfDay(new Date(startDateStr));
      endDate = endOfDay(new Date(endDateStr));
    } else if (type === "weekly") {
      startDate = startOfDay(subWeeks(new Date(), 1));
    } else if (type === "monthly") {
      startDate = startOfDay(subMonths(new Date(), 1));
    } else {
      startDate = startOfDay(new Date()); // daily
    }

    const where: Prisma.OrderWhereInput = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    const orders = await db.order.findMany({
      where,
      include: {
        customer: { include: { user: true } },
        assignedAgent: { include: { user: true } },
        pickupArea: { include: { zone: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const reportData = orders.map(o => ({
      Tracking_Number: o.trackingNumber,
      Customer: o.customer.user.fullName,
      Type: o.orderType,
      Payment: o.paymentType,
      Status: o.status,
      Weight: `${o.billableWeight} kg`,
      Charge: o.totalCharge,
      Agent: o.assignedAgent?.user.fullName || "Unassigned",
      Pickup_Zone: o.pickupArea.zone.name,
      Created_At: o.createdAt.toISOString(),
    }));

    return NextResponse.json({
      summary: {
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, o) => sum + o.totalCharge, 0),
        deliveredOrders: orders.filter(o => o.status === "DELIVERED").length,
        failedOrders: orders.filter(o => o.status === "FAILED").length,
      },
      data: reportData,
    });
  } catch (error) {
    console.error("Reports API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}, ["ADMIN"]);
