"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, AlertCircle, Clock, Truck, CheckCircle2 } from "lucide-react";

export default function CustomerTrackingPage() {
  const [trackingNumber, setTrackingNumber] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);

  // Mock data for demonstration when searching
  const [activeTracker, setActiveTracker] = React.useState<TimelineItem[]>([]);
  const [orderStatus, setOrderStatus] = React.useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      setHasSearched(true);
      setIsSearching(false);
      
      // If tracking number exists in mock
      if (trackingNumber.toUpperCase().includes("HL")) {
        setOrderStatus("IN_TRANSIT");
        setActiveTracker([
          { 
            id: "1", 
            title: "In Transit", 
            description: "Package departed from Metro Hub. Moving towards local destination.", 
            time: "10 mins ago", 
            status: "current" 
          },
          { 
            id: "2", 
            title: "Picked Up", 
            description: "Package received by our logistics agent.", 
            time: "3 hours ago", 
            status: "completed" 
          },
          { 
            id: "3", 
            title: "Order Created", 
            description: "Shipment details received electronically.", 
            time: "5 hours ago", 
            status: "completed" 
          },
        ]);
      } else {
        setOrderStatus(null);
        setActiveTracker([]);
      }
    }, 1500);
  };

  return (
    <DashboardLayout userRole="CUSTOMER" userEmail="customer@haisolink.com">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-2">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Track Your Shipment</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Enter your tracking number below to get real-time updates on your package location and delivery status.
          </p>
        </div>

        <Card className="border-border/40 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardContent className="p-2 sm:p-4">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter Tracking Number (e.g., HL-8094)"
                  className="pl-12 py-6 text-lg rounded-xl border-border/50 bg-background/50 focus-visible:ring-primary/20"
                />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                disabled={isSearching || !trackingNumber.trim()}
                className="py-6 px-8 rounded-xl font-bold text-base shadow-md shadow-primary/20"
              >
                {isSearching ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Searching...
                  </span>
                ) : (
                  "Track Package"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {hasSearched && !isSearching && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            {orderStatus ? (
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                  <Card className="border-border/40 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 border-b border-border/40">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Tracking Number</p>
                          <h2 className="text-3xl font-black mt-1 font-mono tracking-tight">{trackingNumber.toUpperCase()}</h2>
                        </div>
                        <Badge 
                          className="px-4 py-1.5 text-sm font-bold tracking-widest uppercase rounded-lg"
                        >
                          {orderStatus.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold tracking-tight mb-6 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" /> Tracking Timeline
                      </h3>
                      <Timeline items={activeTracker} />
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card className="border-border/40 bg-secondary/5">
                    <CardHeader className="pb-3 border-b border-border/40">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Truck className="h-5 w-5 text-primary" /> Delivery Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Expected Delivery</p>
                        <p className="font-semibold text-foreground">Tomorrow, by 8:00 PM</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Carrier</p>
                        <p className="font-semibold text-foreground">Haisolink Express</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Weight</p>
                        <p className="font-semibold text-foreground">2.4 kg</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-4 flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-primary">Need Help?</p>
                        <p className="text-xs text-muted-foreground mt-1">If you have any issues with this delivery, please contact our support team.</p>
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
    </DashboardLayout>
  );
}
