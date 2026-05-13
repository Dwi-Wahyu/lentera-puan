import React from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Plus, Search, Filter } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatEnum } from "@/lib/formatters";
import { CrisisRowActions } from "./CrisisRowActions";

export default async function CrisisReportingPage() {
  const reports = await prisma.crisisReport.findMany({
    orderBy: { date: "desc" },
    include: { reporter: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">
            Pelaporan Krisis
          </h1>
          <p className="text-on-surface-variant">
            Manajemen dan tindak lanjut laporan kekerasan dan krisis.
          </p>
        </div>
        <Link href="/dashboard/krisis/new">
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" /> Laporan Baru
          </Button>
        </Link>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Cari ID Kasus atau Inisial..."
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select className="pl-4 pr-4 py-2 border border-outline-variant rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary appearance-none min-w-[160px] text-sm font-medium">
                <option value="">Semua Status</option>
                <option value="BARU">Baru</option>
                <option value="INVESTIGASI">Dalam Investigasi</option>
                <option value="TERVALIDASI">Tervalidasi</option>
                <option value="SELESAI">Selesai</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="text-left py-3 text-sm font-bold text-on-surface">
                  ID Kasus
                </th>
                <th className="text-left py-3 text-sm font-bold text-on-surface">
                  Tanggal
                </th>
                <th className="text-left py-3 text-sm font-bold text-on-surface">
                  Inisial Korban
                </th>
                <th className="text-left py-3 text-sm font-bold text-on-surface">
                  Tipe Krisis
                </th>
                <th className="text-left py-3 text-sm font-bold text-on-surface">
                  Status
                </th>
                <th className="text-left py-3 text-sm font-bold text-on-surface">
                  Prioritas
                </th>
                <th className="text-left py-3 text-sm font-bold text-on-surface text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {reports.length > 0 ? (
                reports.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-surface-container-low transition-colors group"
                  >
                    <td className="py-4 text-sm font-bold text-primary">
                      {item.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-4 text-sm text-on-surface-variant">
                      {item.date.toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-4 text-sm font-medium">
                      {item.victimInitials}
                    </td>
                    <td className="py-4 text-sm">{formatEnum(item.type)}</td>
                    <td className="py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.status === "BARU"
                            ? "bg-error-container text-on-error-container"
                            : item.status === "SELESAI"
                              ? "bg-secondary-container text-on-secondary-container"
                              : "bg-surface-container-high text-on-surface"
                        }`}
                      >
                        {formatEnum(item.status)}
                      </span>
                    </td>
                    <td className="py-4 text-sm">
                      <span
                        className={`font-bold ${
                          item.priority === "TINGGI" ||
                          item.priority === "SANGAT_TINGGI"
                            ? "text-error"
                            : "text-on-surface"
                        }`}
                      >
                        {formatEnum(item.priority)}
                      </span>
                    </td>
                    <td className="py-4 text-sm">
                      <CrisisRowActions reportId={item.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 text-center text-on-surface-variant italic"
                  >
                    Belum ada laporan krisis.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-on-surface-variant">
          Menampilkan {reports.length} laporan
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
