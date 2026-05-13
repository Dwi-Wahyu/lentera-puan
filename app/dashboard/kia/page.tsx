import React from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import {
  Plus,
  Search,
  FileText,
  Filter,
  Baby,
  Users,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatEnum } from "@/lib/formatters";

export default async function KIAPage() {
  const patients = await prisma.patient.findMany({
    orderBy: { updatedAt: "desc" },
  });

  const pregnantCount = await prisma.patient.count({
    where: { category: "IBU_HAMIL" },
  });
  const childrenCount = await prisma.patient.count({
    where: { category: "ANAK" },
  });
  const stuntingRiskCount = await prisma.patient.count({
    where: { nutritionStatus: "RISIKO_TINGGI" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Manajemen KIA</h1>
          <p className="text-on-surface-variant">
            Pemantauan Kesehatan Ibu dan Anak serta Gizi.
          </p>
        </div>
        <Link href="/dashboard/kia/new">
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" /> Pasien Baru
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary">
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">
            Total Ibu Hamil
          </p>
          <p className="text-3xl font-bold mt-1">{pregnantCount}</p>
        </Card>
        <Card className="bg-secondary ">
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">
            Balita Terpantau
          </p>
          <p className="text-3xl font-bold mt-1">{childrenCount}</p>
        </Card>
        <Card className="bg-error ">
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">
            Risiko Stunting
          </p>
          <p className="text-3xl font-bold mt-1">{stuntingRiskCount}</p>
        </Card>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari Nama Pasien atau NIK..."
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select className="pl-10 pr-4 py-2 border border-outline-variant rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary appearance-none min-w-[160px] text-sm font-medium">
                  <option value="">Semua Kategori</option>
                  <option value="IBU_HAMIL">Ibu Hamil</option>
                  <option value="ANAK">Anak / Balita</option>
                  <option value="IBU_MENYUSUI">Ibu Menyusui</option>
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="relative">
                <select className="pl-10 pr-4 py-2 border border-outline-variant rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary appearance-none min-w-[160px] text-sm font-medium">
                  <option value="">Semua Status</option>
                  <option value="NORMAL">Normal</option>
                  <option value="PERLU_PERHATIAN">Perlu Perhatian</option>
                  <option value="RISIKO_TINGGI">Risiko Tinggi</option>
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="text-left py-3 text-sm font-bold text-on-surface">
                    Nama Pasien
                  </th>
                  <th className="text-left py-3 text-sm font-bold text-on-surface">
                    Kategori
                  </th>
                  <th className="text-left py-3 text-sm font-bold text-on-surface">
                    Terakhir Periksa
                  </th>
                  <th className="text-left py-3 text-sm font-bold text-on-surface">
                    Status Gizi
                  </th>
                  <th className="text-left py-3 text-sm font-bold text-on-surface">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {patients.length > 0 ? (
                  patients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="hover:bg-surface-container-low transition-colors group"
                    >
                      <td className="py-4 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-xs">
                            {patient.name.charAt(0)}
                          </div>
                          <span className="font-bold">{patient.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-on-surface-variant">
                        {formatEnum(patient.category)}
                      </td>
                      <td className="py-4 text-sm">
                        {patient.lastCheckup?.toLocaleDateString("id-ID") ||
                          "-"}
                      </td>
                      <td className="py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            patient.nutritionStatus === "PERLU_PERHATIAN" ||
                            patient.nutritionStatus === "RISIKO_TINGGI"
                              ? "bg-error-container text-on-error-container"
                              : "bg-secondary-container text-on-secondary-container"
                          }`}
                        >
                          {formatEnum(patient.nutritionStatus)}
                        </span>
                      </td>
                      <td className="py-4 text-sm">
                        <Link href={`/dashboard/kia/${patient.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 group-hover:bg-primary group-hover:text-on-primary"
                          >
                            <FileText className="w-3 h-3" /> Rekam Medis
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-on-surface-variant italic border border-dashed border-outline-variant rounded-lg"
                    >
                      Belum ada data pasien.
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
