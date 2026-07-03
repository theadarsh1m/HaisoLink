import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Search
    const search = searchParams.get("search");

    const where: Prisma.DeliveryAgentProfileWhereInput = {
      ...(search && {
        user: {
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        },
      }),
    };

    const [agents, total] = await Promise.all([
      db.deliveryAgentProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { totalDeliveries: "desc" },
          { averageRating: "desc" }
        ],
        include: {
          user: true,
          zone: true,
          orders: {
            select: { status: true }
          }
        },
      }),
      db.deliveryAgentProfile.count({ where }),
    ]);

    // Format for frontend leaderboard
    const formattedAgents = agents.map((agent) => {
      const completed = agent.orders.filter(o => o.status === "DELIVERED").length;
      const failed = agent.orders.filter(o => o.status === "FAILED").length;
      
      return {
        id: agent.id,
        name: agent.user.fullName,
        email: agent.user.email,
        phone: agent.user.phoneNumber || "N/A",
        vehicleType: agent.vehicleType,
        status: agent.availabilityStatus,
        zone: agent.zone?.name || "Unassigned",
        completedDeliveries: completed,
        failedDeliveries: failed,
        rating: agent.averageRating || 0,
      };
    });

    return NextResponse.json({
      agents: formattedAgents,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Agents API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}
