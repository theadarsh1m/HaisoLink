export function formatCurrency(amount: number | string, currency = "USD", locale = "en-US"): string {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) return "$0.00";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(numericAmount);
}

export function formatDate(date: Date | string | number, locale = "en-US"): string {
  const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return "Invalid Date";

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
}

export function formatRelativeTime(date: Date | string | number): string {
  const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return "unknown time";

  const now = new Date();
  const elapsed = now.getTime() - dateObj.getTime();
  const absElapsed = Math.abs(elapsed);

  const seconds = Math.floor(absElapsed / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const isFuture = elapsed < 0;
  const suffix = isFuture ? " from now" : " ago";

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m${suffix}`;
  if (hours < 24) return `${hours}h${suffix}`;
  return `${days}d${suffix}`;
}
