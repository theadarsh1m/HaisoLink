"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, Circle, AlertTriangle, Calendar, XCircle, ChevronDown, ChevronUp } from "lucide-react";

interface HistoryItem {
  status: string;
  timestamp: string;
  actor: string;
  remarks?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

interface AmazonTimelineProps {
  activeStatus: string;
  history: HistoryItem[];
}

interface StepConfig {
  key: string;
  label: string;
}

const STEPS: StepConfig[] = [
  { key: "Created", label: "Order Created" },
  { key: "Assigned", label: "Assigned" },
  { key: "Picked Up", label: "Picked Up" },
  { key: "In Transit", label: "In Transit" },
  { key: "Out For Delivery", label: "Out For Delivery" },
  { key: "Delivered", label: "Delivered" },
];

export function AmazonTimeline({ activeStatus, history }: AmazonTimelineProps) {
  const [expandedStep, setExpandedStep] = React.useState<string | null>(null);

  const getStepStatus = (stepKey: string): {
    state: "completed" | "current" | "pending";
    matchedLog?: HistoryItem;
  } => {
    const matched = [...history]
      .reverse()
      .find((h) => h.status.toLowerCase() === stepKey.toLowerCase());

    if (matched) {
      if (activeStatus.toLowerCase() === stepKey.toLowerCase()) {
        return { state: "current", matchedLog: matched };
      }
      return { state: "completed", matchedLog: matched };
    }

    return { state: "pending" };
  };

  const hasSpecialStatus = ["failed", "rescheduled", "cancelled"].includes(
    activeStatus.toLowerCase()
  );

  const getSpecialStatusIcon = () => {
    const status = activeStatus.toLowerCase();
    if (status === "failed") return <AlertTriangle className="h-4 w-4 text-rose-500" />;
    if (status === "rescheduled") return <Calendar className="h-4 w-4 text-amber-500" />;
    return <XCircle className="h-4 w-4 text-muted-foreground" />;
  };

  const getSpecialStatusBg = () => {
    const status = activeStatus.toLowerCase();
    if (status === "failed") return "border-rose-500 text-rose-500 bg-rose-50/50 dark:bg-rose-950/20";
    if (status === "rescheduled") return "border-amber-500 text-amber-500 bg-amber-50/50 dark:bg-amber-950/20";
    return "border-muted-foreground text-muted-foreground bg-secondary";
  };

  const specialLog = [...history]
    .reverse()
    .find((h) => h.status.toLowerCase() === activeStatus.toLowerCase());

  return (
    <div className="space-y-6">
      <div className="relative pl-8 border-l border-border/60 space-y-6">
        {STEPS.map((step) => {
          const { state, matchedLog } = getStepStatus(step.key);
          const isCompleted = state === "completed";
          const isCurrent = state === "current";
          const isPending = state === "pending";
          const isExpanded = expandedStep === step.key;

          const displayLog = matchedLog;

          return (
            <div key={step.key} className="relative group">
              <div
                className={cn(
                  "absolute -left-[45px] top-1 flex h-8 w-8 items-center justify-center rounded-full border bg-background transition-all duration-300 shadow-sm",
                  isCompleted && "border-emerald-500 text-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20",
                  isCurrent && "border-primary text-primary bg-primary/10 ring-4 ring-primary/15 animate-pulse",
                  isPending && "border-muted-foreground/30 text-muted-foreground/40 bg-secondary"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 stroke-[3]" />
                ) : isCurrent ? (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                ) : (
                  <Circle className="h-3 w-3 fill-muted-foreground/10 text-muted-foreground/30" />
                )}
              </div>

              <div className="flex flex-col space-y-1">
                <button
                  disabled={isPending}
                  onClick={() => setExpandedStep(isExpanded ? null : step.key)}
                  className={cn(
                    "flex items-center justify-between w-full text-left font-semibold text-sm tracking-tight transition-all duration-200",
                    isPending ? "text-muted-foreground/60 cursor-default" : "text-foreground hover:text-primary"
                  )}
                >
                  <span className={cn(isCurrent && "text-primary font-bold text-base")}>
                    {step.label}
                  </span>
                  {!isPending && (
                    <span className="text-muted-foreground/60 p-0.5 hover:bg-secondary rounded">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </span>
                  )}
                </button>

                {displayLog && !isExpanded && (
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {new Date(displayLog.timestamp).toLocaleTimeString()}
                  </span>
                )}

                {displayLog && isExpanded && (
                  <div className="mt-2 p-3 bg-secondary/15 rounded-xl border border-border/20 space-y-2 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                      <div>
                        <span className="font-semibold text-foreground/80">Timestamp: </span>
                        {new Date(displayLog.timestamp).toLocaleString()}
                      </div>
                      <div>
                        <span className="font-semibold text-foreground/80">Actor: </span>
                        {displayLog.actor}
                      </div>
                    </div>
                    {displayLog.remarks && (
                      <div className="pt-1.5 border-t border-border/40 text-foreground/90">
                        <span className="font-semibold text-muted-foreground">Remarks: </span>
                        {displayLog.remarks}
                      </div>
                    )}
                    {(displayLog.latitude !== undefined && displayLog.latitude !== null) && (
                      <div className="pt-1 text-[10px] text-muted-foreground font-mono">
                        GPS Location: {displayLog.latitude.toFixed(4)}, {displayLog.longitude?.toFixed(4)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {hasSpecialStatus && (
          <div className="relative group">
            <div
              className={cn(
                "absolute -left-[45px] top-1 flex h-8 w-8 items-center justify-center rounded-full border bg-background transition-all duration-300 shadow-sm",
                getSpecialStatusBg()
              )}
            >
              {getSpecialStatusIcon()}
            </div>

            <div className="flex flex-col space-y-1">
              <button
                onClick={() => setExpandedStep(expandedStep === activeStatus ? null : activeStatus)}
                className="flex items-center justify-between w-full text-left font-bold text-base text-foreground hover:text-primary transition-all"
              >
                <span className="capitalize">{activeStatus.toLowerCase()}</span>
                <span className="text-muted-foreground/60 p-0.5 hover:bg-secondary rounded">
                  {expandedStep === activeStatus ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </span>
              </button>

              {specialLog && expandedStep !== activeStatus && (
                <span className="text-[11px] text-muted-foreground font-medium">
                  {new Date(specialLog.timestamp).toLocaleTimeString()}
                </span>
              )}

              {specialLog && expandedStep === activeStatus && (
                <div className="mt-2 p-3 bg-secondary/15 rounded-xl border border-border/20 space-y-2 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                    <div>
                      <span className="font-semibold text-foreground/80">Timestamp: </span>
                      {new Date(specialLog.timestamp).toLocaleString()}
                    </div>
                    <div>
                      <span className="font-semibold text-foreground/80">Actor: </span>
                      {specialLog.actor}
                    </div>
                  </div>
                  {specialLog.remarks && (
                    <div className="pt-1.5 border-t border-border/40 text-foreground/90">
                      <span className="font-semibold text-muted-foreground">Remarks: </span>
                      {specialLog.remarks}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
