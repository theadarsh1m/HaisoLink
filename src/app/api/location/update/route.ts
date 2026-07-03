import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { db } from "@/lib/db";
import { z } from "zod";

const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const POST = withAuth(async (request, user) => {
  try {
    if (user.role !== "DELIVERY_AGENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const result = locationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid location data" }, { status: 400 });
    }

    const { latitude, longitude } = result.data;

    // Assuming we have a way to get the agent profile ID from user ID
    const agentProfile = await db.deliveryAgentProfile.findUnique({
      where: { userId: user.id },
    });

    if (!agentProfile) {
       return NextResponse.json({ error: "Agent profile not found" }, { status: 404 });
    }

    await db.deliveryAgentProfile.update({
      where: { id: agentProfile.id },
      data: {
        currentLatitude: latitude,
        currentLongitude: longitude,
        lastLocationUpdate: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Location Update Error:", error);
    return NextResponse.json(
      { error: "Failed to update location" },
      { status: 500 }
    );
  }
});
