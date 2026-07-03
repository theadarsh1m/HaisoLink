"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  const limit = 10;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin", "orders", page, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(searchTerm && { search: searchTerm }),
      });
      const res = await fetch(`/api/admin/orders?${params}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
  });

  const columns = [
    { 
      key: "trackingNumber", 
      label: "Tracking No.",
      render: (val: string, row: any) => (
        <Link href={`/admin/orders/${row.id}`} className="font-semibold text-primary hover:underline">
          {val}
        </Link>
      )
    },
    { key: "customer", label: "Customer" },
    { key: "pickup", label: "Pickup" },
    { key: "destination", label: "Destination" },
    { key: "agent", label: "Agent" },
    { 
      key: "status", 
      label: "Status",
      render: (val: string) => (
        <Badge
          className={
            val === "DELIVERED"
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10"
              : val === "FAILED"
              ? "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/10"
              : val === "IN_TRANSIT" || val === "OUT_FOR_DELIVERY"
              ? "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/10"
              : "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/10"
          }
        >
          {val}
        </Badge>
      )
    },
    { key: "orderType", label: "Type" },
    { key: "paymentType", label: "Payment" },
    { 
      key: "totalCharge", 
      label: "Charges",
      render: (val: number) => `$${val.toFixed(2)}`
    },
    { 
      key: "createdAt", 
      label: "Created At",
      render: (val: string) => format(new Date(val), "MMM dd, yyyy HH:mm")
    },
  ];

  const handleBulkAction = async (action: string, selectedIds: string[]) => {
    // We would implement the bulk action API call here
    console.log(`Performing ${action} on`, selectedIds);
    alert(`Bulk Action: ${action} on ${selectedIds.length} items`);
    // Example: await fetch('/api/admin/orders/bulk', { method: 'POST', body: JSON.stringify({ action, ids: selectedIds }) })
    // refetch();
  };

  return (
    <DashboardLayout userRole="ADMIN" userEmail="admin@haisolink.com">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground mt-1">
            View, search, filter, and export all orders in the system.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={data?.orders || []}
          total={data?.pagination?.total || 0}
          page={page}
          limit={limit}
          isLoading={isLoading}
          onPageChange={setPage}
          onSearch={(term) => {
            setSearchTerm(term);
            setPage(1); // reset to page 1 on search
          }}
          onFilterClick={() => {
            // Future implementation: Open filter sidebar/modal
            alert("Advanced Filters Modal will open here");
          }}
          onBulkAction={handleBulkAction}
        />
      </div>
    </DashboardLayout>
  );
}
