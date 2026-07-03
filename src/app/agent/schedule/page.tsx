"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Briefcase } from "lucide-react";

export default function AgentSchedulePage() {
  const shifts = [
    { day: "Today", date: "July 3", time: "09:00 AM - 05:00 PM", zone: "Downtown Metro", status: "ACTIVE" },
    { day: "Tomorrow", date: "July 4", time: "10:00 AM - 06:00 PM", zone: "Suburbia North", status: "SCHEDULED" },
    { day: "Friday", date: "July 5", time: "Off Duty", zone: "-", status: "OFF" },
    { day: "Saturday", date: "July 6", time: "08:00 AM - 02:00 PM", zone: "Uptown", status: "SCHEDULED" },
  ];

  return (
    <DashboardLayout userRole="DELIVERY_AGENT" userEmail="agent@haisolink.com">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <Calendar className="h-7 w-7 text-primary" /> Shift Planner
            </h1>
            <p className="text-muted-foreground mt-1">Manage your upcoming shifts and assigned zones.</p>
          </div>
          <Button className="font-bold">Request Time Off</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card className="border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle>Upcoming Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {shifts.map((shift, i) => (
                  <div key={i} className="p-4 rounded-xl border border-border/40 bg-card hover:bg-secondary/10 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-lg flex flex-col items-center justify-center ${shift.status === 'ACTIVE' ? 'bg-primary/20 text-primary' : shift.status === 'OFF' ? 'bg-secondary text-muted-foreground' : 'bg-blue-500/10 text-blue-500'}`}>
                        <span className="text-[10px] font-bold uppercase">{shift.day.substring(0,3)}</span>
                        <span className="text-lg font-black leading-none">{shift.date.split(' ')[1]}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-base">{shift.day}, {shift.date}</h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {shift.time}</span>
                          {shift.zone !== "-" && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {shift.zone}</span>}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className={`font-bold text-[10px] uppercase ${shift.status === 'ACTIVE' ? 'border-primary text-primary' : shift.status === 'OFF' ? 'text-muted-foreground border-border/50' : 'text-blue-500 border-blue-500/30'}`}>
                      {shift.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border/40 bg-secondary/5">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" /> Shift Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Hours Logged (Week)</p>
                  <p className="font-semibold text-foreground text-xl">32.5 hrs</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Completed Drops</p>
                  <p className="font-semibold text-foreground text-xl">114</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Performance Score</p>
                  <p className="font-semibold text-emerald-500 text-xl">4.8 / 5.0</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
