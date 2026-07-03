"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Settings, Globe, Shield, Bell, CheckCircle2, Factory, Database } from "lucide-react";

export default function AdminSettingsPage() {
  const [isSaved, setIsSaved] = React.useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <DashboardLayout userRole="ADMIN" userEmail="admin@haisolink.com">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <Settings className="h-8 w-8 text-primary" /> System Settings
            </h1>
            <p className="text-muted-foreground mt-1">Configure global application parameters and integrations.</p>
          </div>
          <Button onClick={handleSave} className="font-bold shadow-md shadow-primary/20">
            Save Configuration
          </Button>
        </div>

        {isSaved && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl flex items-center gap-2 font-bold animate-in fade-in">
            <CheckCircle2 className="h-5 w-5" /> Settings updated successfully!
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1 space-y-2">
            <Button variant="secondary" className="w-full justify-start rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90">
              <Factory className="mr-2 h-4 w-4" /> General
            </Button>
            <Button variant="ghost" className="w-full justify-start rounded-xl font-semibold hover:bg-secondary/50">
              <Globe className="mr-2 h-4 w-4" /> Localization
            </Button>
            <Button variant="ghost" className="w-full justify-start rounded-xl font-semibold hover:bg-secondary/50">
              <Shield className="mr-2 h-4 w-4" /> Security & Auth
            </Button>
            <Button variant="ghost" className="w-full justify-start rounded-xl font-semibold hover:bg-secondary/50">
              <Bell className="mr-2 h-4 w-4" /> Notifications
            </Button>
            <Button variant="ghost" className="w-full justify-start rounded-xl font-semibold hover:bg-secondary/50">
              <Database className="mr-2 h-4 w-4" /> Backups
            </Button>
          </div>

          <div className="md:col-span-3 space-y-6">
            <Card className="border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
                <CardDescription>Main public information for Haisolink</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Company Name</label>
                    <Input defaultValue="HaisoLink Logistics" className="rounded-xl border-border/50 bg-background/50 focus-visible:ring-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Support Email</label>
                    <Input defaultValue="support@haisolink.com" className="rounded-xl border-border/50 bg-background/50 focus-visible:ring-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Support Phone</label>
                    <Input defaultValue="+1 (800) 123-4567" className="rounded-xl border-border/50 bg-background/50 focus-visible:ring-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Headquarters</label>
                    <Input defaultValue="Metro City, USA" className="rounded-xl border-border/50 bg-background/50 focus-visible:ring-primary/20" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle>Operational Defaults</CardTitle>
                <CardDescription>Default parameters for the routing engine.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Max Load Per Agent (kg)</label>
                    <Input type="number" defaultValue="250" className="rounded-xl border-border/50 bg-background/50 focus-visible:ring-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Standard Delivery SLA (Hours)</label>
                    <Input type="number" defaultValue="48" className="rounded-xl border-border/50 bg-background/50 focus-visible:ring-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Express Delivery SLA (Hours)</label>
                    <Input type="number" defaultValue="12" className="rounded-xl border-border/50 bg-background/50 focus-visible:ring-primary/20" />
                  </div>
                  <div className="space-y-2 flex items-center justify-between p-3 border border-border/40 rounded-xl bg-secondary/10">
                    <div>
                      <h4 className="font-bold text-sm">Auto-Assignment Engine</h4>
                      <p className="text-xs text-muted-foreground">Automatically dispatch to nearest agent</p>
                    </div>
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 font-bold uppercase tracking-wider">Enabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
