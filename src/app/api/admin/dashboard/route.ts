import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { startOfDay, endOfDay } from "date-fns";
import { withAuth } from "@/lib/api-middleware";

export const GET = withAuth(async (request) => {
  try {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const [
      todaysOrders,
      todaysRevenueResult,
      activeDeliveries,
      deliveredOrders,
      failedDeliveries,
      availableAgents,
      busyAgents,
      offlineAgents,
      pendingAssignments,
    ] = await Promise.all([
      db.order.count({
        where: {
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      }),
      db.order.aggregate({
        where: {
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
        _sum: {
          totalCharge: true,
        },
      }),
      db.order.count({
        where: {
          status: {
            in: ["IN_TRANSIT", "OUT_FOR_DELIVERY"],
          },
        },
      }),
      db.order.count({
        where: {
          status: "DELIVERED",
        },
      }),
      db.order.count({
        where: {
          status: "FAILED",
        },
      }),
      db.deliveryAgentProfile.count({
        where: {
          availabilityStatus: "AVAILABLE",
        },
      }),
      db.deliveryAgentProfile.count({
        where: {
          availabilityStatus: "BUSY",
        },
      }),
      db.deliveryAgentProfile.count({
        where: {
          availabilityStatus: "OFFLINE",
        },
      }),
      db.order.count({
        where: {
          status: "CREATED",
          assignedAgentId: null,
        },
      }),
    ]);

    return NextResponse.json({
      todaysOrders,
      todaysRevenue: todaysRevenueResult._sum.totalCharge || 0,
      activeDeliveries,
      deliveredOrders,
      failedDeliveries,
      availableAgents,
      busyAgents,
      offlineAgents,
      pendingAssignments,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}, ["ADMIN"]);
