import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/utils/api-response";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized", null, 401);
    }

    const logs = await db.notificationLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: { select: { fullName: true, email: true } },
      },
    });

    return successResponse(logs, "Notification logs retrieved");
  } catch {
    return errorResponse("Failed to retrieve notification logs", null, 500);
  }
}
