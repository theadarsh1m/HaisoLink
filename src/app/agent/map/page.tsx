"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Map, MapPin, Navigation, Package, Clock, ShieldAlert } from "lucide-react";

export default function AgentRoutingMapPage() {
  const stops = [
    { id: "HL-8094", type: "DROP-OFF", address: "789 Pine Rd, Metro City", status: "NEXT", est: "10 mins", weight: "2.4 kg" },
    { id: "HL-7541", type: "PICK-UP", address: "101 Cedar Ln, Suburbia", status: "PENDING", est: "45 mins", weight: "5.0 kg" },
    { id: "HL-6490", type: "DROP-OFF", address: "456 Oak Ave, Uptown", status: "PENDING", est: "1h 20m", weight: "1.2 kg" },
  ];

  return (
    <DashboardLayout userRole="DELIVERY_AGENT" userEmail="agent@haisolink.com">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <Navigation className="h-7 w-7 text-primary" /> Routing Map
            </h1>
            <p className="text-muted-foreground mt-1">Live navigation and optimized drop-off sequence.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-rose-500/20 text-rose-600 hover:bg-rose-500/5 font-bold">
              <ShieldAlert className="h-4 w-4 mr-2" /> Report Issue
            </Button>
            <Button className="font-bold shadow-md shadow-primary/20">
              <MapPin className="h-4 w-4 mr-2" /> Recalculate Route
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 h-[600px]">
          {/* Map Placeholder Area */}
          <div className="lg:col-span-2 relative rounded-2xl overflow-hidden border border-border/40 shadow-sm bg-secondary/10 flex flex-col items-center justify-center group">
            <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v11/static/13.4,52.5,12,0/1200x800?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbG9ja2k1b2owM2tqM3FwZ2c5MndvYm5xIn0.xxx')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
            <Map className="h-16 w-16 text-primary/50 mb-4 animate-bounce" />
            <div className="relative z-10 text-center px-4">
              <h3 className="text-2xl font-black tracking-tight text-foreground/80">Interactive Map Disabled</h3>
              <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                Connect a Maps API provider (Google Maps or Mapbox) to enable live turn-by-turn routing visuals.
              </p>
            </div>
            
            {/* Fake overlay for next stop */}
            <div className="absolute top-6 left-6 right-6 p-4 bg-card/90 backdrop-blur-md rounded-xl border border-primary/20 shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Navigation className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Next Stop in 1.2 miles</p>
                  <h4 className="font-bold text-lg leading-tight">789 Pine Rd, Metro City</h4>
                </div>
              </div>
              <Button size="lg" className="rounded-full shadow-lg shadow-primary/30">
                Navigate
              </Button>
            </div>
          </div>

          {/* Itinerary List */}
          <Card className="border-border/40 shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-border/40 bg-secondary/10 flex justify-between items-center shrink-0">
              <h3 className="font-bold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Today's Itinerary
              </h3>
              <Badge variant="outline" className="font-bold">3 Stops Left</Badge>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {stops.map((stop, i) => (
                <div 
                  key={stop.id} 
                  className={`p-4 rounded-xl border ${stop.status === "NEXT" ? "bg-primary/5 border-primary/30" : "bg-card border-border/40"} relative`}
                >
                  {stop.status === "NEXT" && (
                    <div className="absolute top-0 right-4 -translate-y-1/2">
                      <Badge className="bg-primary text-primary-foreground shadow-sm uppercase font-bold text-[10px]">Current target</Badge>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${stop.type === "DROP-OFF" ? "text-emerald-500" : "text-blue-500"}`}>
                        {stop.type} • {stop.id}
                      </span>
                      <h4 className="font-bold mt-1 leading-tight">{stop.address}</h4>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/20 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> Est: <span className="font-semibold text-foreground">{stop.est}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Package className="h-3.5 w-3.5" /> Weight: <span className="font-semibold text-foreground">{stop.weight}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
