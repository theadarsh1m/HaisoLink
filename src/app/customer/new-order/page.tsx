"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DynamicDeliveryMap } from "@/components/map/DynamicDeliveryMap";
import { AddressSearchBox } from "@/components/map/AddressSearchBox";
import { CurrentLocationButton } from "@/components/map/CurrentLocationButton";
import { Package, Truck, CreditCard, ArrowRight, CheckCircle2 } from "lucide-react";
import type { GeocodingResult } from "@/lib/services/geocoding-service";
import type { RouteResult } from "@/lib/services/routing-service";
import { Badge } from "@/components/ui/badge";

export default function NewOrderPage() {
  const router = useRouter();
  
  // Location State
  const [pickup, setPickup] = React.useState<GeocodingResult | null>(null);
  const [destination, setDestination] = React.useState<GeocodingResult | null>(null);
  const [route, setRoute] = React.useState<RouteResult | null>(null);
  
  // Package State
  const [weight, setWeight] = React.useState("1.0");
  const [length, setLength] = React.useState("20");
  const [width, setWidth] = React.useState("20");
  const [height, setHeight] = React.useState("20");
  
  // Options State
  const [orderType, setOrderType] = React.useState<"STANDARD" | "EXPRESS">("STANDARD");
  const [paymentType, setPaymentType] = React.useState<"PREPAID" | "COD">("PREPAID");
  
  // UI State
  const [step, setStep] = React.useState<"LOCATION" | "DETAILS" | "CONFIRM">("LOCATION");
  const [isCalculating, setIsCalculating] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [priceDetails, setPriceDetails] = React.useState<{ shippingCharge: number; CODCharge: number; totalCharge: number } | null>(null);
  const [isPricing, setIsPricing] = React.useState(false);

  // Keep refs to latest values to avoid stale closures
  const pickupRef = React.useRef(pickup);
  const destinationRef = React.useRef(destination);
  pickupRef.current = pickup;
  destinationRef.current = destination;

  // Auto-calculate route when both points are selected
  React.useEffect(() => {
    if (pickup && destination) {
      calculateRoute(pickup, destination);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickup?.lat, pickup?.lng, destination?.lat, destination?.lng]);

  const calculateRoute = async (p = pickupRef.current, d = destinationRef.current) => {
    if (!p || !d) return;
    setIsCalculating(true);
    try {
      const params = new URLSearchParams({
        pickupLat: p.lat.toString(),
        pickupLng: p.lng.toString(),
        destLat: d.lat.toString(),
        destLng: d.lng.toString(),
      });
      const res = await fetch(`/api/routes?${params}`);
      if (res.ok) {
        const data = await res.json();
        setRoute(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleMapClick = async (lat: number, lng: number) => {
    try {
      const params = new URLSearchParams({ lat: lat.toString(), lng: lng.toString() });
      const res = await fetch(`/api/reverse-geocode?${params}`);
      if (res.ok) {
        const result = await res.json();
        if (!pickup) setPickup(result);
        else if (!destination) setDestination(result);
        else {
          // If both are set, reset and start over from pickup
          setPickup(result);
          setDestination(null);
          setRoute(null);
        }
      }
    } catch (err) {
      console.error("Reverse geocoding failed", err);
    }
  };

  const resolveArea = async (geo: GeocodingResult) => {
    const res = await fetch("/api/areas/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        latitude: geo.lat,
        longitude: geo.lng,
        areaName: geo.displayName.split(",").slice(0, 2).join(","),
        city: geo.address.city || "",
        state: geo.address.state || "",
        pincode: geo.address.postcode || "",
      }),
    });
    const data = await res.json();
    return data.id;
  };

  const handleSubmit = async () => {
    if (!pickup || !destination || !priceDetails) return;
    setIsSubmitting(true);
    setError("");
    
    try {
      const pickupAreaId = await resolveArea(pickup);
      const destinationAreaId = await resolveArea(destination);

      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickupAreaId,
          destinationAreaId,
          orderType,
          paymentType,
          packageLength: parseFloat(length),
          packageWidth: parseFloat(width),
          packageHeight: parseFloat(height),
          actualWeight: parseFloat(weight),
          shippingCharge: priceDetails.shippingCharge,
          CODCharge: priceDetails.CODCharge,
          totalCharge: priceDetails.totalCharge,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create order");
      }

      // Order created successfully
      router.push("/customer/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (step === "CONFIRM" && pickup && destination) {
      const fetchPrice = async () => {
        setIsPricing(true);
        setError("");
        try {
          const res = await fetch("/api/orders/calculate-price", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pickupLat: pickup.lat,
              pickupLng: pickup.lng,
              pickupName: pickup.displayName.split(",").slice(0, 2).join(","),
              destLat: destination.lat,
              destLng: destination.lng,
              destName: destination.displayName.split(",").slice(0, 2).join(","),
              orderType,
              paymentType,
              length: parseFloat(length),
              width: parseFloat(width),
              height: parseFloat(height),
              actualWeight: parseFloat(weight),
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to calculate price");
          setPriceDetails(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsPricing(false);
        }
      };
      fetchPrice();
    }
  }, [step, paymentType, pickup, destination, orderType, length, width, height, weight]);

  return (
    <DashboardLayout userRole="CUSTOMER" userEmail="customer@haisolink.com">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Book New Delivery</h1>
          <p className="text-muted-foreground mt-1">Select locations and package details to create a new order.</p>
        </div>

        {/* STEPPER */}
        <div className="flex items-center justify-between mb-8">
          {["LOCATION", "DETAILS", "CONFIRM"].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${step === s || (step === "CONFIRM" && i < 2) || (step === "DETAILS" && i === 0) ? "bg-primary text-primary-foreground shadow-md" : "bg-secondary text-muted-foreground"}`}>
                {i + 1}
              </div>
              <span className={`ml-3 font-semibold ${step === s ? "text-foreground" : "text-muted-foreground"}`}>
                {s === "LOCATION" ? "Locations" : s === "DETAILS" ? "Package" : "Checkout"}
              </span>
              {i < 2 && <div className="mx-4 h-0.5 w-12 sm:w-32 bg-border/50" />}
            </div>
          ))}
        </div>

        {/* STEP 1: LOCATIONS */}
        {step === "LOCATION" && (
          <div className="space-y-4">
            {/* Map - full width at top */}
            <div className="relative rounded-2xl overflow-visible border border-border/40 shadow-sm h-[400px] sm:h-[480px]">
              <DynamicDeliveryMap 
                center={pickup ? [pickup.lat, pickup.lng] : undefined}
                zoom={pickup ? 13 : 11}
                onClick={handleMapClick}
                pickup={pickup ? [pickup.lat, pickup.lng] : null}
                destination={destination ? [destination.lat, destination.lng] : null}
                routeCoordinates={route?.coordinates || undefined}
              />
              {isCalculating && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] bg-card/90 backdrop-blur-md px-4 py-2 rounded-full border border-primary/20 shadow-lg flex items-center gap-2 text-sm font-medium">
                  <div className="h-3.5 w-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Calculating route...
                </div>
              )}
            </div>

            {/* Pickup + Destination side by side on desktop, stacked on mobile */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="overflow-visible">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" /> Pickup Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 overflow-visible">
                  <div className="relative overflow-visible">
                    <AddressSearchBox
                      placeholder="Search pickup address..."
                      onSelect={(res) => setPickup(res)}
                    />
                  </div>
                  <CurrentLocationButton onLocation={handleMapClick} className="w-full" />
                  {pickup && (
                    <div className="p-3 bg-emerald-500/10 rounded-lg text-sm border border-emerald-500/20">
                      <p className="font-medium text-emerald-700 dark:text-emerald-400 text-xs truncate">{pickup.displayName}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="overflow-visible">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" /> Destination
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 overflow-visible">
                  <div className="relative overflow-visible">
                    <AddressSearchBox
                      placeholder="Search destination address..."
                      onSelect={(res) => setDestination(res)}
                    />
                  </div>
                  {destination && (
                    <div className="p-3 bg-rose-500/10 rounded-lg text-sm border border-rose-500/20">
                      <p className="font-medium text-rose-700 dark:text-rose-400 text-xs truncate">{destination.displayName}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {route && (
              <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
                <div className="h-10 w-10 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <ArrowRight className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Route calculated</p>
                  <p className="font-bold">{route.distanceKm.toFixed(1)} km &bull; est. {route.durationMinutes} mins</p>
                </div>
              </div>
            )}

            <Button 
              className="w-full font-bold rounded-xl shadow-lg h-12 text-base"
              disabled={!pickup || !destination || isCalculating}
              onClick={() => setStep("DETAILS")}
            >
              {isCalculating ? (
                <><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> Calculating Route...</>
              ) : (
                <>Continue to Package Details <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </div>
        )}

        {/* STEP 2: PACKAGE DETAILS */}
        {step === "DETAILS" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5 text-primary" /> Package Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Actual Weight (kg)</Label>
                  <Input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Length (cm)</Label>
                    <Input type="number" value={length} onChange={(e) => setLength(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Width (cm)</Label>
                    <Input type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Height (cm)</Label>
                    <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5 text-primary" /> Service Type</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div 
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${orderType === "STANDARD" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                  onClick={() => setOrderType("STANDARD")}
                >
                  <h4 className="font-bold">Standard</h4>
                  <p className="text-sm text-muted-foreground mt-1">2-3 business days</p>
                </div>
                <div 
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${orderType === "EXPRESS" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                  onClick={() => setOrderType("EXPRESS")}
                >
                  <h4 className="font-bold">Express</h4>
                  <p className="text-sm text-muted-foreground mt-1">Same day / Next day</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
              <Button variant="outline" className="w-full rounded-xl h-12" onClick={() => setStep("LOCATION")}>Back</Button>
              <Button className="w-full font-bold rounded-xl h-12 shadow-lg" onClick={() => setStep("CONFIRM")}>Continue to Checkout <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        )}

        {/* STEP 3: CONFIRM & CHECKOUT */}
        {step === "CONFIRM" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div 
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentType === "PREPAID" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                  onClick={() => setPaymentType("PREPAID")}
                >
                  <h4 className="font-bold">Prepaid</h4>
                  <p className="text-sm text-muted-foreground mt-1">Pay via card/UPI now</p>
                </div>
                <div 
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentType === "COD" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                  onClick={() => setPaymentType("COD")}
                >
                  <h4 className="font-bold">Cash on Delivery</h4>
                  <p className="text-sm text-muted-foreground mt-1">$2.00 surcharge applies</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Route Distance</span>
                  <span className="font-medium">{route?.distanceKm.toFixed(1)} km</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service Level</span>
                  <Badge variant="outline">{orderType}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Package Details</span>
                  <span className="font-medium">{weight}kg ({length}x{width}x{height}cm)</span>
                </div>
                <div className="h-px bg-border/50 my-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping Charge</span>
                  <span className="font-medium">
                    {isPricing ? <span className="animate-pulse">Calculating...</span> : priceDetails ? `$${priceDetails.shippingCharge.toFixed(2)}` : "-"}
                  </span>
                </div>
                {paymentType === "COD" && (
                  <div className="flex justify-between text-sm text-rose-500">
                    <span>COD Surcharge</span>
                    <span>{isPricing ? <span className="animate-pulse">Calculating...</span> : priceDetails ? `+$${priceDetails.CODCharge.toFixed(2)}` : "-"}</span>
                  </div>
                )}
                {priceDetails && !isPricing && (
                  <>
                    <div className="h-px bg-border/50 my-2" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${priceDetails.totalCharge.toFixed(2)}</span>
                    </div>
                  </>
                )}
                
                {error && (
                  <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg mt-4 font-medium border border-destructive/20">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
              <Button variant="outline" className="w-full rounded-xl h-12" onClick={() => setStep("DETAILS")} disabled={isSubmitting}>Back</Button>
              <Button 
                className="w-full font-bold rounded-xl h-12 shadow-lg" 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : (
                  <><CheckCircle2 className="mr-2 h-4 w-4" /> Confirm & Place Order</>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
