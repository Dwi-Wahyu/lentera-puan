"use client";

import React from "react";
import { Button } from "@/components/Button";
import { FileDown } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

interface CounselingSession {
  date: Date | string;
  time: string;
  type: string;
  status: string;
  counselor: {
    name: string | null;
  };
}

interface DownloadCounselingRecapButtonProps {
  sessions: CounselingSession[];
}

export const DownloadCounselingRecapButton: React.FC<DownloadCounselingRecapButtonProps> = ({
  sessions,
}) => {
  const toast = useToast();
  const handleDownload = () => {
    if (sessions.length === 0) {
      toast.error("Gagal", "Belum ada data jadwal konseling untuk diunduh.");
      return;
    }

    // CSV Header
    const headers = ["Tanggal", "Waktu", "Tipe Intervensi", "Pendamping", "Status"];
    
    // CSV Rows
    const rows = sessions.map((s) => [
      new Date(s.date).toLocaleDateString("id-ID"),
      s.time,
      s.type,
      s.counselor.name || "N/A",
      s.status,
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
    link.setAttribute("download", `Rekap_Jadwal_Konseling_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Berhasil", "Data rekap jadwal konseling sedang diunduh.");
  };

  return (
    <Button
      variant="outline"
      className="w-full gap-2"
      onClick={handleDownload}
    >
      <FileDown className="w-4 h-4" /> Unduh Rekap
    </Button>
  );
};
