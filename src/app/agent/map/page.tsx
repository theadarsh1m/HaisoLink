"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navigation, Package, ShieldAlert, CheckCircle2 } from "lucide-react";
import { DynamicDeliveryMap } from "@/components/map/DynamicDeliveryMap";
import { CurrentLocationButton } from "@/components/map/CurrentLocationButton";
import type { RouteResult } from "@/lib/services/routing-service";
import type { GeocodingResult } from "@/lib/services/geocoding-service";

export default function AgentRoutingMapPage() {
  const [currentLocation, setCurrentLocation] = React.useState<[number, number] | null>(null);
  const [route, setRoute] = React.useState<RouteResult | null>(null);
  
  // Simulated stops for the demo
  const [stops, setStops] = React.useState([
    { id: "HL-8094", type: "DROP-OFF", lat: 28.6139, lng: 77.2090, address: "Connaught Place, New Delhi", status: "NEXT", weight: "2.4 kg" },
    { id: "HL-7541", type: "PICK-UP", lat: 28.6505, lng: 77.2303, address: "Chandni Chowk, New Delhi", status: "PENDING", weight: "5.0 kg" },
    { id: "HL-6490", type: "DROP-OFF", lat: 28.5355, lng: 77.2410, address: "Nehru Place, New Delhi", status: "PENDING", weight: "1.2 kg" },
  ]);

  const activeStop = stops.find(s => s.status === "NEXT");

  const handleLocationUpdate = async (lat: number, lng: number) => {
    setCurrentLocation([lat, lng]);
    
    // Send to backend to broadcast to admin/customer
    try {
      await fetch("/api/location/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: lat, longitude: lng }),
      });
    } catch (e) {
      console.error("Failed to sync location to backend");
    }

    if (activeStop) {
      // Calculate route from current location to next stop
      try {
        const params = new URLSearchParams({
          pickupLat: lat.toString(),
          pickupLng: lng.toString(),
          destLat: activeStop.lat.toString(),
          destLng: activeStop.lng.toString(),
        });
        const res = await fetch(`/api/routes?${params}`);
        if (res.ok) setRoute(await res.json());
      } catch (err) {
        console.error(err);
      }
    }
  };

  const completeActiveStop = () => {
    setStops(prev => {
      const newStops = [...prev];
      const activeIndex = newStops.findIndex(s => s.status === "NEXT");
      if (activeIndex !== -1) {
        newStops[activeIndex].status = "COMPLETED";
        if (activeIndex + 1 < newStops.length) {
          newStops[activeIndex + 1].status = "NEXT";
        }
      }
      return newStops;
    });
    setRoute(null);
  };

  return (
    <DashboardLayout userRole="DELIVERY_AGENT" userEmail="agent@haisolink.com">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <Navigation className="h-7 w-7 text-primary" /> Routing Map
            </h1>
            <p className="text-muted-foreground mt-1">Live navigation and optimized drop-off sequence.</p>
          </div>
          <div className="flex items-center gap-3">
            <CurrentLocationButton onLocation={handleLocationUpdate} />
            <Button variant="outline" className="border-rose-500/20 text-rose-600 hover:bg-rose-500/5 font-bold">
              <ShieldAlert className="h-4 w-4 mr-2" /> Report Issue
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 relative rounded-2xl overflow-hidden border border-border/40 shadow-sm h-[600px]">
            <DynamicDeliveryMap 
              center={currentLocation || (activeStop ? [activeStop.lat, activeStop.lng] : undefined)}
              zoom={currentLocation ? 14 : 11}
              agent={currentLocation}
              agentName="You"
              destination={activeStop ? [activeStop.lat, activeStop.lng] : null}
              routeCoordinates={route?.coordinates || undefined}
            />
            
            {activeStop && route && (
              <div className="absolute top-6 left-6 right-6 p-4 bg-card/90 backdrop-blur-md rounded-xl border border-primary/20 shadow-lg flex items-center justify-between z-[400]">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                    <Navigation className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      Next Stop &bull; {route.distanceKm.toFixed(1)} km &bull; {route.durationMinutes} mins
                    </p>
                    <h4 className="font-bold text-lg leading-tight">{activeStop.address}</h4>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg">Today&apos;s Itinerary</h3>
            <div className="space-y-3">
              {stops.map((stop, index) => (
                <Card 
                  key={stop.id} 
                  className={`border-l-4 overflow-hidden transition-all ${
                    stop.status === "NEXT" 
                      ? "border-l-primary shadow-md scale-100" 
                      : stop.status === "COMPLETED"
                        ? "border-l-emerald-500 opacity-60"
                        : "border-l-border/50 scale-95 opacity-80"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={stop.status === "NEXT" ? "default" : stop.status === "COMPLETED" ? "secondary" : "outline"} className="text-[10px] font-bold">
                          {stop.status}
                        </Badge>
                        <Badge variant="outline" className={`text-[10px] font-bold ${stop.type === "PICK-UP" ? "text-emerald-500 border-emerald-500/30" : "text-blue-500 border-blue-500/30"}`}>
                          {stop.type}
                        </Badge>
                      </div>
                      <span className="text-xs font-bold text-muted-foreground">Stop {index + 1}</span>
                    </div>
                    
                    <h4 className="font-semibold mb-1">{stop.id}</h4>
                    <p className="text-sm text-muted-foreground mb-3 flex items-start gap-1.5">
                      <Navigation className="h-4 w-4 shrink-0 mt-0.5 opacity-70" /> {stop.address}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground font-medium bg-secondary/50 px-2 py-1 rounded-md">
                        <Package className="h-3.5 w-3.5" /> {stop.weight}
                      </div>
                      {stop.status === "NEXT" && (
                        <Button size="sm" className="font-bold rounded-lg h-8 px-4" onClick={completeActiveStop}>
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Arrived
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
