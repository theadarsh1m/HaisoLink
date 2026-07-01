import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, Dot } from "lucide-react";

export interface TimelineItem {
  id: string | number;
  title: string;
  description: string;
  time: string;
  status: "completed" | "current" | "pending";
  icon?: React.ReactNode;
}

interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TimelineItem[];
}

export function Timeline({ items, className, ...props }: TimelineProps) {
  return (
    <div className={cn("relative pl-6 border-l border-border/60 space-y-8", className)} {...props}>
      {items.map((item) => {
        const isCompleted = item.status === "completed";
        const isCurrent = item.status === "current";

        return (
          <div key={item.id} className="relative group">
            {}
            <div
              className={cn(
                "absolute -left-[35px] top-1.5 flex h-7 w-7 items-center justify-center rounded-full border bg-background transition-all duration-300 shadow-sm",
                isCompleted && "border-emerald-500 text-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20",
                isCurrent && "border-primary text-primary bg-primary/10 ring-4 ring-primary/15 animate-pulse",
                item.status === "pending" && "border-muted-foreground/30 text-muted-foreground/50 bg-secondary"
              )}
            >
              {item.icon ? (
                <div className="h-4 w-4">{item.icon}</div>
              ) : isCompleted ? (
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              ) : (
                <Dot className="h-5 w-5 stroke-[3]" />
              )}
            </div>

            {}
            <div className="flex flex-col space-y-1 transition-all duration-200 group-hover:translate-x-0.5">
              <div className="flex items-center justify-between">
                <h4
                  className={cn(
                    "text-sm font-semibold tracking-tight",
                    isCompleted && "text-foreground",
                    isCurrent && "text-primary font-bold",
                    item.status === "pending" && "text-muted-foreground"
                  )}
                >
                  {item.title}
                </h4>
                <span className="text-xs text-muted-foreground/80 font-medium">{item.time}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
