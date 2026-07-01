"use client";

import * as React from "react";
import { Sidebar } from "@/components/shared/Sidebar";
import { Navbar } from "@/components/shared/Navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: "ADMIN" | "DELIVERY_AGENT" | "CUSTOMER";
  userEmail?: string;
}

export function DashboardLayout({
  children,
  userRole = "CUSTOMER",
  userEmail = "user@haisolink.com",
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {}
      <div className="hidden md:flex h-full flex-shrink-0">
        <Sidebar role={userRole} />
      </div>

      {}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-background/80 backdrop-blur-sm transition-all duration-300">
          <div className="relative flex flex-col h-full animate-in slide-in-from-left duration-300">
            <Sidebar role={userRole} onClose={() => setSidebarOpen(false)} />
          </div>
          {}
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          userRole={userRole}
          userEmail={userEmail}
        />
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-8 md:py-10 bg-secondary/10">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
