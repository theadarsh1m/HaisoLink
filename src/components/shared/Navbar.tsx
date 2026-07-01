"use client";

import * as React from "react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Bell, Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface NavbarProps {
  onMenuClick?: () => void;
  userEmail?: string;
  userRole?: string;
}

export function Navbar({ onMenuClick, userEmail = "user@haisolink.com", userRole = "Customer" }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/60 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden rounded-lg hover:bg-secondary"
            aria-label="Toggle Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-sm font-semibold text-muted-foreground/80">Workspace</span>
            <span className="text-sm text-muted-foreground/40">/</span>
            <span className="text-sm font-bold text-foreground capitalize">{userRole} Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {}
          <ThemeSwitcher />

          {}
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded-full relative bg-secondary/30 border border-border/10 hover:bg-secondary transition-all"
            aria-label="Notifications"
          >
            <Bell className="h-[1.1rem] w-[1.1rem] text-muted-foreground" />
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          </Button>

          {}
          <div className="flex items-center gap-2 border-l border-border/45 pl-4">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-xs font-semibold text-foreground/90 truncate max-w-[120px]">
                {userEmail.split("@")[0]}
              </span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                {userRole}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-sm">
              <User className="h-4 w-4" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="w-9 h-9 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
