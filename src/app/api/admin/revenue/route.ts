import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { db } from "@/lib/db";
import { subDays, startOfDay, endOfDay, subWeeks, subMonths } from "date-fns";

export const GET = withAuth(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "daily"; // daily, weekly, monthly

    let startDate = startOfDay(new Date());
    const endDate = endOfDay(new Date());

    if (range === "weekly") {
      startDate = startOfDay(subWeeks(new Date(), 1));
    } else if (range === "monthly") {
      startDate = startOfDay(subMonths(new Date(), 1));
    } else {
      // default to last 30 days for general view if unspecified or daily
      startDate = startOfDay(subDays(new Date(), 30));
    }

    const orders = await db.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        orderType: true,
        paymentType: true,
        totalCharge: true,
      }
    });

    let totalRevenue = 0;
    let standardRevenue = 0;
    let expressRevenue = 0;
    let codRevenue = 0;
    let prepaidRevenue = 0;

    orders.forEach((order) => {
      totalRevenue += order.totalCharge;
      if (order.orderType === "B2B") standardRevenue += order.totalCharge;
      if (order.orderType === "B2C") expressRevenue += order.totalCharge;
      if (order.paymentType === "COD") codRevenue += order.totalCharge;
      if (order.paymentType === "PREPAID") prepaidRevenue += order.totalCharge;
    });

    return NextResponse.json({
      totalRevenue,
      splits: {
        b2b: standardRevenue,
        b2c: expressRevenue,
        cod: codRevenue,
        prepaid: prepaidRevenue,
      }
    });
  } catch (error) {
    console.error("Revenue API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch revenue" },
      { status: 500 }
    );
  }
}, ["ADMIN"]);
