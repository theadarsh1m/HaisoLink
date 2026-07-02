"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";

interface Agent {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  vehicleType: string;
  licenseNumber: string;
  currentLatitude: number | null;
  currentLongitude: number | null;
  availabilityStatus: string;
  zoneName: string | null;
  totalDeliveries: number;
  averageRating: number | null;
  activeDeliveries: number;
  lastLocationUpdate: string | null;
}

export default function AdminAgentsPage() {
  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [zoneFilter, setZoneFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [vehicleFilter, setVehicleFilter] = React.useState("");

  React.useEffect(() => {
    async function fetchAgents() {
      try {
        const queryParams = new URLSearchParams();
        if (zoneFilter) queryParams.append("zoneId", zoneFilter);
        if (statusFilter) queryParams.append("availabilityStatus", statusFilter);
        if (vehicleFilter) queryParams.append("vehicleType", vehicleFilter);

        const res = await fetch(`/api/agents?${queryParams.toString()}`);
        if (res.ok) {
          const json = await res.json();
          setAgents(json.data || []);
        }
      } catch {
        setAgents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAgents();
  }, [zoneFilter, statusFilter, vehicleFilter]);

  const filteredAgents = agents.filter((agent) =>
    agent.fullName.toLowerCase().includes(search.toLowerCase()) ||
    agent.email.toLowerCase().includes(search.toLowerCase()) ||
    agent.licenseNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout userRole="ADMIN" userEmail="admin@haisolink.com">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Agent Dispatch Board</h1>
          <p className="text-muted-foreground mt-1">
            Monitor real-time agent availability, routing coordinates, active workloads, and statistics.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center bg-card p-4 rounded-xl border border-border/40">
          <div className="flex-1 min-w-[200px]">
            <Input
              type="text"
              placeholder="Search agent name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-background border-border/40 focus:ring-1"
            />
          </div>

          <div className="min-w-[150px]">
            <Input
              type="text"
              placeholder="Zone ID..."
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="bg-background border-border/40 focus:ring-1"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-background border border-border/40 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-w-[150px]"
          >
            <option value="">All Statuses</option>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="BUSY">BUSY</option>
            <option value="OFFLINE">OFFLINE</option>
            <option value="ON_LEAVE">ON LEAVE</option>
          </select>

          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="bg-background border border-border/40 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-w-[150px]"
          >
            <option value="">All Vehicles</option>
            <option value="MOTORCYCLE">MOTORCYCLE</option>
            <option value="CAR">CAR</option>
            <option value="VAN">VAN</option>
          </select>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader size="md" />
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border/40 overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40 bg-secondary/10">
                  <TableHead className="font-semibold text-xs tracking-wider">FULL NAME</TableHead>
                  <TableHead className="font-semibold text-xs tracking-wider">VEHICLE & LICENSE</TableHead>
                  <TableHead className="font-semibold text-xs tracking-wider">ZONE</TableHead>
                  <TableHead className="font-semibold text-xs tracking-wider">STATUS</TableHead>
                  <TableHead className="font-semibold text-xs tracking-wider">WORKLOAD</TableHead>
                  <TableHead className="font-semibold text-xs tracking-wider">AVERAGE RATING</TableHead>
                  <TableHead className="font-semibold text-xs tracking-wider">COORDINATES</TableHead>
                  <TableHead className="font-semibold text-xs tracking-wider">LAST ACTIVE</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-xs text-muted-foreground">
                      No active agents found matching criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAgents.map((agent) => (
                    <TableRow key={agent.id} className="border-border/25 hover:bg-secondary/15">
                      <TableCell>
                        <div>
                          <p className="font-semibold text-xs text-foreground">{agent.fullName}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{agent.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-[11px] text-foreground">{agent.vehicleType}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{agent.licenseNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-semibold">{agent.zoneName || "Global Roster"}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            agent.availabilityStatus === "AVAILABLE"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : agent.availabilityStatus === "BUSY"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              : "bg-muted/10 text-muted-foreground border-border"
                          }
                        >
                          {agent.availabilityStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {agent.activeDeliveries} active ({agent.totalDeliveries} total)
                      </TableCell>
                      <TableCell className="text-xs font-semibold">
                        {agent.averageRating !== null ? `${agent.averageRating.toFixed(1)} ★` : "—"}
                      </TableCell>
                      <TableCell className="font-mono text-[10px] text-muted-foreground">
                        {agent.currentLatitude !== null && agent.currentLongitude !== null
                          ? `${agent.currentLatitude.toFixed(4)}, ${agent.currentLongitude.toFixed(4)}`
                          : "Unknown"}
                      </TableCell>
                      <TableCell className="text-[11px] text-muted-foreground">
                        {agent.lastLocationUpdate ? new Date(agent.lastLocationUpdate).toLocaleTimeString() : "Never"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
