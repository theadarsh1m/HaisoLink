import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { db } from "@/lib/db";

export const GET = withAuth(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [zones, total] = await Promise.all([
      db.zone.findMany({
        skip,
        take: limit,
        include: {
          areas: {
            include: {
              pickupOrders: {
                select: {
                  status: true,
                  totalCharge: true,
                  billableWeight: true,
                  createdAt: true,
                  updatedAt: true,
                }
              }
            }
          }
        },
      }),
      db.zone.count(),
    ]);

    const formattedZones = zones.map((zone) => {
      let totalOrders = 0;
      let totalRevenue = 0;
      let failedOrders = 0;
      let totalWeight = 0;
      let totalDeliveryTimeMs = 0;
      let deliveredCount = 0;

      zone.areas.forEach((area) => {
        totalOrders += area.pickupOrders.length;
        area.pickupOrders.forEach((order) => {
          totalRevenue += order.totalCharge;
          totalWeight += order.billableWeight;
          
          if (order.status === "FAILED") failedOrders++;
          if (order.status === "DELIVERED") {
            deliveredCount++;
            // Approximate delivery time: updatedAt - createdAt
            totalDeliveryTimeMs += (new Date(order.updatedAt).getTime() - new Date(order.createdAt).getTime());
          }
        });
      });

      const failureRate = totalOrders > 0 ? ((failedOrders / totalOrders) * 100).toFixed(1) : 0;
      const avgWeight = totalOrders > 0 ? (totalWeight / totalOrders).toFixed(2) : 0;
      const avgCharge = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;
      
      let avgDeliveryHours = 0;
      if (deliveredCount > 0) {
        avgDeliveryHours = totalDeliveryTimeMs / deliveredCount / (1000 * 60 * 60);
      }

      return {
        id: zone.id,
        name: zone.name,
        orders: totalOrders,
        revenue: totalRevenue,
        avgDeliveryTime: avgDeliveryHours > 0 ? `${avgDeliveryHours.toFixed(1)} hrs` : "N/A",
        failureRate: `${failureRate}%`,
        avgWeight: `${avgWeight} kg`,
        avgCharge: `$${avgCharge}`,
      };
    });

    return NextResponse.json({
      zones: formattedZones,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Zones API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch zones" },
      { status: 500 }
    );
  }
}, ["ADMIN"]);
