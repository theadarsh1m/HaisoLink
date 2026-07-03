"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";
const MapWrapper = dynamic(() => import("@/components/map/MapWrapper").then(m => m.MapWrapper), { ssr: false });
const AgentMarker = dynamic(() => import("@/components/map/AgentMarker").then(m => m.AgentMarker), { ssr: false });
import { Activity, Users, Truck, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveAgent {
  id: string;
  name: string;
  vehicleType: string;
  latitude: number;
  longitude: number;
  lastUpdate: string;
}

export default function AdminLiveMapPage() {
  const [agents, setAgents] = React.useState<LiveAgent[]>([]);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const fetchAgents = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/agents/live-locations");
      if (res.ok) {
        setAgents(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout userRole="ADMIN" userEmail="admin@haisolink.com">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <Activity className="h-7 w-7 text-primary" /> Live Operations Map
            </h1>
            <p className="text-muted-foreground mt-1">Real-time view of all active delivery agents.</p>
          </div>
          <Button 
            variant="outline" 
            onClick={fetchAgents} 
            disabled={isRefreshing}
            className="rounded-xl font-bold bg-card"
          >
            <RotateCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3 h-[700px] relative rounded-2xl overflow-hidden border border-border/40 shadow-sm">
            <MapWrapper zoom={11}>
              {agents.map((agent) => (
                <AgentMarker 
                  key={agent.id}
                  position={[agent.latitude, agent.longitude]}
                  name={agent.name}
                  vehicle={agent.vehicleType}
                />
              ))}
            </MapWrapper>

            <div className="absolute top-4 left-4 z-[400] bg-card/90 backdrop-blur-md p-3 rounded-xl border border-primary/20 shadow-lg">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Active Agents</p>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <p className="text-2xl font-black">{agents.length}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" /> Active Agents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {agents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No active agents right now.</p>
                ) : (
                  agents.map((agent) => (
                    <div key={agent.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:bg-secondary/20 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Users className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm truncate">{agent.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{agent.vehicleType}</p>
                      </div>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-none text-[10px]">
                        LIVE
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
