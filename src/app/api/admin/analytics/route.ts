import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subDays, format, startOfDay, endOfDay } from "date-fns";

export async function GET() {
  try {
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(new Date(), i);
      return {
        date: format(d, "MMM dd"),
        start: startOfDay(d),
        end: endOfDay(d),
      };
    }).reverse();

    // Orders Per Day & Revenue Trend
    const ordersPerDayData = await Promise.all(
      last7Days.map(async (day) => {
        const result = await db.order.aggregate({
          where: {
            createdAt: {
              gte: day.start,
              lte: day.end,
            },
          },
          _count: { id: true },
          _sum: { totalCharge: true },
        });

        return {
          date: day.date,
          orders: result._count.id,
          revenue: result._sum.totalCharge || 0,
        };
      })
    );

    // Delivery Status Distribution
    const statusGroups = await db.order.groupBy({
      by: ["status"],
      _count: { id: true },
    });
    
    const deliveryStatusDistribution = statusGroups.map((g) => ({
      name: g.status,
      value: g._count.id,
    }));

    // Orders By Zone (Pickup Zone)
    const zones = await db.zone.findMany({
      include: {
        areas: {
          include: {
            _count: {
              select: { pickupOrders: true }
            }
          }
        }
      }
    });

    const ordersByZone = zones.map((zone) => {
      const count = zone.areas.reduce((sum, area) => sum + area._count.pickupOrders, 0);
      return {
        name: zone.name,
        orders: count,
      };
    });

    // B2B vs B2C
    const b2bVsB2cGroups = await db.order.groupBy({
      by: ["orderType"],
      _count: { id: true },
    });
    const b2bVsB2c = b2bVsB2cGroups.map((g) => ({
      name: g.orderType,
      value: g._count.id,
    }));

    // COD vs Prepaid
    const paymentGroups = await db.order.groupBy({
      by: ["paymentType"],
      _count: { id: true },
    });
    const codVsPrepaid = paymentGroups.map((g) => ({
      name: g.paymentType,
      value: g._count.id,
    }));

    // Delivery Success Rate
    const totalFinished = await db.order.count({
      where: {
        status: { in: ["DELIVERED", "FAILED"] }
      }
    });
    const totalDelivered = await db.order.count({
      where: { status: "DELIVERED" }
    });
    const deliverySuccessRate = totalFinished > 0 
      ? Math.round((totalDelivered / totalFinished) * 100) 
      : 0;

    return NextResponse.json({
      ordersPerDay: ordersPerDayData,
      revenueTrend: ordersPerDayData, // Same data structure can be used for Area Chart
      deliveryStatusDistribution,
      ordersByZone,
      deliverySuccessRate,
      b2bVsB2c,
      codVsPrepaid,
    });
  } catch (error) {
    console.error("Analytics API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
