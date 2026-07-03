"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, Briefcase, ShoppingBag, CreditCard, Banknote } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminRevenuePage() {
  const [range, setRange] = useState("daily");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "revenue", range],
    queryFn: async () => {
      const res = await fetch(`/api/admin/revenue?range=${range}`);
      if (!res.ok) throw new Error("Failed to fetch revenue");
      return res.json();
    },
  });

  return (
    <DashboardLayout userRole="ADMIN" userEmail="admin@haisolink.com">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Revenue Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Financial overview and revenue breakdown.
            </p>
          </div>
          <div className="w-40">
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Last 30 Days</SelectItem>
                <SelectItem value="weekly">Last 7 Days</SelectItem>
                <SelectItem value="monthly">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Revenue KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Revenue"
            value={isLoading ? "..." : `$${data?.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}`}
            description={`Total revenue for ${range} range`}
            icon={<DollarSign className="h-4 w-4 text-emerald-500" />}
          />
          <StatCard
            title="B2B Revenue"
            value={isLoading ? "..." : `$${data?.splits?.b2b?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}`}
            description="Business to Business"
            icon={<Briefcase className="h-4 w-4 text-blue-500" />}
          />
          <StatCard
            title="B2C Revenue"
            value={isLoading ? "..." : `$${data?.splits?.b2c?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}`}
            description="Business to Customer"
            icon={<ShoppingBag className="h-4 w-4 text-indigo-500" />}
          />
          <StatCard
            title="Prepaid Revenue"
            value={isLoading ? "..." : `$${data?.splits?.prepaid?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}`}
            description="Paid in advance"
            icon={<CreditCard className="h-4 w-4 text-purple-500" />}
          />
          <StatCard
            title="COD Revenue"
            value={isLoading ? "..." : `$${data?.splits?.cod?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}`}
            description="Cash on Delivery"
            icon={<Banknote className="h-4 w-4 text-amber-500" />}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
           <Card>
            <CardHeader>
              <CardTitle>B2B vs B2C Split</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl">
                 <div className="flex items-center gap-3">
                   <div className="w-4 h-4 rounded-full bg-blue-500" />
                   <span className="font-semibold">B2B</span>
                 </div>
                 <span className="font-bold text-lg">${data?.splits?.b2b?.toLocaleString() || "0"}</span>
               </div>
               <div className="flex items-center justify-between p-4 mt-2 bg-secondary/20 rounded-xl">
                 <div className="flex items-center gap-3">
                   <div className="w-4 h-4 rounded-full bg-indigo-500" />
                   <span className="font-semibold">B2C</span>
                 </div>
                 <span className="font-bold text-lg">${data?.splits?.b2c?.toLocaleString() || "0"}</span>
               </div>
            </CardContent>
           </Card>

           <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl">
                 <div className="flex items-center gap-3">
                   <div className="w-4 h-4 rounded-full bg-purple-500" />
                   <span className="font-semibold">Prepaid</span>
                 </div>
                 <span className="font-bold text-lg">${data?.splits?.prepaid?.toLocaleString() || "0"}</span>
               </div>
               <div className="flex items-center justify-between p-4 mt-2 bg-secondary/20 rounded-xl">
                 <div className="flex items-center gap-3">
                   <div className="w-4 h-4 rounded-full bg-amber-500" />
                   <span className="font-semibold">COD</span>
                 </div>
                 <span className="font-bold text-lg">${data?.splits?.cod?.toLocaleString() || "0"}</span>
               </div>
            </CardContent>
           </Card>
        </div>

      </div>
    </DashboardLayout>
  );
}
