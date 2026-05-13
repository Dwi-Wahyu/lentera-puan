"use client";

import React from "react";
import { Button } from "@/components/Button";
import { ChevronRight, FileDown } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

interface Checkup {
  date: Date | string;
  status: string;
  notes: string | null;
}

interface DownloadRecapButtonProps {
  patientName: string;
  checkups: Checkup[];
}

export const DownloadRecapButton: React.FC<DownloadRecapButtonProps> = ({
  patientName,
  checkups,
}) => {
  const toast = useToast();
  const handleDownload = () => {
    if (checkups.length === 0) {
      toast.error("Gagal", "Belum ada data pemeriksaan untuk diunduh.");
      return;
    }

    // CSV Header
    const headers = ["Tanggal", "Status Gizi", "Catatan Medis"];
    
    // CSV Rows
    const rows = checkups.map((c) => [
      new Date(c.date).toLocaleDateString("id-ID"),
      c.status,
      `"${(c.notes || "").replace(/"/g, '""')}"`, // Escape quotes for CSV
    ]);

    // Combine into CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    // Create Blob and Trigger Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `Rekap_Medis_${patientName.replace(/\s+/g, "_")}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Berhasil", "Data rekap medis sedang diunduh.");
  };

  return (
    <Button
      variant="outline"
      className="w-full mt-4 gap-2"
      onClick={handleDownload}
    >
      <FileDown className="w-4 h-4" /> Unduh Seluruh Rekap <ChevronRight className="w-4 h-4" />
    </Button>
  );
};
