import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export const GET = withAuth(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    // Filtering
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const orderType = searchParams.get("orderType");
    const paymentType = searchParams.get("paymentType");
    const trackingNumber = searchParams.get("trackingNumber");
    
    // Date Range
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: Prisma.OrderWhereInput = {
      ...(status && { status: status as any }),
      ...(orderType && { orderType: orderType as any }),
      ...(paymentType && { paymentType: paymentType as any }),
      ...(trackingNumber && { trackingNumber: { contains: trackingNumber, mode: "insensitive" } }),
      ...(startDate && endDate && {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
      ...(search && {
        OR: [
          { trackingNumber: { contains: search, mode: "insensitive" } },
          { customer: { user: { fullName: { contains: search, mode: "insensitive" } } } },
          { customer: { user: { email: { contains: search, mode: "insensitive" } } } },
        ],
      }),
    };

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          customer: {
            include: { user: true }
          },
          assignedAgent: {
            include: { user: true }
          },
          pickupArea: {
            include: { zone: true }
          },
          destinationArea: true,
        },
      }),
      db.order.count({ where }),
    ]);

    // Format for frontend
    const formattedOrders = orders.map(order => ({
      id: order.id,
      trackingNumber: order.trackingNumber,
      customer: order.customer.user.fullName,
      pickup: `${order.pickupArea.areaName}, ${order.pickupArea.city}`,
      destination: `${order.destinationArea.areaName}, ${order.destinationArea.city}`,
      agent: order.assignedAgent?.user.fullName || "Unassigned",
      orderType: order.orderType,
      paymentType: order.paymentType,
      status: order.status,
      totalCharge: order.totalCharge,
      createdAt: order.createdAt,
    }));

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Orders API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}, ["ADMIN"]);
