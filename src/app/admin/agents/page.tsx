"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";

export default function AdminAgentsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "agents", page, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(searchTerm && { search: searchTerm }),
      });
      const res = await fetch(`/api/admin/agents?${params}`);
      if (!res.ok) throw new Error("Failed to fetch agents");
      return res.json();
    },
  });

  const columns = [
    { key: "name", label: "Agent Name", render: (val: string, row: any) => (
      <div>
        <p className="font-semibold">{val}</p>
        <p className="text-xs text-muted-foreground">{row.email}</p>
      </div>
    ) },
    { key: "zone", label: "Zone" },
    { key: "vehicleType", label: "Vehicle" },
    { 
      key: "status", 
      label: "Status",
      render: (val: string) => (
        <Badge
          className={
            val === "AVAILABLE"
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : val === "BUSY"
              ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
              : "bg-secondary/50 text-muted-foreground border-border/40"
          }
        >
          {val}
        </Badge>
      )
    },
    { key: "completedDeliveries", label: "Completed" },
    { key: "failedDeliveries", label: "Failed" },
    { 
      key: "rating", 
      label: "Rating",
      render: (val: number) => (
        <div className="flex items-center gap-1 text-amber-500">
          <Star className="h-4 w-4 fill-current" />
          <span className="font-semibold text-foreground">{val.toFixed(1)}</span>
        </div>
      )
    },
  ];

  return (
    <DashboardLayout userRole="ADMIN" userEmail="admin@haisolink.com">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Agent Leaderboard & Management</h1>
          <p className="text-muted-foreground mt-1">
            Monitor agent performance, availability, and active zones.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={data?.agents || []}
          total={data?.pagination?.total || 0}
          page={page}
          limit={limit}
          isLoading={isLoading}
          onPageChange={setPage}
          onSearch={(term) => {
            setSearchTerm(term);
            setPage(1);
          }}
        />
      </div>
    </DashboardLayout>
  );
}
