"use client";

import * as React from "react";
import { Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CurrentLocationButtonProps {
  onLocation: (lat: number, lng: number) => void;
  className?: string;
}

export function CurrentLocationButton({ onLocation, className = "" }: CurrentLocationButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleClick = () => {
    if (!navigator.geolocation) {
      setError("Your browser doesn't support geolocation");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocation(position.coords.latitude, position.coords.longitude);
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Please allow location access in browser settings");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("GPS is not available on this device");
            break;
          case err.TIMEOUT:
            setError("Location request timed out, please try again");
            break;
          default:
            setError("Unable to get your location");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  return (
    <div className={className}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={isLoading}
        className="w-full rounded-xl font-semibold gap-2"
      >
        {isLoading ? (
          <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : (
          <Crosshair className="h-4 w-4" />
        )}
        {isLoading ? "Locating..." : "Use Current Location"}
      </Button>
      {error && (
        <p className="text-xs text-destructive mt-1.5 font-medium">{error}</p>
      )}
    </div>
  );
}
