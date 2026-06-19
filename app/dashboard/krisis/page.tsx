import React from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Plus, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";
import { formatEnum } from "@/lib/formatters";
import { CrisisRowActions } from "./CrisisRowActions";
import { CrisisFilters } from "./components/CrisisFilters";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    priority?: string;
    type?: string;
  }>;
}

export default async function CrisisReportingPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || "";
  const status = resolvedParams.status || "";
  const priority = resolvedParams.priority || "";
  const type = resolvedParams.type || "";

  let reports = [];
  try {
    const params: any = {};
    if (search) params.search = search;
    if (status) params.status = status;
    if (priority) params.priority = priority;
    if (type) params.type = type;

    reports = await api.getCrisisReports(params);
  } catch (error) {
    console.error("Failed to fetch crisis reports:", error);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">
            Pelaporan Krisis
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Manajemen dan tindak lanjut laporan kekerasan dan krisis.
          </p>
        </div>
        <Link href="/dashboard/krisis/new">
          <Button variant="primary" className="gap-2" size="sm">
            <Plus className="w-3.5 h-3.5" /> Laporan Baru
          </Button>
        </Link>
      </div>

      <Card>
        {/* Filters */}
        <CrisisFilters />

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/50 bg-surface-container-low/50">
                <th className="text-left py-2.5 px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest rounded-l-lg">
                  ID Kasus
                </th>
                <th className="text-left py-2.5 px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Tanggal
                </th>
                <th className="text-left py-2.5 px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Inisial Korban
                </th>
                <th className="text-left py-2.5 px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Tipe Krisis
                </th>
                <th className="text-left py-2.5 px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Status
                </th>
                <th className="text-left py-2.5 px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Prioritas
                </th>
                <th className="text-center py-2.5 px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest rounded-r-lg">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {reports.length > 0 ? (
                reports.map((item: any) => (
                  <tr
                    key={item.id}
                    className="hover:bg-surface-container-low/60 transition-colors group"
                  >
                    <td className="py-3.5 px-3 text-xs font-bold text-primary font-mono">
                      {item.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-3.5 px-3 text-xs text-on-surface-variant">
                      {new Date(item.date).toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-3.5 px-3 text-sm font-semibold text-on-surface">
                      {item.victimInitials}
                    </td>
                    <td className="py-3.5 px-3 text-xs text-on-surface-variant">{formatEnum(item.type)}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                          item.status === "BARU"
                            ? "bg-error/8 text-error border-error/20"
                            : item.status === "SELESAI"
                              ? "bg-secondary/8 text-secondary border-secondary/20"
                              : "bg-surface-container text-on-surface-variant border-outline-variant/50"
                        }`}
                      >
                        {formatEnum(item.status)}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        {(item.priority === "TINGGI" || item.priority === "SANGAT_TINGGI") && (
                          <span className="w-1.5 h-1.5 rounded-full bg-error shrink-0" />
                        )}
                        <span
                          className={`text-xs font-bold ${
                            item.priority === "TINGGI" ||
                            item.priority === "SANGAT_TINGGI"
                              ? "text-error"
                              : "text-on-surface-variant"
                          }`}
                        >
                          {formatEnum(item.priority)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <CrisisRowActions reportId={item.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-outline-variant" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface-variant">Belum ada laporan krisis</p>
                        <p className="text-xs text-outline-variant mt-0.5">Laporan yang masuk akan ditampilkan di sini</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-on-surface-variant font-medium">
          Menampilkan <span className="font-bold text-on-surface">{reports.length}</span> laporan
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Sebelumnya
          </Button>
          <Button variant="outline" size="sm" disabled={reports.length <= 10}>
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  );
}
