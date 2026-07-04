import { NextRequest, NextResponse } from "next/server";
import { NotificationService } from "@/services/NotificationService";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (dbUser?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    const body = await req.json();
    const { to, template } = body;

    if (!to || !template) {
      return NextResponse.json({ error: "Missing required fields: to, template" }, { status: 400 });
    }

    const notificationService = new NotificationService();

    const mockOrder = {
      id: "mock-order-id",
      trackingNumber: "TRK-TEST-123",
      pickupArea: { areaName: "Test Pickup Location" },
      destinationArea: { areaName: "Test Destination Location" },
      actualWeight: 5,
      totalCharge: 150,
      createdAt: new Date(),
    };

    const mockCustomer = {
      id: "mock-customer-id",
      companyName: "Test Company",
      user: {
        id: session.user.id,
        name: "Test User",
        email: to,
      }
    };
    
    const mockAgent = {
      id: "mock-agent-id",
      vehicleType: "Bike",
      user: {
        name: "Test Agent",
        phoneNumber: "1234567890",
      }
    };
    
    const mockProof = {
      recipientName: "Test Recipient",
      notes: "Left at front door",
    };

    switch (template) {
      case "ORDER_CREATED":
        await notificationService.sendOrderCreated(mockOrder, mockCustomer);
        break;
      case "ORDER_ASSIGNED":
        await notificationService.sendOrderAssigned(mockOrder, mockCustomer, mockAgent);
        break;
      case "ORDER_PICKED_UP":
        await notificationService.sendPickedUp(mockOrder, mockCustomer);
        break;
      case "ORDER_IN_TRANSIT":
        await notificationService.sendInTransit(mockOrder, mockCustomer);
        break;
      case "ORDER_OUT_FOR_DELIVERY":
        await notificationService.sendOutForDelivery(mockOrder, mockCustomer, mockAgent);
        break;
      case "ORDER_DELIVERED":
        await notificationService.sendDelivered(mockOrder, mockCustomer, mockProof);
        break;
      case "ORDER_FAILED":
        await notificationService.sendDeliveryFailed(mockOrder, mockCustomer, "Customer unavailable");
        break;
      case "ORDER_RESCHEDULED":
        await notificationService.sendRescheduled(mockOrder, mockCustomer, new Date(Date.now() + 86400000));
        break;
      default:
        return NextResponse.json({ error: "Invalid template" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `Test email for ${template} sent to ${to}` });
  } catch (error: any) {
    console.error("Test email API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
