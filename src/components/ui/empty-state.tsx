import * as React from "react";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon = <Inbox className="h-10 w-10 text-muted-foreground/60" />,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-border/60 bg-secondary/20 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary border border-border/10 shadow-inner mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6 leading-relaxed">
        {description}
      </p>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}
