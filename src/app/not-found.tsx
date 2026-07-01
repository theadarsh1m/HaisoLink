"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-secondary/15 to-background text-center px-4">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="p-4 bg-primary/10 border border-primary/25 rounded-3xl text-primary animate-bounce mb-6">
          <Compass className="h-12 w-12" />
        </div>
        <h1 className="text-7xl font-black tracking-tight text-primary">404</h1>
        <h2 className="text-2xl font-bold tracking-tight mt-4">Wayward Route</h2>
        <p className="text-muted-foreground/80 mt-2 max-w-md text-sm leading-relaxed">
          The dispatch link you followed doesn&apos;t seem to exist or has been redirected to another sorting facility.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/dashboard-redirect">
            <Button className="font-bold px-6 py-5 rounded-xl shadow-lg shadow-primary/20">
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="font-bold px-6 py-5 rounded-xl border-border/40 hover:bg-secondary">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
