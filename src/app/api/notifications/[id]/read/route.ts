import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/utils/api-response";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return errorResponse("Unauthorized", null, 401);
    }

    await db.notification.update({
      where: { id, userId: session.user.id },
      data: { isRead: true },
    });

    return successResponse({}, "Notification marked as read");
  } catch {
    return errorResponse("Failed to mark notification as read", null, 500);
  }
}
