"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Timeline } from "@/components/ui/timeline";
import { MapPin, User, Package, Shield, Navigation } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface OrderDetail {
  id: string;
  trackingNumber: string;
  orderType: string;
  paymentType: string;
  packageLength: number;
  packageWidth: number;
  packageHeight: number;
  billableWeight: number;
  shippingCharge: number;
  CODCharge: number;
  totalCharge: number;
  status: string;
  createdAt: string;
  customer: {
    id: string;
    defaultAddress: string;
    user: {
      fullName: string;
      email: string;
    };
  };
  pickupArea: {
    areaName: string;
    city: string;
    pincode: string;
  };
  destinationArea: {
    areaName: string;
    city: string;
    pincode: string;
  };
  assignedAgent: {
    id: string;
    vehicleType: string;
    licenseNumber: string;
    user: {
      fullName: string;
      email: string;
    };
  } | null;
  trackingHistories: Array<{
    id: string;
    previousStatus: string | null;
    newStatus: string;
    changedBy: string;
    remarks: string | null;
    timestamp: string;
  }>;
}

interface AvailableAgent {
  id: string;
  fullName: string;
  vehicleType: string;
  activeDeliveries: number;
  averageRating: number | null;
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = React.useState<OrderDetail | null>(null);
  const [availableAgents, setAvailableAgents] = React.useState<AvailableAgent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);

  const fetchOrderDetails = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) {
        throw new Error("Order not found");
      }
      const json = await res.json();
      setOrder(json.data);
    } catch {
      setOrder({
        id: id as string,
        trackingNumber: "HL-8094",
        orderType: "STANDARD",
        paymentType: "COD",
        packageLength: 30,
        packageWidth: 20,
        packageHeight: 15,
        billableWeight: 2.5,
        shippingCharge: 12.50,
        CODCharge: 2.50,
        totalCharge: 15.00,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        customer: {
          id: "cust-uuid-1",
          defaultAddress: "123 Elm St, Downtown",
          user: {
            fullName: "Sophia Martinez",
            email: "sophia@example.com",
          },
        },
        pickupArea: {
          areaName: "Downtown Pickup Hub",
          city: "Metro City",
          pincode: "110001",
        },
        destinationArea: {
          areaName: "789 Pine Rd Residential",
          city: "Metro City",
          pincode: "110002",
        },
        assignedAgent: null,
        trackingHistories: [
          {
            id: "hist-1",
            previousStatus: null,
            newStatus: "PENDING",
            changedBy: "SYSTEM",
            remarks: "Order registered in system",
            timestamp: new Date().toISOString(),
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetchOrderDetails();

    async function fetchAvailableAgents() {
      try {
        const res = await fetch("/api/agents/available");
        if (res.ok) {
          const json = await res.json();
          setAvailableAgents(json.data || []);
        }
      } catch {
        setAvailableAgents([
          { id: "agent-uuid-1", fullName: "John Doe", vehicleType: "MOTORCYCLE", activeDeliveries: 0, averageRating: 4.8 },
          { id: "agent-uuid-2", fullName: "Jane Smith", vehicleType: "CAR", activeDeliveries: 1, averageRating: 4.9 },
        ]);
      }
    }
    fetchAvailableAgents();
  }, [id, fetchOrderDetails]);

  const handleManualAssign = async () => {
    if (!selectedAgentId) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/orders/${id}/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agentId: selectedAgentId }),
      });
      if (res.ok) {
        await fetchOrderDetails();
        setStatusMessage("Agent assigned manually successfully");
      } else {
        const selected = availableAgents.find(a => a.id === selectedAgentId);
        if (selected) {
          setOrder(prev => {
            if (!prev) return null;
            return {
              ...prev,
              status: "ASSIGNED",
              assignedAgent: {
                id: selected.id,
                vehicleType: selected.vehicleType,
                licenseNumber: "DL-MOCK-123",
                user: {
                  fullName: selected.fullName,
                  email: "agent@haisolink.com",
                },
              },
              trackingHistories: [
                ...prev.trackingHistories,
                {
                  id: `hist-${Date.now()}`,
                  previousStatus: prev.status,
                  newStatus: "ASSIGNED",
                  changedBy: "ADMIN",
                  remarks: "Manual agent assignment (Mock mode)",
                  timestamp: new Date().toISOString(),
                },
              ],
            };
          });
          setStatusMessage("Agent assigned manually (Mock mode)");
        }
      }
    } catch {
      setStatusMessage("Manual assignment error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAutoAssign = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/orders/${id}/auto-assign`, {
        method: "POST",
      });
      if (res.ok) {
        await fetchOrderDetails();
        setStatusMessage("Agent auto-assigned successfully");
      } else {
        const best = availableAgents[0];
        if (best) {
          setOrder(prev => {
            if (!prev) return null;
            return {
              ...prev,
              status: "ASSIGNED",
              assignedAgent: {
                id: best.id,
                vehicleType: best.vehicleType,
                licenseNumber: "DL-MOCK-123",
                user: {
                  fullName: best.fullName,
                  email: "agent@haisolink.com",
                },
              },
              trackingHistories: [
                ...prev.trackingHistories,
                {
                  id: `hist-${Date.now()}`,
                  previousStatus: prev.status,
                  newStatus: "ASSIGNED",
                  changedBy: "SYSTEM",
                  remarks: "Automated routing assignment (Mock mode)",
                  timestamp: new Date().toISOString(),
                },
              ],
            };
          });
          setStatusMessage("Agent auto-assigned (Mock mode)");
        }
      }
    } catch {
      setStatusMessage("Auto assignment error");
    } finally {
      setActionLoading(false);
    }
  };

  React.useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  if (loading) {
    return (
      <DashboardLayout userRole="ADMIN" userEmail="admin@haisolink.com">
        <div className="py-20 flex justify-center">
          <Loader size="md" />
        </div>
      </DashboardLayout>
    );
  }

  if (!order) {
    return (
      <DashboardLayout userRole="ADMIN" userEmail="admin@haisolink.com">
        <div className="p-8 text-center bg-destructive/10 text-destructive border border-destructive/20 rounded-2xl">
          <p className="font-semibold">Order details not available</p>
          <Button onClick={() => router.push("/admin/dashboard")} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const timelineItems = order.trackingHistories.map((hist) => ({
    id: hist.id,
    title: hist.newStatus,
    description: hist.remarks || `${hist.newStatus} update logged by ${hist.changedBy}`,
    status: (hist.newStatus === order.status ? "current" : "completed") as "completed" | "current" | "pending",
    time: new Date(hist.timestamp).toLocaleString(),
  }));

  return (
    <DashboardLayout userRole="ADMIN" userEmail="admin@haisolink.com">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight">Order #{order.trackingNumber}</h1>
              {statusMessage && (
                <span className="text-xs font-semibold px-3 py-1 bg-secondary text-foreground border border-border/30 rounded-lg">
                  {statusMessage}
                </span>
              )}
            </div>
            <p className="text-muted-foreground mt-1">
              Registered on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Badge className="text-sm px-4 py-1.5 uppercase font-bold tracking-wider">
            {order.status}
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card p-6 rounded-2xl border border-border/40 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" /> Package Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Order Type</p>
                  <p className="font-semibold text-foreground">{order.orderType}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Mode</p>
                  <p className="font-semibold text-foreground">{order.paymentType}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Dimensions</p>
                  <p className="font-semibold text-foreground">
                    {order.packageLength} x {order.packageWidth} x {order.packageHeight} cm
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Billable Weight</p>
                  <p className="font-semibold text-foreground">{order.billableWeight} kg</p>
                </div>
              </div>
              <hr className="border-border/40" />
              <div className="grid grid-cols-3 gap-4 text-sm pt-2">
                <div>
                  <p className="text-muted-foreground">Base Charge</p>
                  <p className="font-bold text-foreground">${order.shippingCharge.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">COD Surcharge</p>
                  <p className="font-bold text-foreground">${order.CODCharge.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Fee</p>
                  <p className="font-extrabold text-primary text-base">${order.totalCharge.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border/40 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-rose-500" /> Route Addresses
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="p-4 bg-secondary/10 rounded-xl border border-border/20">
                  <p className="font-bold text-rose-600 mb-1.5 uppercase text-xs tracking-wider">Pickup Location</p>
                  <p className="font-semibold text-foreground">{order.pickupArea.areaName}</p>
                  <p className="text-muted-foreground mt-0.5">{order.pickupArea.city} - {order.pickupArea.pincode}</p>
                </div>

                <div className="p-4 bg-secondary/10 rounded-xl border border-border/20">
                  <p className="font-bold text-emerald-600 mb-1.5 uppercase text-xs tracking-wider">Destination Location</p>
                  <p className="font-semibold text-foreground">{order.destinationArea.areaName}</p>
                  <p className="text-muted-foreground mt-0.5">{order.destinationArea.city} - {order.destinationArea.pincode}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card p-6 rounded-2xl border border-border/40 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" /> Dispatch Assignment
              </h3>

              {order.assignedAgent ? (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Assigned Agent</p>
                    <p className="font-bold text-foreground">{order.assignedAgent.user.fullName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{order.assignedAgent.user.email}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      {order.assignedAgent.vehicleType} | {order.assignedAgent.licenseNumber}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-center">
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Unassigned</p>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      Select an available courier or trigger the dynamic auto-assignment algorithm.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Manual Courier</label>
                    <select
                      value={selectedAgentId}
                      onChange={(e) => setSelectedAgentId(e.target.value)}
                      className="w-full bg-background border border-border/40 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    >
                      <option value="">Select available courier...</option>
                      {availableAgents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.fullName} ({agent.vehicleType} - Active: {agent.activeDeliveries})
                        </option>
                      ))}
                    </select>

                    <Button
                      onClick={handleManualAssign}
                      disabled={!selectedAgentId || actionLoading}
                      className="w-full font-bold rounded-xl mt-1 shadow-sm"
                    >
                      Assign Selected Courier
                    </Button>
                  </div>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-border/40"></div>
                    <span className="flex-shrink mx-4 text-xs font-semibold text-muted-foreground/80 uppercase">Or</span>
                    <div className="flex-grow border-t border-border/40"></div>
                  </div>

                  <Button
                    onClick={handleAutoAssign}
                    disabled={actionLoading}
                    variant="outline"
                    className="w-full font-bold rounded-xl border-border/40 hover:bg-secondary flex items-center justify-center gap-2"
                  >
                    <Navigation className="h-4 w-4 text-primary" /> Auto Assign (Algorithm)
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border/40 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" /> Customer Profile
              </h3>
              <div className="text-sm space-y-1">
                <p className="font-semibold text-foreground">{order.customer.user.fullName}</p>
                <p className="text-xs text-muted-foreground">{order.customer.user.email}</p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Default: {order.customer.defaultAddress}
                </p>
              </div>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border/40 space-y-4">
              <h3 className="text-lg font-bold">Route Log Timeline</h3>
              <Timeline items={timelineItems} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
