"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import {
  OrdersLineChart,
  RevenueAreaChart,
  StatusPieChart,
  ZonesBarChart,
  B2bVsB2cDonutChart,
  CodVsPrepaidBarChart,
} from "@/components/admin/charts";
import { LiveStatusBoard } from "@/components/admin/LiveStatusBoard";
import {
  Truck,
  DollarSign,
  Activity,
  Users,
  AlertTriangle,
  Package,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function AdminDashboardPage() {
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      return res.json();
    },
    refetchInterval: 30000,
  });

  const { data: analyticsData, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: async () => {
      const res = await fetch("/api/admin/analytics");
      if (!res.ok) throw new Error("Failed to fetch analytics data");
      return res.json();
    },
  });

  return (
    <DashboardLayout userRole="ADMIN" userEmail="admin@haisolink.com">
      <div className="space-y-8 pb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/80">
            Overview Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time analytics and operational visibility.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Today's Orders"
            value={isDashboardLoading ? "..." : dashboardData?.todaysOrders.toString()}
            description="Created since midnight"
            icon={<Package className="h-4 w-4 text-primary" />}
          />
          <StatCard
            title="Today's Revenue"
            value={isDashboardLoading ? "..." : `$${dashboardData?.todaysRevenue.toLocaleString()}`}
            description="Total charges accumulated"
            icon={<DollarSign className="h-4 w-4 text-emerald-500" />}
          />
          <StatCard
            title="Active Deliveries"
            value={isDashboardLoading ? "..." : dashboardData?.activeDeliveries.toString()}
            description="In Transit & Out for Delivery"
            icon={<Truck className="h-4 w-4 text-blue-500" />}
          />
          <StatCard
            title="Available Agents"
            value={isDashboardLoading ? "..." : dashboardData?.availableAgents.toString()}
            description="Ready for dispatch"
            icon={<Users className="h-4 w-4 text-indigo-500" />}
          />
          <StatCard
            title="Busy Agents"
            value={isDashboardLoading ? "..." : dashboardData?.busyAgents.toString()}
            description="Currently delivering"
            icon={<Activity className="h-4 w-4 text-amber-500" />}
          />
          <StatCard
            title="Failed Deliveries"
            value={isDashboardLoading ? "..." : dashboardData?.failedDeliveries.toString()}
            description="All time failed deliveries"
            icon={<AlertTriangle className="h-4 w-4 text-rose-500" />}
          />
          <StatCard
            title="Pending Assignments"
            value={isDashboardLoading ? "..." : dashboardData?.pendingAssignments.toString()}
            description="Created but unassigned"
            icon={<Package className="h-4 w-4 text-orange-500" />}
          />
          <StatCard
            title="Success Rate"
            value={isAnalyticsLoading ? "..." : `${analyticsData?.deliverySuccessRate}%`}
            description="Percentage of successful deliveries"
            icon={<Activity className="h-4 w-4 text-emerald-500" />}
          />
        </div>

        {/* Live Status Board using SSE */}
        <LiveStatusBoard />

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Orders Trend */}
          <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-sm">
            <h3 className="text-lg font-bold tracking-tight mb-4">Orders Trend (Last 7 Days)</h3>
            {isAnalyticsLoading ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground animate-pulse">Loading chart...</div>
            ) : (
              <OrdersLineChart data={analyticsData?.ordersPerDay || []} />
            )}
          </div>

          {/* Revenue Trend */}
          <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-sm">
            <h3 className="text-lg font-bold tracking-tight mb-4">Revenue Trend (Last 7 Days)</h3>
            {isAnalyticsLoading ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground animate-pulse">Loading chart...</div>
            ) : (
              <RevenueAreaChart data={analyticsData?.revenueTrend || []} />
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Delivery Status Distribution */}
          <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-sm">
            <h3 className="text-lg font-bold tracking-tight mb-4">Delivery Status</h3>
            {isAnalyticsLoading ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground animate-pulse">Loading chart...</div>
            ) : (
              <StatusPieChart data={analyticsData?.deliveryStatusDistribution || []} />
            )}
          </div>

          {/* Orders by Zone */}
          <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-sm lg:col-span-2">
            <h3 className="text-lg font-bold tracking-tight mb-4">Orders by Pickup Zone</h3>
            {isAnalyticsLoading ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground animate-pulse">Loading chart...</div>
            ) : (
              <ZonesBarChart data={analyticsData?.ordersByZone || []} />
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* B2B vs B2C */}
          <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-sm">
            <h3 className="text-lg font-bold tracking-tight mb-4">B2B vs B2C</h3>
            {isAnalyticsLoading ? (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground animate-pulse">Loading chart...</div>
            ) : (
              <B2bVsB2cDonutChart data={analyticsData?.b2bVsB2c || []} />
            )}
          </div>

          {/* COD vs Prepaid */}
          <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-sm">
            <h3 className="text-lg font-bold tracking-tight mb-4">Payment Methods</h3>
            {isAnalyticsLoading ? (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground animate-pulse">Loading chart...</div>
            ) : (
              <CodVsPrepaidBarChart data={analyticsData?.codVsPrepaid || []} />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
