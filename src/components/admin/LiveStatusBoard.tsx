"use client";

import React, { useEffect, useState } from "react";
import { Truck, PackageCheck, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveData {
  ordersInTransit: number;
  ordersOutForDelivery: number;
  ordersDeliveredToday: number;
  ordersFailedToday: number;
}

export function LiveStatusBoard() {
  const [data, setData] = useState<LiveData>({
    ordersInTransit: 0,
    ordersOutForDelivery: 0,
    ordersDeliveredToday: 0,
    ordersFailedToday: 0,
  });

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource("/api/admin/live");

    eventSource.onopen = () => {
      setConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setData(parsed);
      } catch (e) {
        console.error("Error parsing SSE data", e);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE Connection Error", error);
      setConnected(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold tracking-tight">Live Status Board</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{connected ? "Connected (Live)" : "Reconnecting..."}</span>
          <div className={cn("w-2 h-2 rounded-full animate-pulse", connected ? "bg-emerald-500" : "bg-amber-500")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Truck className="h-5 w-5" />
            <span className="font-semibold text-sm">In Transit</span>
          </div>
          <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">{data.ordersInTransit}</span>
        </div>
        
        <div className="p-4 rounded-xl border-indigo-500/20 bg-indigo-500/5">
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <Clock className="h-5 w-5" />
            <span className="font-semibold text-sm">Out for Delivery</span>
          </div>
          <span className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{data.ordersOutForDelivery}</span>
        </div>

        <div className="p-4 rounded-xl border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <PackageCheck className="h-5 w-5" />
            <span className="font-semibold text-sm">Delivered Today</span>
          </div>
          <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{data.ordersDeliveredToday}</span>
        </div>

        <div className="p-4 rounded-xl border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertCircle className="h-5 w-5" />
            <span className="font-semibold text-sm">Failed Today</span>
          </div>
          <span className="text-2xl font-bold text-red-700 dark:text-red-400">{data.ordersFailedToday}</span>
        </div>
      </div>
    </div>
  );
}
