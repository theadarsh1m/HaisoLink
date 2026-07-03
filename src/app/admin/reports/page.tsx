"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Input } from "@/components/ui/input";

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ type: reportType });
      if (reportType === "custom") {
        if (!startDate || !endDate) {
          alert("Please select both start and end dates for custom report.");
          setIsLoading(false);
          return null;
        }
        params.append("startDate", startDate);
        params.append("endDate", endDate);
      }
      
      const res = await fetch(`/api/admin/reports?${params}`);
      if (!res.ok) throw new Error("Failed to fetch report data");
      return await res.json();
    } catch (error) {
      console.error(error);
      alert("Error fetching report data");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = async () => {
    const data = await fetchReportData();
    if (!data || !data.data.length) return alert("No data to export");
    const csv = Papa.unparse(data.data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `report_${reportType}.csv`;
    link.click();
  };

  const handleExportExcel = async () => {
    const data = await fetchReportData();
    if (!data || !data.data.length) return alert("No data to export");
    const worksheet = XLSX.utils.json_to_sheet(data.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `report_${reportType}.xlsx`);
  };

  const handleExportPDF = async () => {
    const data = await fetchReportData();
    if (!data || !data.data.length) return alert("No data to export");
    
    const doc = new jsPDF("landscape");
    const columns = Object.keys(data.data[0]);
    const rows = data.data.map((row: any) => columns.map(c => row[c]));

    doc.text(`HaisoLink ${reportType.toUpperCase()} Report`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    (doc as any).autoTable({
      head: [columns],
      body: rows,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });
    
    doc.save(`report_${reportType}.pdf`);
  };

  return (
    <DashboardLayout userRole="ADMIN" userEmail="admin@haisolink.com">
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Report Generator</h1>
          <p className="text-muted-foreground mt-1">
            Generate and export operational and financial reports.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Report Parameters</CardTitle>
            <CardDescription>Select the type and time range of the report to generate.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-full sm:w-[300px]">
                  <SelectValue placeholder="Select Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Report (Today)</SelectItem>
                  <SelectItem value="weekly">Weekly Report (Last 7 Days)</SelectItem>
                  <SelectItem value="monthly">Monthly Report (Last 30 Days)</SelectItem>
                  <SelectItem value="custom">Custom Date Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {reportType === "custom" && (
              <div className="grid grid-cols-2 gap-4 sm:w-[500px]">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
              </div>
            )}

            <div className="h-px bg-border/50 w-full my-4" />

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleExportCSV} disabled={isLoading} className="flex-1 sm:flex-none">
                <FileText className="mr-2 h-4 w-4" />
                {isLoading ? "Generating..." : "Export as CSV"}
              </Button>
              <Button onClick={handleExportExcel} disabled={isLoading} className="flex-1 sm:flex-none" variant="secondary">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                {isLoading ? "Generating..." : "Export as Excel"}
              </Button>
              <Button onClick={handleExportPDF} disabled={isLoading} className="flex-1 sm:flex-none" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                {isLoading ? "Generating..." : "Export as PDF"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
