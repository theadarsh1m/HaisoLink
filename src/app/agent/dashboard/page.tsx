"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

export default function AgentDashboardPage() {
  const [availability, setAvailability] = React.useState<"AVAILABLE" | "BUSY" | "OFFLINE" | "ON_LEAVE">("AVAILABLE");
  const [gpsCoordinates, setGpsCoordinates] = React.useState<{ lat: number; lng: number } | null>(null);
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);

  const assignedOrders = [
    { id: "HL-8094", client: "Sophia Martinez", destination: "789 Pine Rd, Metro City", packageType: "Documents", weight: "0.5 kg", status: "Loaded" },
    { id: "HL-8091", client: "William Brown", destination: "202 Birch Blvd, Downtown", packageType: "Electronics", weight: "2.4 kg", status: "Assigned" },
  ];

  const handleAvailabilityChange = async (newStatus: "AVAILABLE" | "BUSY" | "OFFLINE" | "ON_LEAVE") => {
    try {
      setAvailability(newStatus);
      const res = await fetch("/api/agent/availability", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        throw new Error("Failed to update status");
      }
      setStatusMessage("Duty state updated successfully");
    } catch {
      setStatusMessage("Error updating duty state");
    }
  };

  const triggerGpsUpdate = async () => {
    if (!navigator.geolocation) {
      setStatusMessage("Geolocation not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setGpsCoordinates(coords);
        try {
          const res = await fetch("/api/agent/location", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              latitude: coords.lat,
              longitude: coords.lng,
            }),
          });
          if (!res.ok) {
            throw new Error("Failed to upload location");
          }
          setStatusMessage(`Location updated: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
        } catch {
          setStatusMessage("Error syncing coordinates to server");
        }
      },
      () => {
        const fallbackCoords = { lat: 28.61, lng: 77.20 };
        setGpsCoordinates(fallbackCoords);
        setStatusMessage("Mocking GPS coordinates");
      }
    );
  };

  React.useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  return (
    <DashboardLayout userRole="DELIVERY_AGENT" userEmail="agent@haisolink.com">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/80">
              Courier Hub
            </h1>
            <p className="text-muted-foreground mt-1">
              Active route dispatches, delivery confirmations, and shift status toggles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {statusMessage && (
              <span className="text-xs font-semibold px-3 py-1 bg-secondary/80 text-foreground border border-border/30 rounded-lg">
                {statusMessage}
              </span>
            )}
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border/40 rounded-xl shadow-sm">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  availability === "AVAILABLE"
                    ? "bg-emerald-500 animate-pulse"
                    : availability === "BUSY"
                    ? "bg-amber-500 animate-pulse"
                    : availability === "ON_LEAVE"
                    ? "bg-blue-500"
                    : "bg-muted-foreground"
                }`}
              />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Duty: <strong className="text-foreground">{availability}</strong>
              </span>
            </div>

            <select
              value={availability}
              onChange={(e) => handleAvailabilityChange(e.target.value as "AVAILABLE" | "BUSY" | "OFFLINE" | "ON_LEAVE")}
              className="bg-card border border-border/40 text-sm font-semibold rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="BUSY">BUSY</option>
              <option value="OFFLINE">OFFLINE</option>
              <option value="ON_LEAVE">ON LEAVE</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active Dispatches"
            value={assignedOrders.length}
            description="Loaded in vehicle or assigned to queue"
            icon={<Compass className="h-4 w-4 text-primary" />}
          />
          <StatCard
            title="Completed Shipments"
            value="6"
            description="Delivered successfully today"
            icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
          />
          <StatCard
            title="Estimated Earnings"
            value="$184.20"
            description="Including distance pay & surge rewards"
            icon={<TrendingUp className="h-4 w-4 text-blue-500" />}
            trend={{ value: "+$42.50 surge", type: "up" }}
          />
          <StatCard
            title="Shift Clock"
            value="3h 45m"
            description="Remaining in current roster block"
            icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-card/65 backdrop-blur-md rounded-2xl border border-border/40 overflow-hidden shadow-sm flex flex-col justify-between">
            <div>
              <div className="p-6 border-b border-border/40 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold tracking-tight">Active Delivery Queue</h3>
                  <p className="text-xs text-muted-foreground">List of current routes assigned to you for dispatch.</p>
                </div>
                <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                  Route Active
                </Badge>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/40 bg-secondary/10">
                      <TableHead className="font-semibold text-xs tracking-wider">ORDER ID</TableHead>
                      <TableHead className="font-semibold text-xs tracking-wider">CLIENT</TableHead>
                      <TableHead className="font-semibold text-xs tracking-wider">DESTINATION</TableHead>
                      <TableHead className="font-semibold text-xs tracking-wider">WEIGHT</TableHead>
                      <TableHead className="font-semibold text-xs tracking-wider">STATUS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignedOrders.map((order) => (
                      <TableRow key={order.id} className="border-border/25 hover:bg-secondary/20">
                        <TableCell className="font-mono text-xs font-semibold text-foreground/90">{order.id}</TableCell>
                        <TableCell className="font-semibold text-xs">{order.client}</TableCell>
                        <TableCell className="text-xs font-medium text-muted-foreground">{order.destination}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{order.weight}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              order.status === "Loaded"
                                ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/20"
                                : "bg-blue-500/10 text-blue-600 hover:bg-blue-500/10 border-blue-500/20"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="p-4 border-t border-border/40 bg-secondary/10 text-center">
              <span className="text-xs font-medium text-muted-foreground">
                Availability toggle signals the dispatcher automatic assigner algorithm.
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card/65 backdrop-blur-md rounded-2xl border border-border/40 p-6 shadow-sm">
              <h3 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4.5 w-4.5 text-amber-500" /> Dispatch Alerts
              </h3>
              <div className="space-y-3.5">
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3">
                  <div className="p-1 rounded bg-rose-500/10 text-rose-500 mt-0.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400">Road Blockage on Main Ave</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      Reroute advised for deliveries near Uptown sectors.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
                  <div className="p-1 rounded bg-blue-500/10 text-blue-500 mt-0.5">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Shift Extension Roster</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      +1.5x surge rate active for next 2 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card/65 backdrop-blur-md rounded-2xl border border-border/40 p-6 shadow-sm text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4 border border-primary/20">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold tracking-tight">Need GPS tracking assistance?</h3>
              <p className="text-xs text-muted-foreground/80 mt-1 mb-4 leading-relaxed">
                {gpsCoordinates
                  ? `Active Coordinates: ${gpsCoordinates.lat.toFixed(4)}, ${gpsCoordinates.lng.toFixed(4)}`
                  : "Allow location access to sync status with central dispatch."}
              </p>
              <Button
                onClick={triggerGpsUpdate}
                variant="outline"
                size="sm"
                className="w-full font-semibold rounded-lg border-border/40 hover:bg-secondary"
              >
                <RotateCcw className="h-3 w-3 mr-1.5" /> Update Current GPS
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
