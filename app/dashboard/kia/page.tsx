import React from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Plus, FileText, Baby, Users, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { formatEnum } from "@/lib/formatters";
import { KiaFilters } from "./components/KiaFilters";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    nutritionStatus?: string;
  }>;
}

export default async function KIAPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || "";
  const category = resolvedParams.category || "";
  const nutritionStatus = resolvedParams.nutritionStatus || "";

  let patients = [];
  let stats = { pregnantCount: 0, childrenCount: 0, stuntingRiskCount: 0 };

  try {
    const allPatients = await api.getPatients();
    stats.pregnantCount = allPatients.filter((p: any) => p.category === "IBU_HAMIL").length;
    stats.childrenCount = allPatients.filter((p: any) => p.category === "ANAK").length;
    stats.stuntingRiskCount = allPatients.filter((p: any) => p.nutritionStatus === "RISIKO_TINGGI").length;

    const params: any = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (nutritionStatus) params.nutritionStatus = nutritionStatus;

    if (Object.keys(params).length > 0) {
      patients = await api.getPatients(params);
    } else {
      patients = allPatients;
    }
  } catch (error) {
    console.error("Failed to fetch KIA data:", error);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Manajemen KIA</h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Pemantauan Kesehatan Ibu dan Anak serta Gizi.
          </p>
        </div>
        <Link href="/dashboard/kia/new">
          <Button variant="primary" className="gap-2" size="sm">
            <Plus className="w-3.5 h-3.5" /> Pasien Baru
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-primary rounded-xl p-5 shadow-md shadow-primary/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-xl" />
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center mb-3">
            <Users className="w-4 h-4 text-on-primary" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-primary/70">
            Total Ibu Hamil
          </p>
          <p className="text-3xl font-bold mt-1 text-on-primary leading-none">
            {stats.pregnantCount}
          </p>
        </div>
        <div className="bg-secondary rounded-xl p-5 shadow-md shadow-secondary/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-xl" />
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center mb-3">
            <Baby className="w-4 h-4 text-on-secondary" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-secondary/70">
            Balita Terpantau
          </p>
          <p className="text-3xl font-bold mt-1 text-on-secondary leading-none">
            {stats.childrenCount}
          </p>
        </div>
        <div className="bg-error rounded-xl p-5 shadow-md shadow-error/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-xl" />
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center mb-3">
            <AlertCircle className="w-4 h-4 text-on-error" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-error/70">
            Risiko Stunting
          </p>
          <p className="text-3xl font-bold mt-1 text-on-error leading-none">
            {stats.stuntingRiskCount}
          </p>
        </div>
      </div>

      {/* Table Card */}
      <Card>
        <div className="space-y-4">
          {/* Filters */}
          <KiaFilters />

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant/50 bg-surface-container-low/50">
                  <th className="text-left py-2.5 px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest rounded-l-lg">
                    Nama Pasien
                  </th>
                  <th className="text-left py-2.5 px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                    Kategori
                  </th>
                  <th className="text-left py-2.5 px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                    Terakhir Periksa
                  </th>
                  <th className="text-left py-2.5 px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                    Status Gizi
                  </th>
                  <th className="text-left py-2.5 px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest rounded-r-lg">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {patients.length > 0 ? (
                  patients.map((patient: any) => (
                    <tr
                      key={patient.id}
                      className="hover:bg-surface-container-low/60 transition-colors group"
                    >
                      <td className="py-3.5 px-3 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                            {patient.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-on-surface">
                            {patient.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-xs text-on-surface-variant font-medium">
                        {formatEnum(patient.category)}
                      </td>
                      <td className="py-3.5 px-3 text-xs text-on-surface-variant">
                        {patient.lastCheckup ? new Date(patient.lastCheckup).toLocaleDateString("id-ID") : (
                          <span className="text-outline-variant italic">
                            Belum ada
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                            patient.nutritionStatus === "PERLU_PERHATIAN" ||
                            patient.nutritionStatus === "RISIKO_TINGGI"
                              ? "bg-error/8 text-error border-error/20"
                              : "bg-secondary/8 text-secondary border-secondary/20"
                          }`}
                        >
                          {formatEnum(patient.nutritionStatus)}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <Link href={`/dashboard/kia/${patient.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 cursor-pointer hover:bg-primary transition-all"
                          >
                            <FileText className="w-3 h-3" /> Rekam Medis
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-14 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center">
                          <Baby className="w-6 h-6 text-outline-variant" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-on-surface-variant">
                            Belum ada data pasien
                          </p>
                          <p className="text-xs text-outline-variant mt-0.5">
                            Tambahkan pasien pertama Anda
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}
