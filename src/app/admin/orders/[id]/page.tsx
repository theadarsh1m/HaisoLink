"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { AmazonTimeline } from "@/components/ui/amazon-timeline";
import { MapPin, User, Package, Shield, Navigation, AlertTriangle, Check, X, RotateCcw } from "lucide-react";
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
  deliveryAttempts: Array<{
    id: string;
    attemptNumber: number;
    reason: string;
    notes: string | null;
    timestamp: string;
  }>;
  reschedules: Array<{
    id: string;
    requestedDate: string;
    reason: string;
    status: string;
  }>;
  deliveryProof: {
    recipientName: string;
    otp: string | null;
    signaturePath: string | null;
    photoUrl: string | null;
    notes: string | null;
  } | null;
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

  const [showDeliverForm, setShowDeliverForm] = React.useState(false);
  const [recipientName, setRecipientName] = React.useState("");
  const [deliveryNotes, setDeliveryNotes] = React.useState("");

  const [showFailForm, setShowFailForm] = React.useState(false);
  const [failReason, setFailReason] = React.useState("Customer Not Available");
  const [failNotes, setFailNotes] = React.useState("");

  const [showRescheduleForm, setShowRescheduleForm] = React.useState(false);
  const [rescheduleDate, setRescheduleDate] = React.useState("");
  const [rescheduleReason, setRescheduleReason] = React.useState("");

  const [showOverrideForm, setShowOverrideForm] = React.useState(false);
  const [overrideStatus, setOverrideStatus] = React.useState("DELIVERED");
  const [overrideRemarks, setOverrideRemarks] = React.useState("");

  const fetchOrderDetails = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) {
        throw new Error("Order not found");
      }
      const json = await res.json();
      const dbOrder = json.data;

      const timelineRes = await fetch(`/api/orders/${id}/timeline`);
      let timelineData = [];
      if (timelineRes.ok) {
        const timelineJson = await timelineRes.json();
        timelineData = timelineJson.data || [];
      }

      setOrder({
        ...dbOrder,
        trackingHistories: timelineData.length > 0 ? timelineData : dbOrder.trackingHistories || [],
        deliveryAttempts: dbOrder.deliveryAttempts || [],
        reschedules: dbOrder.reschedules || [],
        deliveryProof: dbOrder.deliveryProof || null,
      });
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
            newStatus: "CREATED",
            changedBy: "SYSTEM",
            remarks: "Order registered in system",
            timestamp: new Date().toISOString(),
          },
        ],
        deliveryAttempts: [],
        reschedules: [],
        deliveryProof: null,
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
                  newStatus: "Assigned",
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
                  newStatus: "Assigned",
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

  const handleWorkflowTransition = async (status: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await fetchOrderDetails();
        setStatusMessage(`Status transitioned to ${status}`);
      } else {
        const json = await res.json();
        throw new Error(json.message || "Transition failed");
      }
    } catch {
      setOrder(prev => {
        if (!prev) return null;
        return {
          ...prev,
          status,
          trackingHistories: [
            ...prev.trackingHistories,
            {
              id: `hist-${Date.now()}`,
              previousStatus: prev.status,
              newStatus: status,
              changedBy: "COURIER",
              remarks: `Transitioned to ${status} (Mock mode)`,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      });
      setStatusMessage(`${status} (Mock mode)`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeliverSubmit = async () => {
    if (!recipientName) return;
    setActionLoading(true);
    const payload = {
      recipientName,
      notes: deliveryNotes,
      signaturePath: "sig_placeholder.png",
      photoUrl: "https://example.com/photo.jpg",
      otp: "1234",
    };
    try {
      const res = await fetch(`/api/orders/${id}/deliver`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowDeliverForm(false);
        await fetchOrderDetails();
        setStatusMessage("Order marked Delivered");
      } else {
        const json = await res.json();
        throw new Error(json.message || "Failed");
      }
    } catch {
      setOrder(prev => {
        if (!prev) return null;
        return {
          ...prev,
          status: "DELIVERED",
          deliveryProof: {
            recipientName,
            otp: "1234",
            signaturePath: "sig_placeholder.png",
            photoUrl: "https://example.com/photo.jpg",
            notes: deliveryNotes,
          },
          trackingHistories: [
            ...prev.trackingHistories,
            {
              id: `hist-${Date.now()}`,
              previousStatus: prev.status,
              newStatus: "DELIVERED",
              changedBy: "COURIER",
              remarks: `Delivered to: ${recipientName} (Mock mode)`,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      });
      setShowDeliverForm(false);
      setStatusMessage("Marked Delivered (Mock mode)");
    } finally {
      setActionLoading(false);
    }
  };

  const handleFailSubmit = async () => {
    setActionLoading(true);
    const payload = {
      reason: failReason,
      notes: failNotes,
    };
    try {
      const res = await fetch(`/api/orders/${id}/fail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowFailForm(false);
        await fetchOrderDetails();
        setStatusMessage("Failure attempt registered");
      } else {
        const json = await res.json();
        throw new Error(json.message || "Failed");
      }
    } catch {
      setOrder(prev => {
        if (!prev) return null;
        const attempts = prev.deliveryAttempts || [];
        const nextNum = attempts.length + 1;
        return {
          ...prev,
          status: "FAILED",
          deliveryAttempts: [
            ...attempts,
            {
              id: `attempt-${Date.now()}`,
              attemptNumber: nextNum,
              reason: failReason,
              notes: failNotes,
              timestamp: new Date().toISOString(),
            },
          ],
          trackingHistories: [
            ...prev.trackingHistories,
            {
              id: `hist-${Date.now()}`,
              previousStatus: prev.status,
              newStatus: "FAILED",
              changedBy: "COURIER",
              remarks: `Attempt ${nextNum} failed: ${failReason} (Mock mode)`,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      });
      setShowFailForm(false);
      setStatusMessage("Failed attempt (Mock mode)");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleDate || !rescheduleReason) return;
    setActionLoading(true);
    const payload = {
      requestedDate: new Date(rescheduleDate).toISOString(),
      reason: rescheduleReason,
    };
    try {
      const res = await fetch(`/api/orders/${id}/reschedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowRescheduleForm(false);
        await fetchOrderDetails();
        setStatusMessage("Order rescheduled");
      } else {
        const json = await res.json();
        throw new Error(json.message || "Failed");
      }
    } catch {
      setOrder(prev => {
        if (!prev) return null;
        return {
          ...prev,
          status: "RESCHEDULED",
          reschedules: [
            ...prev.reschedules,
            {
              id: `resched-${Date.now()}`,
              requestedDate: rescheduleDate,
              reason: rescheduleReason,
              status: "PENDING",
            },
          ],
          trackingHistories: [
            ...prev.trackingHistories,
            {
              id: `hist-${Date.now()}`,
              previousStatus: prev.status,
              newStatus: "RESCHEDULED",
              changedBy: "CUSTOMER",
              remarks: `Rescheduled for ${rescheduleDate}: ${rescheduleReason} (Mock mode)`,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      });
      setShowRescheduleForm(false);
      setStatusMessage("Rescheduled (Mock mode)");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOverrideSubmit = async () => {
    if (!overrideRemarks) return;
    setActionLoading(true);
    const payload = {
      status: overrideStatus,
      remarks: overrideRemarks,
      forceOverride: true,
    };
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowOverrideForm(false);
        await fetchOrderDetails();
        setStatusMessage("Admin status override saved");
      } else {
        const json = await res.json();
        throw new Error(json.message || "Failed");
      }
    } catch {
      setOrder(prev => {
        if (!prev) return null;
        return {
          ...prev,
          status: overrideStatus,
          trackingHistories: [
            ...prev.trackingHistories,
            {
              id: `hist-${Date.now()}`,
              previousStatus: prev.status,
              newStatus: overrideStatus,
              changedBy: "ADMIN",
              remarks: `[ADMIN OVERRIDE] ${overrideRemarks} (Mock mode)`,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      });
      setShowOverrideForm(false);
      setStatusMessage("Admin status overridden (Mock mode)");
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

  const timelineMapped = order.trackingHistories.map((h) => ({
    status: h.newStatus,
    timestamp: h.timestamp,
    actor: h.changedBy,
    remarks: h.remarks,
  }));

  const canMarkPickedUp = order.status === "ASSIGNED";
  const canMarkInTransit = order.status === "PICKED_UP";
  const canMarkOutForDelivery = order.status === "IN_TRANSIT";
  const canDeliverOrFail = order.status === "OUT_FOR_DELIVERY";
  const canReschedule = order.status === "FAILED";

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

            <div className="bg-card p-6 rounded-2xl border border-border/40 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" /> Courier Workflow Simulator
              </h3>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => handleWorkflowTransition("PICKED_UP")}
                  disabled={!canMarkPickedUp || actionLoading}
                  className="font-semibold rounded-xl text-xs"
                >
                  Mark Picked Up
                </Button>
                <Button
                  onClick={() => handleWorkflowTransition("IN_TRANSIT")}
                  disabled={!canMarkInTransit || actionLoading}
                  className="font-semibold rounded-xl text-xs"
                >
                  Mark In Transit
                </Button>
                <Button
                  onClick={() => handleWorkflowTransition("OUT_FOR_DELIVERY")}
                  disabled={!canMarkOutForDelivery || actionLoading}
                  className="font-semibold rounded-xl text-xs"
                >
                  Mark Out For Delivery
                </Button>
                <Button
                  onClick={() => setShowDeliverForm(true)}
                  disabled={!canDeliverOrFail || actionLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs"
                >
                  Mark Delivered
                </Button>
                <Button
                  onClick={() => setShowFailForm(true)}
                  disabled={!canDeliverOrFail || actionLoading}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs"
                >
                  Mark Failed
                </Button>
              </div>

              {showDeliverForm && (
                <div className="p-4 bg-secondary/10 rounded-xl border border-border/30 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase text-emerald-600">Proof of Delivery Form</h4>
                    <Button variant="ghost" size="sm" onClick={() => setShowDeliverForm(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Recipient Full Name..."
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full bg-background border border-border/40 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <textarea
                      placeholder="Delivery Notes..."
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      className="w-full bg-background border border-border/40 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary h-16"
                    />
                    <Button
                      onClick={handleDeliverSubmit}
                      disabled={!recipientName || actionLoading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                    >
                      Confirm Delivery Proof
                    </Button>
                  </div>
                </div>
              )}

              {showFailForm && (
                <div className="p-4 bg-secondary/10 rounded-xl border border-border/30 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase text-rose-600">Failed Delivery Details</h4>
                    <Button variant="ghost" size="sm" onClick={() => setShowFailForm(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <select
                      value={failReason}
                      onChange={(e) => setFailReason(e.target.value)}
                      className="w-full bg-background border border-border/40 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Customer Not Available">Customer Not Available</option>
                      <option value="Wrong Address">Wrong Address</option>
                      <option value="Customer Refused">Customer Refused</option>
                      <option value="Weather">Weather</option>
                      <option value="Vehicle Issue">Vehicle Issue</option>
                      <option value="Other">Other</option>
                    </select>
                    <textarea
                      placeholder="Fail Reason Details / Notes..."
                      value={failNotes}
                      onChange={(e) => setFailNotes(e.target.value)}
                      className="w-full bg-background border border-border/40 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary h-16"
                    />
                    <Button
                      onClick={handleFailSubmit}
                      disabled={actionLoading}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs"
                    >
                      Log Failed Attempt
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {order.deliveryAttempts.length > 0 && (
              <div className="bg-card p-6 rounded-2xl border border-border/40 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-rose-600 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Delivery Attempt Failures ({order.deliveryAttempts.length})
                </h3>
                <div className="space-y-2.5">
                  {order.deliveryAttempts.map((att) => (
                    <div key={att.id} className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="font-bold text-foreground">Attempt #{att.attemptNumber}</span>
                        <span className="text-muted-foreground">{new Date(att.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-muted-foreground"><strong className="text-rose-600">Reason:</strong> {att.reason}</p>
                      {att.notes && <p className="text-muted-foreground"><strong>Notes:</strong> {att.notes}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {order.deliveryProof && (
              <div className="bg-card p-6 rounded-2xl border border-border/40 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-2">
                  <Check className="h-4 w-4" /> Proof of Delivery
                </h3>
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-xs space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-muted-foreground"><strong>Recipient:</strong> {order.deliveryProof.recipientName}</p>
                    <p className="text-muted-foreground"><strong>OTP Code:</strong> {order.deliveryProof.otp || "—"}</p>
                    <p className="text-muted-foreground"><strong>Signature:</strong> {order.deliveryProof.signaturePath || "—"}</p>
                    <p className="text-muted-foreground"><strong>Photo Link:</strong> {order.deliveryProof.photoUrl || "—"}</p>
                  </div>
                  {order.deliveryProof.notes && (
                    <p className="text-muted-foreground border-t border-border/30 pt-1.5 mt-1.5">
                      <strong>Delivery Notes:</strong> {order.deliveryProof.notes}
                    </p>
                  )}
                </div>
              </div>
            )}
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
                <RotateCcw className="h-5 w-5 text-amber-500" /> Rescheduling Panel
              </h3>

              {canReschedule ? (
                <div className="space-y-2.5">
                  <Button
                    onClick={() => setShowRescheduleForm(true)}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs"
                  >
                    Schedule New Delivery Date
                  </Button>

                  {showRescheduleForm && (
                    <div className="p-3 bg-secondary/15 rounded-xl border border-border/30 space-y-2 text-xs">
                      <label className="font-bold text-muted-foreground block text-[10px] uppercase">New Target Date</label>
                      <input
                        type="date"
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        className="w-full bg-background border border-border/40 rounded-lg px-3 py-1.5 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Reschedule reason details..."
                        value={rescheduleReason}
                        onChange={(e) => setRescheduleReason(e.target.value)}
                        className="w-full bg-background border border-border/40 rounded-lg px-3 py-1.5 mt-1 focus:outline-none"
                      />
                      <Button
                        onClick={handleRescheduleSubmit}
                        disabled={!rescheduleDate || !rescheduleReason || actionLoading}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs mt-1.5"
                      >
                        Submit Rescheduling
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Rescheduling actions are only available if the order status is currently failed.
                </p>
              )}

              {order.reschedules.length > 0 && (
                <div className="space-y-2 border-t border-border/40 pt-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase">Reschedule Logs</p>
                  {order.reschedules.map((r) => (
                    <div key={r.id} className="p-2.5 bg-secondary/10 border border-border/20 rounded-xl text-xs space-y-0.5">
                      <p className="font-semibold text-foreground">Target: {new Date(r.requestedDate).toLocaleDateString()}</p>
                      <p className="text-muted-foreground">Reason: {r.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border/40 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Shield className="h-5 w-5 text-rose-500" /> Admin Override Commands
              </h3>

              <Button
                onClick={() => setShowOverrideForm(true)}
                variant="outline"
                className="w-full font-bold border-rose-500/20 text-rose-600 hover:bg-rose-500/5 rounded-xl text-xs"
              >
                Force Transition Status
              </Button>

              {showOverrideForm && (
                <div className="p-3 bg-secondary/15 rounded-xl border border-border/30 space-y-2 text-xs">
                  <label className="font-bold text-muted-foreground block text-[10px] uppercase">Force Target State</label>
                  <select
                    value={overrideStatus}
                    onChange={(e) => setOverrideStatus(e.target.value)}
                    className="w-full bg-background border border-border/40 rounded-lg px-3 py-1.5 focus:outline-none"
                  >
                    <option value="CREATED">CREATED</option>
                    <option value="ASSIGNED">ASSIGNED</option>
                    <option value="PICKED_UP">PICKED_UP</option>
                    <option value="IN_TRANSIT">IN_TRANSIT</option>
                    <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="FAILED">FAILED</option>
                    <option value="RESCHEDULED">RESCHEDULED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Provide override audit remarks..."
                    value={overrideRemarks}
                    onChange={(e) => setOverrideRemarks(e.target.value)}
                    className="w-full bg-background border border-border/40 rounded-lg px-3 py-1.5 focus:outline-none"
                  />

                  <Button
                    onClick={handleOverrideSubmit}
                    disabled={!overrideRemarks || actionLoading}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs"
                  >
                    Save Override Status
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
              <AmazonTimeline activeStatus={order.status} history={timelineMapped} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
