import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import { Truck, ArrowRight, ShieldCheck, MapPin, Gauge } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-background via-secondary/15 to-background overflow-hidden">
      {}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-primary/5 rounded-full blur-[140px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-primary/5 rounded-full blur-[140px]" />

      {}
      <header className="sticky top-0 z-40 w-full border-b border-border/20 bg-background/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6 md:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/25">
              <Truck className="h-4.5 w-4.5" />
            </div>
            <span className="font-black text-lg tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              HaisoLink
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <Link href="/login">
              <Button size="sm" variant="ghost" className="font-bold text-xs uppercase tracking-wider rounded-xl">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="font-bold text-xs uppercase tracking-wider rounded-xl shadow-md">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary uppercase tracking-wider mb-6 animate-pulse">
          🚀 Next-Gen Last-Mile Roster Foundation
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Scalable Last-Mile Logistics{" "}
          <span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Perfected
          </span>
        </h1>
        <p className="text-muted-foreground/80 mt-4 max-w-2xl text-base md:text-lg leading-relaxed">
          HaisoLink orchestrates deliveries with clean architectures, dynamic zone detections,
          Better Auth role access structures, and ready-to-plug pricing modules.
        </p>

        {}
        <div className="grid gap-6 mt-16 sm:grid-cols-3 w-full max-w-3xl">
          {}
          <div className="bg-card/55 backdrop-blur-md rounded-2xl border border-border/40 p-6 flex flex-col justify-between text-left hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div>
              <div className="p-2.5 w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-4 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-wider">Admin Portal</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Control dynamic rates, view active dispatches, and audit agent allocations.
              </p>
            </div>
            <Link href="/admin/dashboard" className="mt-6">
              <Button size="sm" variant="outline" className="w-full font-bold text-xs rounded-xl border-border/40 group hover:bg-secondary">
                Enter Console <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>

          {}
          <div className="bg-card/55 backdrop-blur-md rounded-2xl border border-border/40 p-6 flex flex-col justify-between text-left hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div>
              <div className="p-2.5 w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-4 flex items-center justify-center">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-wider">Customer Portal</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Book new dropoffs, monitor shipment tracking milestones, and edit settings.
              </p>
            </div>
            <Link href="/customer/dashboard" className="mt-6">
              <Button size="sm" variant="outline" className="w-full font-bold text-xs rounded-xl border-border/40 group hover:bg-secondary">
                Book Shipment <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>

          {}
          <div className="bg-card/55 backdrop-blur-md rounded-2xl border border-border/40 p-6 flex flex-col justify-between text-left hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div>
              <div className="p-2.5 w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-4 flex items-center justify-center">
                <Gauge className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-wider">Agent Portal</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Toggle shift availability, access assigned routing maps, and log dropoffs.
              </p>
            </div>
            <Link href="/agent/dashboard" className="mt-6">
              <Button size="sm" variant="outline" className="w-full font-bold text-xs rounded-xl border-border/40 group hover:bg-secondary">
                View Duty <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {}
      <footer className="w-full border-t border-border/20 py-6 text-center text-xs text-muted-foreground mt-auto bg-secondary/5">
        &copy; {new Date().getFullYear()} HaisoLink Inc. All rights reserved. Built with Next.js 15 & React 19.
      </footer>
    </div>
  );
}
