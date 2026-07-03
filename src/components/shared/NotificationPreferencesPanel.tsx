"use client";

import * as React from "react";
import { Bell, Mail, MessageSquare, Smartphone, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationPreferencesPanel() {
  const [prefs, setPrefs] = React.useState({
    emailEnabled: true,
    smsEnabled: true,
    inAppEnabled: true,
  });
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const res = await fetch("/api/notifications/preferences");
        const data = await res.json();
        if (data.success && data.data) {
          setPrefs({
            emailEnabled: data.data.emailEnabled,
            smsEnabled: data.data.smsEnabled,
            inAppEnabled: data.data.inAppEnabled,
          });
        }
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchPrefs();
  }, []);

  const savePrefs = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/notifications/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
      if (res.ok) {
        setMessage("Preferences updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch {} finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className="bg-card/65 backdrop-blur-md rounded-2xl border border-border/40 p-6 flex flex-col h-full shadow-sm">
      <div className="flex items-center gap-2 mb-4 border-b border-border/40 pb-4">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Notification Preferences</h3>
          <p className="text-xs text-muted-foreground">Manage how you receive updates.</p>
        </div>
      </div>
      
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-secondary/10">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-semibold text-sm">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Receive detailed updates via email.</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={prefs.emailEnabled} 
              onChange={(e) => setPrefs(prev => ({...prev, emailEnabled: e.target.checked}))} 
              className="sr-only peer" 
            />
            <div className="w-9 h-5 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-secondary/10">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-semibold text-sm">SMS Notifications</p>
              <p className="text-xs text-muted-foreground">Instant alerts on your mobile number.</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={prefs.smsEnabled} 
              onChange={(e) => setPrefs(prev => ({...prev, smsEnabled: e.target.checked}))} 
              className="sr-only peer" 
            />
            <div className="w-9 h-5 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-secondary/10">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-semibold text-sm">In-App Notifications</p>
              <p className="text-xs text-muted-foreground">Bell alerts in your dashboard.</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={prefs.inAppEnabled} 
              onChange={(e) => setPrefs(prev => ({...prev, inAppEnabled: e.target.checked}))} 
              className="sr-only peer" 
            />
            <div className="w-9 h-5 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
        <span className="text-xs text-emerald-500 font-semibold">{message}</span>
        <Button onClick={savePrefs} disabled={saving} size="sm" className="gap-2">
          {saving ? "Saving..." : <><Save className="w-4 h-4" /> Save Preferences</>}
        </Button>
      </div>
    </div>
  );
}
