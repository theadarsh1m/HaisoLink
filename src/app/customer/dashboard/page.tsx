"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { NotificationPreferencesPanel } from "@/components/shared/NotificationPreferencesPanel";
import { StatCard } from "@/components/ui/stat-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import {
  Package,
  Compass,
  Award,
  Clock,
  Plus,
  ArrowRight,
  MapPin,
  Map,
  Calendar,
  X,
} from "lucide-react";

export default function CustomerDashboardPage() {
  const [activeTracker, setActiveTracker] = React.useState<any[]>([]);
  const [activeOrderId, setActiveOrderId] = React.useState<string | null>(null);
  const [activeTrackingNumber, setActiveTrackingNumber] = React.useState<string>("");

  const [orderStatus, setOrderStatus] = React.useState("OUT_FOR_DELIVERY");
  const [showReschedule, setShowReschedule] = React.useState(false);
  const [rescheduleDate, setRescheduleDate] = React.useState("");
  const [rescheduleReason, setRescheduleReason] = React.useState("");
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);

  const router = useRouter();
  const [myOrders, setMyOrders] = React.useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = React.useState(true);

  React.useEffect(() => {
    const fetchOrders = async () => {
      setIsLoadingOrders(true);
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((order: any) => ({
            id: order.trackingNumber,
            recipient: order.destinationArea?.areaName || "Package Delivery",
            address: `${order.destinationArea?.city || ""}, ${order.destinationArea?.state || ""}`.trim().replace(/^,|,$/, ""),
            status: order.status,
            estDelivery: new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
          }));
          setMyOrders(mapped);

          // Use most recent order for active tracker
          if (data.length > 0) {
            const latestOrder = data[0];
            setOrderStatus(latestOrder.status);
            setActiveOrderId(latestOrder.id);
            setActiveTrackingNumber(latestOrder.trackingNumber);
            
            if (latestOrder.trackingHistories) {
              const histories = latestOrder.trackingHistories.map((h: any, index: number) => ({
                id: h.id,
                title: h.newStatus,
                description: h.remarks || "Status updated",
                time: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: index === 0 ? "current" : "completed"
              }));
              setActiveTracker(histories);
            }
          }
        }
      } catch (e) {
        console.error("Failed to fetch customer orders", e);
      } finally {
        setIsLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  const handleSimulateFail = () => {
    setOrderStatus("FAILED");
    setActiveTracker(prev => [
      { id: `fail-${Date.now()}`, title: "Delivery Failed", description: "Attempt 1 failed: Customer Not Available. Notes: Nobody at home.", time: "Just now", status: "current" },
      ...prev.map(item => ({ ...item, status: "completed" as const })),
    ]);
    setStatusMessage("Simulated: Order status transitioned to FAILED");
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleDate || !rescheduleReason || !activeOrderId) return;
    try {
      const res = await fetch(`/api/orders/${activeOrderId}/reschedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestedDate: new Date(rescheduleDate).toISOString(),
          reason: rescheduleReason,
          actorRole: "CUSTOMER",
        }),
      });
      if (res.ok) {
        setOrderStatus("RESCHEDULED");
        setActiveTracker(prev => [
          { id: `res-${Date.now()}`, title: "RESCHEDULED", description: `Requested for ${rescheduleDate}: ${rescheduleReason}`, time: "Just now", status: "current" },
          ...prev.map(item => ({ ...item, status: "completed" as const })),
        ]);
        setShowReschedule(false);
        setStatusMessage("Order rescheduled successfully");
      } else {
        throw new Error("API call failed");
      }
    } catch {
      setOrderStatus("RESCHEDULED");
      setActiveTracker(prev => [
        { id: `res-${Date.now()}`, title: "Rescheduled", description: `Requested for ${rescheduleDate}: ${rescheduleReason} (Mock)`, time: "Just now", status: "current" },
        ...prev.map(item => ({ ...item, status: "completed" as const })),
      ]);
      setShowReschedule(false);
      setStatusMessage("Rescheduled (Mock mode)");
    }
  };

  React.useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  return (
    <DashboardLayout userRole="CUSTOMER" userEmail="customer@haisolink.com">
      <div className="space-y-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight">
                Welcome back, User!
              </h1>
              {statusMessage && (
                <span className="text-xs font-semibold px-3 py-1 bg-secondary text-foreground border border-border/30 rounded-lg">
                  {statusMessage}
                </span>
              )}
            </div>
            <p className="text-muted-foreground mt-1">
              Create shipments, monitor transit milestones, and manage recipient address book.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {orderStatus === "OUT_FOR_DELIVERY" && (
              <Button
                onClick={handleSimulateFail}
                variant="outline"
                className="font-bold border-rose-500/20 text-rose-600 hover:bg-rose-500/5 rounded-xl"
              >
                Simulate Delivery Fail
              </Button>
            )}
            <Button asChild className="font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/20">
              <Link href="/customer/new-order">
                <Plus className="h-4 w-4 mr-2" /> Book New Delivery
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="In-Transit Packages"
            value={orderStatus !== "DELIVERED" ? "1" : "0"}
            description="Actively moving toward destination"
            icon={<Package className="h-4 w-4 text-primary" />}
          />
          <StatCard
            title="Total Shipments"
            value="18"
            description="Lifetime successful dropoffs"
            icon={<Award className="h-4 w-4 text-emerald-500" />}
          />
          <StatCard
            title="Carbon Offset Saves"
            value="24.5 kg"
            description="Via bicycle routes dynamic selections"
            icon={<Compass className="h-4 w-4 text-blue-500" />}
          />
          <StatCard
            title="Pending Actions"
            value={orderStatus === "FAILED" ? "1" : "0"}
            description={orderStatus === "FAILED" ? "Reschedule required" : "No actions required"}
            icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="bg-card/65 backdrop-blur-md rounded-2xl border border-border/40 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border/40 mb-6">
                <div>
                  <h3 className="text-lg font-bold tracking-tight">Active Tracking</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-xs font-semibold text-primary">{activeTrackingNumber || "No Active Order"}</span>
                    {activeTrackingNumber && (
                      <Badge variant="outline" className="text-[10px] py-0 font-bold uppercase">
                        {orderStatus}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="p-2 bg-primary/10 text-primary rounded-xl border border-primary/20">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
              </div>
              
              {activeTracker.length > 0 ? (
                <Timeline items={activeTracker} />
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No tracking history yet.</p>
              )}

              <div className="pt-4 border-t border-border/40 space-y-2 mt-6">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Assigned Courier</p>
                <div className="flex items-center justify-between text-xs p-3 bg-secondary/10 rounded-xl border border-border/20">
                  <div>
                    <p className="font-bold text-foreground">Assigned dynamically</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Tracking live via Agent App</p>
                  </div>
                  <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 text-[10px] font-bold">
                    Est. Pickup: Auto
                  </Badge>
                </div>
              </div>

              {orderStatus === "FAILED" && (
                <div className="pt-4 border-t border-border/40 space-y-2 mt-4">
                  <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Failed Delivery Action</p>
                  <Button
                    onClick={() => setShowReschedule(true)}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                  >
                    <Calendar className="h-4 w-4" /> Reschedule Delivery
                  </Button>
                </div>
              )}

              {showReschedule && (
                <div className="p-4 bg-secondary/10 rounded-xl border border-border/30 space-y-3 mt-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase text-amber-600">Select New Delivery target</h4>
                    <Button variant="ghost" size="sm" onClick={() => setShowReschedule(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <input
                      type="date"
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      className="w-full bg-background border border-border/40 rounded-lg px-3 py-1.5 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Add rescheduling notes/reason..."
                      value={rescheduleReason}
                      onChange={(e) => setRescheduleReason(e.target.value)}
                      className="w-full bg-background border border-border/40 rounded-lg px-3 py-1.5 focus:outline-none"
                    />
                    <Button
                      onClick={handleRescheduleSubmit}
                      disabled={!rescheduleDate || !rescheduleReason}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs"
                    >
                      Confirm Rescheduling Request
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="pt-6 mt-6 border-t border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                <span className="text-xs font-semibold text-foreground/80">
                  {orderStatus === "RESCHEDULED" ? "Pending new target assignment" : "Est. delivery today, 6PM"}
                </span>
              </div>
              <Button size="sm" variant="ghost" className="text-xs font-bold text-primary p-0 hover:bg-transparent">
                Open Map <Map className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-card/65 backdrop-blur-md rounded-2xl border border-border/40 overflow-hidden shadow-sm flex flex-col justify-between">
            <div>
              <div className="p-6 border-b border-border/40 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold tracking-tight">Recent Shipments</h3>
                  <p className="text-xs text-muted-foreground">Detailed logs of your orders and receipts.</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs font-semibold text-primary hover:bg-primary/10">
                  Full History <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/40 bg-secondary/10">
                      <TableHead className="font-semibold text-xs tracking-wider">ORDER ID</TableHead>
                      <TableHead className="font-semibold text-xs tracking-wider">RECIPIENT</TableHead>
                      <TableHead className="font-semibold text-xs tracking-wider">ADDRESS</TableHead>
                      <TableHead className="font-semibold text-xs tracking-wider">STATUS</TableHead>
                      <TableHead className="font-semibold text-xs tracking-wider">DELIVERY DATE</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingOrders ? (
                      [1, 2, 3].map((i) => (
                        <TableRow key={i} className="border-border/25">
                          {[1, 2, 3, 4, 5].map((j) => (
                            <TableCell key={j}><div className="h-4 bg-secondary/50 rounded animate-pulse w-24" /></TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : myOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-10 text-sm">
                          No orders yet. <span className="text-primary font-medium cursor-pointer" onClick={() => router.push("/customer/new-order")}>Book your first delivery →</span>
                        </TableCell>
                      </TableRow>
                    ) : (
                    myOrders.map((order) => (
                      <TableRow 
                        key={order.id} 
                        className="border-border/25 hover:bg-secondary/20 cursor-pointer"
                        onClick={() => router.push(`/customer/tracking?trackingNumber=${order.id}`)}
                      >
                        <TableCell className="font-mono text-xs font-semibold text-foreground/90">{order.id}</TableCell>
                        <TableCell className="font-semibold text-xs">{order.recipient}</TableCell>
                        <TableCell className="text-xs font-medium text-muted-foreground">{order.address}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              order.status === "Delivered"
                                ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/20"
                                : order.status === "FAILED"
                                ? "bg-rose-500/10 text-rose-600 hover:bg-rose-500/10 border-rose-500/20"
                                : "bg-blue-500/10 text-blue-600 hover:bg-blue-500/10 border-blue-500/20"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{order.estDelivery}</TableCell>
                      </TableRow>
                    ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="p-4 border-t border-border/40 bg-secondary/10 text-center">
              <span className="text-xs font-medium text-muted-foreground">
                Pricing engine dynamically adjusts fees based on zone weights.
              </span>
            </div>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <NotificationPreferencesPanel />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
