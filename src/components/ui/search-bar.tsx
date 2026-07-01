"use client";

import * as React from "react";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
  isLoading?: boolean;
}

export function SearchBar({
  onSearch,
  onClear,
  isLoading = false,
  className,
  value,
  onChange,
  ...props
}: SearchBarProps) {
  const [internalValue, setInternalValue] = React.useState(value?.toString() || "");

  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value.toString());
    }
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalValue(val);
    if (onChange) onChange(e);
    if (onSearch) onSearch(val);
  };

  const handleClear = () => {
    setInternalValue("");
    if (onClear) onClear();
    if (onSearch) onSearch("");
  };

  return (
    <div className={cn("relative w-full flex items-center group", className)}>
      <div className="absolute left-3.5 flex items-center text-muted-foreground/80 pointer-events-none group-focus-within:text-primary transition-colors duration-200">
        <Search className="h-4 w-4" />
      </div>
      <Input
        type="text"
        value={internalValue}
        onChange={handleTextChange}
        className="pl-10 pr-10 py-5 w-full bg-secondary/35 border-border/40 transition-all duration-300 focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background rounded-xl"
        {...props}
      />
      <div className="absolute right-3.5 flex items-center space-x-1.5">
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        {internalValue && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-md text-muted-foreground/70 hover:bg-secondary hover:text-foreground active:scale-95 transition-all"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
