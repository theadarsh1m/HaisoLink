import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  ...props
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {

      pages.push(1);

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) {
        pages.push("ellipsis-1");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("ellipsis-2");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div
      className={cn("flex items-center justify-center space-x-1 py-4 md:space-x-2", className)}
      {...props}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 rounded-lg border-border/40 hover:bg-secondary active:scale-95 transition-all"
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center space-x-1">
        {getPageNumbers().map((page, idx) => {
          if (typeof page === "string") {
            return (
              <div
                key={`ellipsis-${idx}`}
                className="flex items-center justify-center w-8 h-8 text-muted-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
              </div>
            );
          }

          const isActive = page === currentPage;

          return (
            <Button
              key={page}
              variant={isActive ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(page)}
              className={cn(
                "w-8 h-8 text-xs font-semibold rounded-lg transition-all",
                isActive
                  ? "shadow-sm shadow-primary/30"
                  : "border-border/40 hover:bg-secondary active:scale-95"
              )}
            >
              {page}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 rounded-lg border-border/40 hover:bg-secondary active:scale-95 transition-all"
        aria-label="Go to next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
