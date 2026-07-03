"use client";

import * as React from "react";
import { debouncedSearch, type GeocodingResult } from "@/lib/services/geocoding-service";
import { Search, X, MapPin } from "lucide-react";

interface AddressSearchBoxProps {
  placeholder?: string;
  onSelect: (result: GeocodingResult) => void;
  className?: string;
}

export function AddressSearchBox({
  placeholder = "Search address...",
  onSelect,
  className = "",
}: AddressSearchBoxProps) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<GeocodingResult[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    debouncedSearch(query, (res) => {
      setResults(res);
      setIsOpen(res.length > 0);
      setIsLoading(false);
    });
  }, [query]);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (result: GeocodingResult) => {
    setQuery(result.displayName.split(",").slice(0, 3).join(","));
    setIsOpen(false);
    onSelect(result);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-background border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-card border border-border/40 rounded-xl shadow-xl z-[500]">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Searching...
          </div>
        </div>
      )}

      {isOpen && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border/40 rounded-xl shadow-xl z-[500] max-h-64 overflow-y-auto">
          {results.map((result) => (
            <button
              key={result.placeId}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(result); }}
              className="w-full flex items-start gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left border-b border-border/20 last:border-b-0"
            >
              <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{result.displayName.split(",").slice(0, 2).join(",")}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {result.address.city && `${result.address.city}, `}
                  {result.address.state && `${result.address.state} `}
                  {result.address.postcode}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
