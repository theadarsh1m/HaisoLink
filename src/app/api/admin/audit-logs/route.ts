import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");
    const skip = (page - 1) * limit;

    const search = searchParams.get("search");

    const where: Prisma.AuditLogWhereInput = {
      ...(search && {
        OR: [
          { action: { contains: search, mode: "insensitive" } },
          { entity: { contains: search, mode: "insensitive" } },
          { admin: { fullName: { contains: search, mode: "insensitive" } } },
        ]
      })
    };

    const [logs, total] = await Promise.all([
      db.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          admin: {
            select: { fullName: true, email: true }
          }
        }
      }),
      db.auditLog.count({ where }),
    ]);

    const formattedLogs = logs.map(log => ({
      id: log.id,
      admin: log.admin.fullName,
      email: log.admin.email,
      action: log.action,
      entity: log.entity,
      entityId: log.entityId,
      oldValue: log.oldValue ? JSON.stringify(log.oldValue) : "-",
      newValue: log.newValue ? JSON.stringify(log.newValue) : "-",
      ipAddress: log.ipAddress || "-",
      createdAt: log.createdAt,
    }));

    return NextResponse.json({
      logs: formattedLogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Audit Logs API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}
