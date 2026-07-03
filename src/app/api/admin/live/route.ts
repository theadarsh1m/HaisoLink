import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { db } from "@/lib/db";
import { startOfDay, endOfDay } from "date-fns";

// Ensure this route is evaluated dynamically (no caching)
export const dynamic = "force-dynamic";

export const GET = withAuth(async (request: Request) => {
  const encoder = new TextEncoder();

  // Create a stream
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = async () => {
        try {
          const todayStart = startOfDay(new Date());
          const todayEnd = endOfDay(new Date());

          const [
            ordersInTransit,
            ordersOutForDelivery,
            ordersDeliveredToday,
            ordersFailedToday,
          ] = await Promise.all([
            db.order.count({ where: { status: "IN_TRANSIT" } }),
            db.order.count({ where: { status: "OUT_FOR_DELIVERY" } }),
            db.order.count({
              where: {
                status: "DELIVERED",
                updatedAt: { gte: todayStart, lte: todayEnd },
              },
            }),
            db.order.count({
              where: {
                status: "FAILED",
                updatedAt: { gte: todayStart, lte: todayEnd },
              },
            }),
          ]);

          const data = JSON.stringify({
            ordersInTransit,
            ordersOutForDelivery,
            ordersDeliveredToday,
            ordersFailedToday,
          });

          if (request.signal.aborted) return;
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        } catch (error) {
          // Ignore errors caused by disconnected clients
          if (error instanceof TypeError && error.message.includes('closed')) return;
          console.error("SSE Live API Error:", error);
        }
      };

      // Send initial data immediately
      await sendEvent();

      // Setup polling interval (e.g., every 5 seconds) to simulate live events
      const intervalId = setInterval(sendEvent, 5000);

      // Clean up when connection closes
      request.signal.addEventListener("abort", () => {
        clearInterval(intervalId);
        controller.close();
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}, ["ADMIN"]);
