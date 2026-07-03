"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Truck, LayoutDashboard, Shield, ClipboardList, Map, Settings, User, DollarSign, BarChart3 } from "lucide-react";

interface SidebarProps {
  role?: string;
  onClose?: () => void;
}

export function Sidebar({ role = "CUSTOMER", onClose }: SidebarProps) {
  const pathname = usePathname();

  const getNavLinks = () => {
    switch (role.toUpperCase()) {
      case "ADMIN":
        return [
          { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
          { href: "/admin/orders", label: "Orders", icon: ClipboardList },
          { href: "/admin/agents", label: "Agents", icon: User },
          { href: "/admin/zones", label: "Zones", icon: Map },
          { href: "/admin/revenue", label: "Revenue", icon: DollarSign },
          { href: "/admin/audit-logs", label: "Audit Logs", icon: Shield },
          { href: "/admin/reports", label: "Reports", icon: BarChart3 },
          { href: "/admin/settings", label: "Settings", icon: Settings },
        ];
      case "DELIVERY_AGENT":
        return [
          { href: "/agent/dashboard", label: "My Fleet Duties", icon: LayoutDashboard },
          { href: "/agent/schedule", label: "Shift Planner", icon: ClipboardList },
          { href: "/agent/map", label: "Routing Map", icon: Map },
        ];
      case "CUSTOMER":
      default:
        return [
          { href: "/customer/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { href: "/customer/tracking", label: "Track Package", icon: Map },
          { href: "/customer/profile", label: "My Profile", icon: User },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <aside className="w-64 border-r border-border/40 bg-card/45 backdrop-blur-md flex flex-col h-full z-45">
      {}
      <div className="flex h-16 items-center px-6 border-b border-border/40 gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
          <Truck className="h-4.5 w-4.5" />
        </div>
        <span className="font-extrabold text-lg tracking-tight text-primary">
          HaisoLink
        </span>
      </div>

      {}
      <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-300",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "text-muted-foreground/80 hover:bg-secondary/70 hover:text-foreground"
              )}
            >
              <Icon className="h-4.5 w-4.5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {}
      <div className="p-4 border-t border-border/40 bg-secondary/15">
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-card border border-border/20">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Enterprise Tier
          </span>
          <span className="text-xs font-semibold text-foreground/90 truncate">
            HaisoLink v1.0.0
          </span>
        </div>
      </div>
    </aside>
  );
}
