"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Building, Home, Shield, Bell, CheckCircle2 } from "lucide-react";

export default function CustomerProfilePage() {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);

  const handleSave = () => {
    setIsEditing(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <DashboardLayout userRole="CUSTOMER" userEmail="customer@haisolink.com">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account settings, addresses, and preferences.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Profile Sidebar */}
          <div className="space-y-6">
            <Card className="border-border/40 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent h-24"></div>
              <div className="px-6 relative -mt-12 mb-4">
                <div className="h-24 w-24 rounded-2xl bg-card border-4 border-background flex items-center justify-center shadow-lg mx-auto md:mx-0">
                  <div className="h-full w-full bg-primary/10 rounded-xl flex items-center justify-center">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                </div>
              </div>
              <CardContent className="text-center md:text-left">
                <h3 className="text-xl font-bold tracking-tight">John Doe</h3>
                <p className="text-sm text-muted-foreground mb-4">customer@haisolink.com</p>
                
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold mb-6">
                  Verified Account
                </Badge>
                
                <div className="space-y-3 pt-4 border-t border-border/40 text-left">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>customer@haisolink.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>+1 (555) 000-0000</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" /> Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start rounded-xl font-semibold">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-xl font-semibold">
                  Two-Factor Authentication
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-border/40 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl">Personal Information</CardTitle>
                  <CardDescription>Update your personal details here.</CardDescription>
                </div>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="rounded-lg font-bold">
                    Edit Profile
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleSave} className="rounded-lg font-bold shadow-md shadow-primary/20">
                    Save Changes
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                {isSaved && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-lg flex items-center gap-2 text-sm font-semibold mb-4 animate-in fade-in">
                    <CheckCircle2 className="h-4 w-4" /> Profile updated successfully!
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                    <Input 
                      defaultValue="John Doe" 
                      disabled={!isEditing} 
                      className="rounded-xl border-border/50 bg-background/50 focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                    <Input 
                      defaultValue="customer@haisolink.com" 
                      disabled={!isEditing} 
                      className="rounded-xl border-border/50 bg-background/50 focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                    <Input 
                      defaultValue="+1 (555) 000-0000" 
                      disabled={!isEditing} 
                      className="rounded-xl border-border/50 bg-background/50 focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Timezone</label>
                    <Input 
                      defaultValue="UTC-05:00 (EST)" 
                      disabled={!isEditing} 
                      className="rounded-xl border-border/50 bg-background/50 focus-visible:ring-primary/20"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl">Saved Addresses</CardTitle>
                  <CardDescription>Manage your frequent pickup and delivery locations.</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="rounded-lg font-bold">
                  Add New
                </Button>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="p-4 border border-border/40 rounded-xl bg-card hover:bg-secondary/10 transition-colors flex items-start gap-4">
                  <div className="p-2.5 bg-primary/10 rounded-lg text-primary shrink-0 mt-0.5">
                    <Home className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold">Home Address</h4>
                      <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary">DEFAULT</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">789 Pine Rd, Metro City, ST 12345</p>
                  </div>
                </div>

                <div className="p-4 border border-border/40 rounded-xl bg-card hover:bg-secondary/10 transition-colors flex items-start gap-4">
                  <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-500 shrink-0 mt-0.5">
                    <Building className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold">Office</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">101 Cedar Ln, Corporate Park, Floor 5, Metro City, ST 12345</p>
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
