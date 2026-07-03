import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { logger } from "@/lib/logger";
import { APIError } from "@/lib/errors";

export type Role = "ADMIN" | "DELIVERY_AGENT" | "CUSTOMER";

export function withAuth(
  handler: (req: Request, user: any, context?: any) => Promise<NextResponse>,
  allowedRoles?: Role[]
) {
  return async (req: Request, context?: any) => {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session || !session.user) {
        logger.warn(`Unauthorized access attempt to ${req.url}`);
        return NextResponse.json(
          { error: "Authentication Required" },
          { status: 401 }
        );
      }

      if (allowedRoles && !allowedRoles.includes(session.user.role as Role)) {
        logger.warn(
          `Forbidden access attempt to ${req.url} by user ${session.user.id} (${session.user.role})`
        );
        return NextResponse.json(
          { error: "Permission Denied" },
          { status: 403 }
        );
      }

      // Log successful access for tracing
      logger.http(`[${req.method}] ${req.url} accessed by ${session.user.id}`);

      return await handler(req, session.user, context);
    } catch (error: any) {
      if (error instanceof APIError) {
        logger.warn(`[${req.method}] ${req.url} - ${error.name}: ${error.message}`);
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }

      logger.error(`[${req.method}] ${req.url} - Internal Server Error: ${error?.message || error}`);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  };
}
