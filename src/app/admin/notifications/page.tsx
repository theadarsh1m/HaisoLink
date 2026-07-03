"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, MessageSquare, Smartphone, CheckCircle2, XCircle } from "lucide-react";

interface LogItem {
  id: string;
  notificationType: string;
  channel: string;
  status: string;
  failureReason: string | null;
  retryCount: number;
  createdAt: string;
  user: { fullName: string; email: string } | null;
}

export default function AdminNotificationLogsPage() {
  const [logs, setLogs] = React.useState<LogItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/admin/notifications");
        const data = await res.json();
        if (data.success) {
          setLogs(data.data);
        }
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "EMAIL": return <Mail className="w-4 h-4 text-blue-500" />;
      case "SMS": return <MessageSquare className="w-4 h-4 text-emerald-500" />;
      case "IN_APP": return <Smartphone className="w-4 h-4 text-purple-500" />;
      default: return null;
    }
  };

  return (
    <DashboardLayout userRole="ADMIN" userEmail="admin@haisolink.com">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notification Logs</h1>
          <p className="text-muted-foreground text-sm">Monitor system-wide notification dispatch events and failures.</p>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead>Event Type</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Retries</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No notification logs found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs font-semibold">{log.notificationType}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold">{log.user?.fullName || "Unknown"}</span>
                            <span className="text-xs text-muted-foreground">{log.user?.email || "-"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm font-medium">
                            {getChannelIcon(log.channel)}
                            {log.channel}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={log.status === "SENT" ? "default" : "destructive"} className="gap-1 shadow-none">
                            {log.status === "SENT" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {log.status}
                          </Badge>
                          {log.failureReason && (
                            <p className="text-[10px] text-destructive mt-1 max-w-[150px] truncate" title={log.failureReason}>
                              {log.failureReason}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="text-xs font-mono">{log.retryCount}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(log.createdAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
