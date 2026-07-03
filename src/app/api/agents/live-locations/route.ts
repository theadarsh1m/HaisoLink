import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { db } from "@/lib/db";

export const GET = withAuth(async (request, user) => {
  try {
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const agents = await db.deliveryAgentProfile.findMany({
      where: {
        availabilityStatus: "AVAILABLE",
        currentLatitude: { not: null },
        currentLongitude: { not: null },
      },
      include: {
        user: {
          select: { fullName: true },
        },
      },
    });

    const activeAgents = agents.map((agent) => ({
      id: agent.id,
      name: agent.user.fullName,
      vehicleType: agent.vehicleType,
      latitude: agent.currentLatitude,
      longitude: agent.currentLongitude,
      lastUpdate: agent.lastLocationUpdate,
    }));

    return NextResponse.json(activeAgents);
  } catch (error) {
    console.error("Live Agents API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch live agents" },
      { status: 500 }
    );
  }
});
