"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DataTable } from "@/components/admin/DataTable";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
const MapWrapper = dynamic(() => import("@/components/map/MapWrapper").then(m => m.MapWrapper), { ssr: false });
const ZoneOverlay = dynamic(() => import("@/components/map/ZoneOverlay").then(m => m.ZoneOverlay), { ssr: false });
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

// Mock polygon coordinates for demo zones around New Delhi
const MOCK_ZONE_COORDS: Record<string, [number, number][]> = {
  "Central Delhi": [
    [28.64, 77.19],
    [28.64, 77.23],
    [28.60, 77.23],
    [28.60, 77.19],
  ],
  "South Delhi": [
    [28.60, 77.19],
    [28.60, 77.25],
    [28.52, 77.25],
    [28.52, 77.15],
    [28.56, 77.15],
  ],
  "North Delhi": [
    [28.72, 77.15],
    [28.72, 77.25],
    [28.64, 77.25],
    [28.64, 77.15],
  ]
};

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

  const mapZones = data?.zones?.map((z: any) => ({
    id: z.name, // Using name as ID for demo
    name: z.name,
    coordinates: MOCK_ZONE_COORDS[z.name] || [
      [28.62, 77.20],
      [28.62, 77.22],
      [28.60, 77.22],
      [28.60, 77.20],
    ] // Default square
  })) || [];

  return (
    <DashboardLayout userRole="ADMIN" userEmail="admin@haisolink.com">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <MapPin className="h-7 w-7 text-primary" /> Zone Analytics & Map
          </h1>
          <p className="text-muted-foreground mt-1">
            Performance metrics and coverage visualization across geographical routing zones.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
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
          
          <Card className="lg:col-span-2 overflow-hidden h-[500px] lg:h-auto min-h-[500px] border-border/40 shadow-sm">
            <MapWrapper center={[28.6139, 77.209]} zoom={11}>
              <ZoneOverlay zones={mapZones} />
            </MapWrapper>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
