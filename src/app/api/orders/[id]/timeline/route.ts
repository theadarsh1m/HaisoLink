import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/utils/api-response";
import { TrackingRepository } from "@/repositories/TrackingRepository";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const trackingRepo = new TrackingRepository();

const STATUS_MAP: Record<string, string> = {
  CREATED: "Created",
  ASSIGNED: "Assigned",
  PICKED_UP: "Picked Up",
  IN_TRANSIT: "In Transit",
  OUT_FOR_DELIVERY: "Out For Delivery",
  DELIVERED: "Delivered",
  FAILED: "Failed",
  RESCHEDULED: "Rescheduled",
  CANCELLED: "Cancelled",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const actorFilter = searchParams.get("actor");

    const history = await trackingRepo.getTimeline(id);
    const userIds = history.map((h) => h.changedBy).filter((uid) => uid !== "SYSTEM");

    const users = await db.user.findMany({
      where: { id: { in: userIds } },
    });

    const userMap = new Map(users.map((u) => [u.id, u.fullName || u.role]));

    let formatted = history.map((h) => {
      let actor = "System";
      if (h.changedBy !== "SYSTEM") {
        actor = userMap.get(h.changedBy) || h.changedBy;
      }
      return {
        status: STATUS_MAP[h.newStatus] || h.newStatus,
        timestamp: h.timestamp.toISOString(),
        actor,
        remarks: h.remarks,
        latitude: h.latitude,
        longitude: h.longitude,
      };
    });

    if (actorFilter) {
      formatted = formatted.filter((item) =>
        item.actor.toLowerCase().includes(actorFilter.toLowerCase())
      );
    }

    return successResponse(formatted, "Timeline retrieved successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to retrieve timeline";
    return errorResponse(message, null, 500);
  }
}
