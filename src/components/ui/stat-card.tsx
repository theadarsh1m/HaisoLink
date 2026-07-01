import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string | number;
    type: "up" | "down" | "neutral";
  };
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
  ...props
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card/60 backdrop-blur-md border border-border/40",
        className
      )}
      {...props}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground/90 tracking-wide uppercase">{title}</p>
          {icon && (
            <div className="p-2 bg-secondary/80 text-secondary-foreground rounded-xl border border-border/20 backdrop-blur-sm shadow-sm transition-transform duration-300 group-hover:scale-110">
              {icon}
            </div>
          )}
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/80">{value}</h2>
          {trend && (
            <div
              className={cn(
                "flex items-center text-xs font-semibold px-2 py-1 rounded-full border shadow-sm",
                trend.type === "up" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
                trend.type === "down" && "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
                trend.type === "neutral" && "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400"
              )}
            >
              {trend.type === "up" && <ArrowUpRight className="h-3 w-3 mr-0.5" />}
              {trend.type === "down" && <ArrowDownRight className="h-3 w-3 mr-0.5" />}
              {trend.type === "neutral" && <Minus className="h-3 w-3 mr-0.5" />}
              {trend.value}
            </div>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-2 font-medium tracking-wide">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
