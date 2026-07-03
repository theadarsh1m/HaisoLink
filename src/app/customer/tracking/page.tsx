"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, AlertCircle, Clock, Truck, CheckCircle2 } from "lucide-react";
import { DynamicDeliveryMap } from "@/components/map/DynamicDeliveryMap";
import type { RouteResult } from "@/lib/services/routing-service";
import { useSearchParams } from "next/navigation";

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialTrackingNumber = searchParams.get("trackingNumber") || "";

  const [trackingNumber, setTrackingNumber] = React.useState(initialTrackingNumber);
  const [isSearching, setIsSearching] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);

  const [mapData, setMapData] = React.useState<any>(null);
  const [route, setRoute] = React.useState<RouteResult | null>(null);

  const [activeTracker, setActiveTracker] = React.useState<TimelineItem[]>([]);
  const [orderStatus, setOrderStatus] = React.useState<string | null>(null);

  const executeSearch = React.useCallback(async (num: string) => {
    if (!num.trim()) return;
    setIsSearching(true);
    
    try {
      // Run map data and order details in parallel
      const [mapRes, orderRes] = await Promise.all([
        fetch(`/api/orders/${num}/map`),
        fetch(`/api/orders/${num}`),
      ]);
      setHasSearched(true);
      
      if (mapRes.ok) {
        const data = await mapRes.json();
        setMapData(data);
        setOrderStatus(data.status);
        
        // Calculate route
        const routeParams = new URLSearchParams({
          pickupLat: data.pickup.lat.toString(),
          pickupLng: data.pickup.lng.toString(),
          destLat: data.destination.lat.toString(),
          destLng: data.destination.lng.toString(),
        });
        const routeRes = await fetch(`/api/routes?${routeParams}`);
        if (routeRes.ok) {
          setRoute(await routeRes.json());
        }

        // Build tracking history from real DB data
        if (orderRes.ok) {
          const orderData = await orderRes.json();
          const histories = orderData?.trackingHistories || [];
          if (histories.length > 0) {
            setActiveTracker(histories.map((h: any, idx: number) => ({
              id: h.id || String(idx),
              title: String(h.newStatus).replace(/_/g, " "),
              description: h.remarks || "Status updated",
              time: new Date(h.timestamp).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
              status: idx === 0 ? "current" : "completed",
            })));
          } else {
            // Fallback to just the current status
            setActiveTracker([{
              id: "1",
              title: data.status.replace(/_/g, " "),
              description: "Order created successfully",
              time: "Just now",
              status: "current",
            }]);
          }
        }
      } else {
        setOrderStatus(null);
        setMapData(null);
      }
    } catch (err) {
      console.error(err);
      setOrderStatus(null);
      setMapData(null);
    } finally {
      setIsSearching(false);
    }
  }, []);

  React.useEffect(() => {
    if (initialTrackingNumber) {
      setTrackingNumber(initialTrackingNumber);
      executeSearch(initialTrackingNumber);
    }
  }, [initialTrackingNumber, executeSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(trackingNumber);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            Track Package
          </h1>
          <p className="text-muted-foreground mt-1">Enter your tracking number to get live updates.</p>
        </div>
        <form onSubmit={handleSearch} className="flex max-w-sm w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="e.g. HL-8094" 
            className="pl-10 pr-24 h-12 bg-card rounded-xl font-mono text-base uppercase"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
          <Button 
            type="submit" 
            className="absolute right-1 top-1 bottom-1 h-10 rounded-lg font-bold"
            disabled={isSearching || !trackingNumber.trim()}
          >
            {isSearching ? "Searching..." : "Track"}
          </Button>
        </form>
      </div>

      {hasSearched && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {orderStatus ? (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                {/* Interactive Map */}
                <Card className="overflow-hidden border-border/40 shadow-sm relative h-[600px] p-0">
                  <DynamicDeliveryMap 
                    center={mapData?.agentLocation ? [mapData.agentLocation.lat, mapData.agentLocation.lng] : (mapData ? [mapData.pickup.lat, mapData.pickup.lng] : undefined)}
                    zoom={12}
                    pickup={mapData?.pickup ? [mapData.pickup.lat, mapData.pickup.lng] : null}
                    destination={mapData?.destination ? [mapData.destination.lat, mapData.destination.lng] : null}
                    agent={mapData?.agentLocation ? [mapData.agentLocation.lat, mapData.agentLocation.lng] : null}
                    agentName={mapData?.agentLocation?.name}
                    agentVehicle={mapData?.agentLocation?.vehicle}
                    routeCoordinates={route?.coordinates || undefined}
                  />
                  
                  {/* Overlay Stats */}
                  {mapData && (
                    <div className="absolute top-4 left-4 right-4 z-[400] flex justify-between pointer-events-none">
                      <div className="bg-card/90 backdrop-blur-md p-3 rounded-xl border border-primary/20 shadow-lg pointer-events-auto">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Est. Time of Arrival</p>
                        <p className="text-2xl font-black text-primary">{mapData.eta} mins</p>
                      </div>
                      <div className="bg-card/90 backdrop-blur-md p-3 rounded-xl border border-primary/20 shadow-lg pointer-events-auto text-right">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Distance</p>
                        <p className="text-2xl font-black">{mapData.distanceKm.toFixed(1)} km</p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              <div className="space-y-6">
                {/* Status Card */}
                <Card className="border-border/40 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm font-bold uppercase tracking-wider">
                      {orderStatus.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">Delivery Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-border/40 bg-secondary/10">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/20 text-primary shrink-0">
                        <Truck className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Courier assigned</p>
                        <p className="font-semibold text-foreground">{mapData?.agentLocation?.name || "Pending Assignment"}</p>
                        {mapData?.agentLocation?.vehicle && <p className="text-xs text-muted-foreground mt-0.5">{mapData.agentLocation.vehicle}</p>}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-widest">Journey Timeline</h4>
                      <Timeline items={activeTracker} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="border-dashed border-2 border-border/50 bg-transparent">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="p-4 bg-secondary rounded-full mb-4">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">No Tracking Information Found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We couldn&apos;t find any details for tracking number <span className="font-mono font-bold text-foreground">&quot;{trackingNumber}&quot;</span>. Please check the number and try again.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default function CustomerTrackingPage() {
  return (
    <DashboardLayout userRole="CUSTOMER" userEmail="customer@haisolink.com">
      <React.Suspense fallback={
        <div className="max-w-7xl mx-auto flex items-center justify-center h-96">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <TrackingContent />
      </React.Suspense>
    </DashboardLayout>
  );
}
