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
  Play,
  RotateCcw,
} from "lucide-react";

export default function AgentDashboardPage() {
  const [isOnline, setIsOnline] = React.useState(true);

  const assignedOrders = [
    { id: "HL-8094", client: "Sophia Martinez", destination: "789 Pine Rd, Metro City", packageType: "Documents", weight: "0.5 kg", status: "Loaded" },
    { id: "HL-8091", client: "William Brown", destination: "202 Birch Blvd, Downtown", packageType: "Electronics", weight: "2.4 kg", status: "Assigned" },
  ];

  return (
    <DashboardLayout userRole="DELIVERY_AGENT" userEmail="agent@haisolink.com">
      <div className="space-y-8">
        {}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/80">
              Courier Hub
            </h1>
            <p className="text-muted-foreground mt-1">
              Active route dispatches, delivery confirmations, and shift status toggles.
            </p>
          </div>

          {}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border/40 rounded-xl shadow-sm">
              <div className={`h-2.5 w-2.5 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"}`} />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Duty State: <strong className={isOnline ? "text-emerald-500" : "text-muted-foreground"}>{isOnline ? "Online" : "Offline"}</strong>
              </span>
            </div>
            <Button
              onClick={() => setIsOnline(!isOnline)}
              className={`font-bold rounded-xl transition-all duration-300 shadow-md ${
                isOnline
                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
              }`}
            >
              Go {isOnline ? "Offline" : "Online"}
            </Button>
          </div>
        </div>

        {}
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

        {}
        <div className="grid gap-6 lg:grid-cols-3">
          {}
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
                      <TableHead className="font-semibold text-xs tracking-wider text-right">ACTION</TableHead>
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
                        <TableCell className="text-right">
                          <Button size="sm" className="h-8 rounded-lg px-3 font-semibold text-xs">
                            <Play className="h-3 w-3 mr-1" /> Start Route
                          </Button>
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

          {}
          <div className="space-y-6">
            {}
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

            {}
            <div className="bg-card/65 backdrop-blur-md rounded-2xl border border-border/40 p-6 shadow-sm text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4 border border-primary/20">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold tracking-tight">Need navigation assistance?</h3>
              <p className="text-xs text-muted-foreground/80 mt-1 mb-4 leading-relaxed">
                Connect external map app or preview optimized routing order.
              </p>
              <Button variant="outline" size="sm" className="w-full font-semibold rounded-lg border-border/40 hover:bg-secondary">
                <RotateCcw className="h-3 w-3 mr-1.5" /> Recalculate Route
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
