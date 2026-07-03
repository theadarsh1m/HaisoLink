"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DataTable } from "@/components/admin/DataTable";
import { useQuery } from "@tanstack/react-query";

export default function AdminZonesPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "zones", page],
    queryFn: async () => {
      const res = await fetch(`/api/admin/zones?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch zones");
      return res.json();
    },
  });

  const columns = [
    { key: "name", label: "Zone Name", render: (val: string) => <span className="font-bold">{val}</span> },
    { key: "orders", label: "Total Orders" },
    { key: "revenue", label: "Total Revenue", render: (val: number) => `$${val.toFixed(2)}` },
    { key: "avgDeliveryTime", label: "Avg Delivery Time" },
    { key: "failureRate", label: "Failure Rate", render: (val: string) => <span className="text-amber-600 font-medium">{val}</span> },
    { key: "avgWeight", label: "Avg Weight" },
    { key: "avgCharge", label: "Avg Charge" },
  ];

  return (
    <DashboardLayout userRole="ADMIN" userEmail="admin@haisolink.com">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Zone Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Performance metrics across different geographical routing zones.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={data?.zones || []}
          total={data?.pagination?.total || 0}
          page={page}
          limit={limit}
          isLoading={isLoading}
          onPageChange={setPage}
          onSearch={() => {}}
        />
      </div>
    </DashboardLayout>
  );
}
