import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "fullscreen" | "page";
  text?: string;
}

export function Loader({
  size = "md",
  variant = "spinner",
  text = "Loading...",
  className,
  ...props
}: LoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  if (variant === "fullscreen" || variant === "page") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center space-y-4",
          variant === "fullscreen" && "fixed inset-0 z-50 bg-background/80 backdrop-blur-md",
          variant === "page" && "w-full min-h-[50vh]",
          className
        )}
        {...props}
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl w-16 h-16" />
          <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
        </div>
        {text && (
          <p className="text-sm font-semibold tracking-widest uppercase text-muted-foreground/80 animate-pulse">
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center", className)} {...props}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
    </div>
  );
}
