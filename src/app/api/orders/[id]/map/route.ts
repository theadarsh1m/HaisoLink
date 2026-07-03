import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { db } from "@/lib/db";
import { calculateETAFromCoords } from "@/lib/services/eta-service";

export const GET = withAuth(async (request, user, { params }) => {
  try {
    const { id } = await params;

    const order = await db.order.findFirst({
      where: {
        OR: [
          { id },
          { trackingNumber: id }
        ]
      },
      include: {
        pickupArea: true,
        destinationArea: true,
        assignedAgent: {
          select: {
            currentLatitude: true,
            currentLongitude: true,
            user: { select: { fullName: true } },
            vehicleType: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Authorization: Admin can view any, Customer can view their own, Agent can view their assigned
    if (
      user.role === "CUSTOMER" &&
      order.customerId !== user.customerProfile?.id
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    if (
      user.role === "DELIVERY_AGENT" &&
      order.assignedAgentId !== user.deliveryAgentProfile?.id
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const pickup = { lat: order.pickupArea.latitude, lng: order.pickupArea.longitude };
    const destination = { lat: order.destinationArea.latitude, lng: order.destinationArea.longitude };
    
    let agentLocation = null;
    let etaInfo = null;

    if (order.assignedAgent?.currentLatitude && order.assignedAgent?.currentLongitude) {
      agentLocation = {
        lat: order.assignedAgent.currentLatitude,
        lng: order.assignedAgent.currentLongitude,
        name: order.assignedAgent.user.fullName,
        vehicle: order.assignedAgent.vehicleType,
      };

      // Calculate ETA from agent's current location to destination
      etaInfo = await calculateETAFromCoords(
        { lat: agentLocation.lat, lng: agentLocation.lng },
        destination
      );
    } else {
      // If no agent, calculate ETA from pickup to destination
      etaInfo = await calculateETAFromCoords(pickup, destination);
    }

    return NextResponse.json({
      pickup,
      destination,
      agentLocation,
      eta: etaInfo.etaMinutes,
      distanceKm: etaInfo.distanceKm,
      status: order.status,
    });
  } catch (error) {
    console.error("Order Map API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch map data" },
      { status: 500 }
    );
  }
});
