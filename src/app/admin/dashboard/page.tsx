"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import {
  TrendingUp,
  Truck,
  DollarSign,
  Activity,
  Plus,
  Users,
  Compass,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function AdminDashboardPage() {

  const recentOrders = [
    { id: "HL-8094", customer: "Sophia Martinez", agent: "Liam Miller", address: "789 Pine Rd, Metro City", status: "In Transit", date: "Just now" },
    { id: "HL-8093", customer: "James Anderson", agent: "Emma Davis", address: "101 Cedar Ln, suburbia", status: "Delivered", date: "15 mins ago" },
    { id: "HL-8092", customer: "Olivia Williams", agent: "Noah Taylor", address: "456 Oak Ave, Uptown", status: "Pending", date: "45 mins ago" },
    { id: "HL-8091", customer: "William Brown", agent: "Unassigned", address: "202 Birch Blvd, Downtown", status: "Pending", date: "1 hour ago" },
    { id: "HL-8090", customer: "Isabella Garcia", agent: "Lucas Wilson", address: "303 Maple Dr, Riverside", status: "Delivered", date: "2 hours ago" },
  ];

  const systemLogs: TimelineItem[] = [
    { id: 1, title: "Zone B overload warning", description: "Package counts in zone B reached 92% capacity threshold", time: "10 mins ago", status: "current" },
    { id: 2, title: "New driver onboarded", description: "Emma Davis joined the fleet pool", time: "1 hour ago", status: "completed" },
    { id: 3, title: "System pricing adjustments", description: "Dynamic peak hour multiplier set to 1.25x in Metro Center", time: "3 hours ago", status: "completed" },
  ];

  return (
    <DashboardLayout userRole="ADMIN" userEmail="admin@haisolink.com">
      <div className="space-y-8">
        {}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/80">
              System Control Room
            </h1>
            <p className="text-muted-foreground mt-1">
              Overview of fleet metrics, zone demand thresholds, and dispatch logs.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4 mr-2" /> Manual Dispatch
            </Button>
            <Button variant="outline" className="font-bold rounded-xl border-border/40 hover:bg-secondary">
              Zone Mapping
            </Button>
          </div>
        </div>

        {}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Shipments"
            value="1,482"
            description="Across all routing zones"
            icon={<Truck className="h-4 w-4 text-primary" />}
            trend={{ value: "+12.5%", type: "up" }}
          />
          <StatCard
            title="Dynamic Revenue"
            value="$18,450"
            description="With dynamic surge multipliers"
            icon={<DollarSign className="h-4 w-4 text-emerald-500" />}
            trend={{ value: "+8.3%", type: "up" }}
          />
          <StatCard
            title="Active Couriers"
            value="38"
            description="Currently checking in route schedules"
            icon={<Users className="h-4 w-4 text-blue-500" />}
            trend={{ value: "98% utilization", type: "neutral" }}
          />
          <StatCard
            title="Unassigned Parcels"
            value="12"
            description="Awaiting auto-agent assigner trigger"
            icon={<Activity className="h-4 w-4 text-amber-500" />}
            trend={{ value: "-4% this hour", type: "down" }}
          />
        </div>

        {}
        <div className="grid gap-6 lg:grid-cols-3">
          {}
          <div className="lg:col-span-2 bg-card/65 backdrop-blur-md rounded-2xl border border-border/40 overflow-hidden shadow-sm flex flex-col justify-between">
            <div>
              <div className="p-6 border-b border-border/40 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold tracking-tight">Active Dispatches</h3>
                  <p className="text-xs text-muted-foreground">Most recent orders flowing through system pipelines.</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs font-semibold text-primary hover:bg-primary/10">
                  View All <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/40 bg-secondary/10">
                      <TableHead className="font-semibold text-xs tracking-wider">ORDER ID</TableHead>
                      <TableHead className="font-semibold text-xs tracking-wider">CUSTOMER</TableHead>
                      <TableHead className="font-semibold text-xs tracking-wider">COURIER</TableHead>
                      <TableHead className="font-semibold text-xs tracking-wider">STATUS</TableHead>
                      <TableHead className="font-semibold text-xs tracking-wider">TIME</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id} className="border-border/25 hover:bg-secondary/20">
                        <TableCell className="font-mono text-xs font-semibold text-foreground/90">{order.id}</TableCell>
                        <TableCell className="font-semibold text-xs">{order.customer}</TableCell>
                        <TableCell className="text-xs font-medium text-muted-foreground">{order.agent}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              order.status === "Delivered"
                                ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/20"
                                : order.status === "In Transit"
                                ? "bg-blue-500/10 text-blue-600 hover:bg-blue-500/10 border-blue-500/20"
                                : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/10 border-amber-500/20"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{order.date}</TableCell>
                      </TableRow>
                    ))}
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

          {}
          <div className="space-y-6">
            {}
            <div className="bg-card/65 backdrop-blur-md rounded-2xl border border-border/40 p-6 shadow-sm">
              <h3 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-primary" /> Operations Controls
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-1.5 text-xs rounded-xl border-border/40 hover:bg-secondary hover:text-primary transition-all">
                  <TrendingUp className="h-5 w-5" /> Adjust Pricing
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-1.5 text-xs rounded-xl border-border/40 hover:bg-secondary hover:text-primary transition-all">
                  <Compass className="h-5 w-5" /> Assign Zones
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-1.5 text-xs rounded-xl border-border/40 hover:bg-secondary hover:text-primary transition-all">
                  <Users className="h-5 w-5" /> Manage Agents
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-1.5 text-xs rounded-xl border-border/40 hover:bg-secondary hover:text-primary transition-all">
                  <Activity className="h-5 w-5" /> Trigger Dispatch
                </Button>
              </div>
            </div>

            {}
            <div className="bg-card/65 backdrop-blur-md rounded-2xl border border-border/40 p-6 shadow-sm">
              <h3 className="text-lg font-bold tracking-tight mb-4">Operations Timeline</h3>
              <Timeline items={systemLogs} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
