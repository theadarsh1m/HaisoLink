import * as React from "react";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import { Truck } from "lucide-react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/25 to-background overflow-hidden px-4 py-12">
      {}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />

      {}
      <div className="absolute top-6 right-6 z-55">
        <ThemeSwitcher />
      </div>

      <div className="w-full max-w-md z-10 flex flex-col items-center">
        {}
        <div className="flex items-center gap-2 mb-8 group cursor-default">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
            <Truck className="h-5 w-5" />
          </div>
          <span className="text-2xl font-black tracking-tight text-primary">
            HaisoLink
          </span>
        </div>

        {}
        <div className="w-full bg-card/50 backdrop-blur-lg border border-border/40 rounded-2xl shadow-xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          {children}
        </div>
      </div>
    </div>
  );
}
