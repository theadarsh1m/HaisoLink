"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DataTable } from "@/components/admin/DataTable";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function AdminAuditLogsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 15;

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "auditLogs", page, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(searchTerm && { search: searchTerm }),
      });
      const res = await fetch(`/api/admin/audit-logs?${params}`);
      if (!res.ok) throw new Error("Failed to fetch audit logs");
      return res.json();
    },
  });

  const columns = [
    { 
      key: "createdAt", 
      label: "Timestamp",
      render: (val: string) => format(new Date(val), "MMM dd, yyyy HH:mm:ss")
    },
    { 
      key: "admin", 
      label: "Admin",
      render: (val: string, row: any) => (
        <div>
          <p className="font-semibold">{val}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      )
    },
    { 
      key: "action", 
      label: "Action",
      render: (val: string) => <Badge variant="outline" className="font-mono">{val}</Badge>
    },
    { 
      key: "entity", 
      label: "Entity",
      render: (val: string, row: any) => (
        <span className="text-sm">
          <strong>{val}</strong> ({row.entityId.substring(0, 8)}...)
        </span>
      )
    },
    { 
      key: "oldValue", 
      label: "Old Value",
      render: (val: string) => (
        <div className="max-w-[150px] truncate text-xs font-mono text-muted-foreground" title={val}>
          {val}
        </div>
      )
    },
    { 
      key: "newValue", 
      label: "New Value",
      render: (val: string) => (
        <div className="max-w-[150px] truncate text-xs font-mono text-emerald-600" title={val}>
          {val}
        </div>
      )
    },
    { key: "ipAddress", label: "IP Address", render: (val: string) => <span className="text-xs font-mono">{val}</span> },
  ];

  return (
    <DashboardLayout userRole="ADMIN" userEmail="admin@haisolink.com">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">System Audit Logs</h1>
          <p className="text-muted-foreground mt-1">
            Immutable record of all administrative actions and system modifications.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={data?.logs || []}
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
