type LogLevel = "debug" | "info" | "warn" | "error";

interface LogPayload {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  metadata?: Record<string, unknown>;
}

class Logger {
  private isDev = process.env.NODE_ENV !== "production";

  private formatLog(level: LogLevel, message: string, context?: string, metadata?: Record<string, unknown>): LogPayload {
    return {
      level,
      message,
      context,
      metadata,
      timestamp: new Date().toISOString(),
    };
  }

  private write(payload: LogPayload) {
    if (this.isDev) {

      const timestamp = `[${payload.timestamp.split("T")[1].slice(0, 8)}]`;
      const contextTag = payload.context ? `[${payload.context}]` : "";

      const colors = {
        debug: "\x1b[35m",
        info: "\x1b[32m",
        warn: "\x1b[33m",
        error: "\x1b[31m",
      };
      const resetColor = "\x1b[0m";

      const color = colors[payload.level] || resetColor;

      console.log(
        `${timestamp} ${color}${payload.level.toUpperCase()}${resetColor} ${contextTag} ${payload.message}`,
        payload.metadata ? payload.metadata : ""
      );
    } else {

      console.log(JSON.stringify(payload));
    }
  }

  debug(message: string, context?: string, metadata?: Record<string, unknown>) {
    this.write(this.formatLog("debug", message, context, metadata));
  }

  info(message: string, context?: string, metadata?: Record<string, unknown>) {
    this.write(this.formatLog("info", message, context, metadata));
  }

  warn(message: string, context?: string, metadata?: Record<string, unknown>) {
    this.write(this.formatLog("warn", message, context, metadata));
  }

  error(message: string, context?: string, metadata?: Record<string, unknown>) {
    this.write(this.formatLog("error", message, context, metadata));
  }
}

export const logger = new Logger();
