import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/utils/api-response";
import { db } from "@/lib/db";
import { preferencesSchema } from "@/validations/notification";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return errorResponse("Unauthorized", null, 401);
    }

    let prefs = await db.notificationPreference.findUnique({
      where: { userId: session.user.id },
    });

    if (!prefs) {
      prefs = await db.notificationPreference.create({
        data: { userId: session.user.id },
      });
    }

    return successResponse(prefs, "Preferences retrieved");
  } catch {
    return errorResponse("Failed to retrieve preferences", null, 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return errorResponse("Unauthorized", null, 401);
    }

    const body = await request.json();
    const result = preferencesSchema.safeParse(body);
    if (!result.success) {
      return errorResponse("Invalid input", result.error.format(), 400);
    }

    const prefs = await db.notificationPreference.upsert({
      where: { userId: session.user.id },
      update: result.data,
      create: { userId: session.user.id, ...result.data },
    });

    return successResponse(prefs, "Preferences updated");
  } catch {
    return errorResponse("Failed to update preferences", null, 500);
  }
}
