import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const start = Date.now();
    // Test DB connection
    await db.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - start;

    const memoryUsage = process.memoryUsage();
    
    return NextResponse.json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: {
        status: "connected",
        latency: `${dbLatency}ms`,
      },
      memory: {
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
      }
    });
  } catch (error: any) {
    logger.error(`Health check failed: ${error.message}`);
    
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        database: {
          status: "disconnected",
        },
      },
      { status: 503 }
    );
  }
}
