"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {

    console.error("Global Error Captured:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-secondary/15 to-background text-center px-4">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="p-4 bg-amber-500/10 border border-amber-500/25 rounded-3xl text-amber-500 mb-6 animate-pulse">
          <AlertCircle className="h-12 w-12" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Something went wrong</h1>
        <p className="text-muted-foreground/80 mt-2 max-w-sm text-sm leading-relaxed">
          An unexpected error occurred in HaisoLink system routing. Our logistics stack has log entries to review.
        </p>
        {error.message && (
          <div className="mt-4 p-3 bg-secondary/60 border border-border/40 rounded-xl max-w-md text-xs font-mono text-muted-foreground break-all">
            {error.message}
          </div>
        )}
        <div className="mt-8 flex gap-4">
          <Button onClick={reset} className="font-bold px-6 py-5 rounded-xl shadow-lg shadow-primary/20">
            <RefreshCcw className="h-4 w-4 mr-2" /> Try again
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/dashboard-redirect")}
            className="font-bold px-6 py-5 rounded-xl border-border/40 hover:bg-secondary"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
