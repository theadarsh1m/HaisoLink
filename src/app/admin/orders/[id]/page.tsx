import React from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { MapPin, User, Package, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      customer: { include: { user: true } },
      assignedAgent: { include: { user: true } },
      pickupArea: { include: { zone: true } },
      destinationArea: { include: { zone: true } },
      trackingHistories: { orderBy: { timestamp: "asc" } },
      reschedules: true,
      deliveryAttempts: true,
      deliveryProof: true,
    },
  });

  if (!order) {
    notFound();
  }

  const timelineItems: TimelineItem[] = order.trackingHistories.map((history) => ({
    id: history.id,
    title: history.newStatus,
    description: history.remarks || "Status updated",
    time: format(new Date(history.timestamp), "MMM dd, HH:mm"),
    status: "completed",
  }));

  // Ensure current status is at the top or clearly visible.
  return (
    <DashboardLayout userRole="ADMIN" userEmail="admin@haisolink.com">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              Order {order.trackingNumber}
              <Badge className="ml-2 text-sm">{order.status}</Badge>
            </h1>
            <p className="text-muted-foreground mt-1">
              Created on {format(new Date(order.createdAt), "MMMM do, yyyy HH:mm")}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Customer Details */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center space-y-0 gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm"><strong>Name:</strong> {order.customer.user.fullName}</p>
              <p className="text-sm"><strong>Email:</strong> {order.customer.user.email}</p>
              <p className="text-sm"><strong>Phone:</strong> {order.customer.user.phoneNumber}</p>
              <p className="text-sm"><strong>Type:</strong> {order.orderType}</p>
            </CardContent>
          </Card>

          {/* Delivery Details */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center space-y-0 gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Location Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="mb-4">
                <p className="text-sm font-semibold text-primary">Pickup</p>
                <p className="text-sm">{order.pickupArea.areaName}, {order.pickupArea.city}</p>
                <p className="text-xs text-muted-foreground">Zone: {order.pickupArea.zone.name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">Destination</p>
                <p className="text-sm">{order.destinationArea.areaName}, {order.destinationArea.city}</p>
                <p className="text-xs text-muted-foreground">Zone: {order.destinationArea.zone.name}</p>
              </div>
            </CardContent>
          </Card>

          {/* Charges & Package */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center space-y-0 gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Package & Charges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm"><strong>Weight:</strong> {order.billableWeight} kg</p>
              <p className="text-sm"><strong>Dimensions:</strong> {order.packageLength}x{order.packageWidth}x{order.packageHeight} cm</p>
              <div className="h-px bg-border/50 my-2" />
              <p className="text-sm"><strong>Shipping:</strong> ${order.shippingCharge.toFixed(2)}</p>
              <p className="text-sm"><strong>COD Charge:</strong> ${order.CODCharge.toFixed(2)}</p>
              <p className="text-sm font-bold text-lg mt-1">Total: ${order.totalCharge.toFixed(2)}</p>
              <Badge variant="outline">{order.paymentType}</Badge>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tracking Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {timelineItems.length > 0 ? (
                <Timeline items={timelineItems} />
              ) : (
                <p className="text-sm text-muted-foreground">No tracking history available yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Related Operations */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center space-y-0 gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Assigned Agent</CardTitle>
              </CardHeader>
              <CardContent>
                {order.assignedAgent ? (
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Name:</strong> {order.assignedAgent.user.fullName}</p>
                    <p className="text-sm"><strong>Vehicle:</strong> {order.assignedAgent.vehicleType} ({order.assignedAgent.licenseNumber})</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No agent assigned.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 flex flex-row items-center space-y-0 gap-2">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Delivery Attempts</CardTitle>
              </CardHeader>
              <CardContent>
                {order.deliveryAttempts.length > 0 ? (
                  <ul className="space-y-3">
                    {order.deliveryAttempts.map(attempt => (
                      <li key={attempt.id} className="text-sm border-l-2 border-amber-500 pl-3">
                        <p className="font-semibold">Attempt {attempt.attemptNumber}</p>
                        <p className="text-muted-foreground">{attempt.reason}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(attempt.timestamp), "MMM dd, HH:mm")}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No failed attempts recorded.</p>
                )}
              </CardContent>
            </Card>

            {order.deliveryProof && (
              <Card className="border-emerald-500/20 bg-emerald-500/5">
                <CardHeader className="pb-3 flex flex-row items-center space-y-0 gap-2 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <CardTitle className="text-lg">Delivery Proof</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm"><strong>Recipient:</strong> {order.deliveryProof.recipientName}</p>
                  {order.deliveryProof.notes && <p className="text-sm"><strong>Notes:</strong> {order.deliveryProof.notes}</p>}
                  <p className="text-xs text-muted-foreground">Delivered at {format(new Date(order.deliveryProof.timestamp), "MMM dd, yyyy HH:mm")}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
