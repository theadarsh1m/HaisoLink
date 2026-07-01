"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-secondary/15 to-background text-center px-4">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="p-4 bg-destructive/10 border border-destructive/25 rounded-3xl text-destructive mb-6 shadow-sm">
          <ShieldAlert className="h-12 w-12" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Access Denied</h1>
        <p className="text-muted-foreground/80 mt-2 max-w-sm text-sm leading-relaxed">
          You do not have the required role authorizations to enter this logistics sector.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/dashboard-redirect">
            <Button className="font-bold px-6 py-5 rounded-xl shadow-lg shadow-primary/20">
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="font-bold px-6 py-5 rounded-xl border-border/40 hover:bg-secondary">
              Sign In with another Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
