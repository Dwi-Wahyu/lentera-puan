import React from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import {
  ArrowLeft,
  Shield,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OccupancyActions } from "./OccupancyActions";
import { SafehouseDetailActions } from "./SafehouseDetailActions";
import { ResidentActions } from "./ResidentActions";
import { formatEnum } from "@/lib/formatters";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SafeHouseDetailPage({ params }: PageProps) {
  const { id } = await params;
  let safeHouse;

  try {
    safeHouse = await api.getSafehouse(id);
  } catch (error) {
    notFound();
  }

  if (!safeHouse) {
    notFound();
  }

  const occupancyPercent = (safeHouse.occupied / safeHouse.capacity) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/safehouse">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-on-surface">
              {safeHouse.name}
            </h1>
            <p className="text-on-surface-variant flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Tingkat Keamanan:{" "}
              <span className="font-bold">
                {formatEnum(safeHouse.safetyLevel)}
              </span>
            </p>
          </div>
        </div>
        <SafehouseDetailActions id={id} safeHouse={safeHouse} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Occupancy Card */}
        <Card className="lg:col-span-1 border-t-4 border-t-primary">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">
                  Status Hunian
                </p>
                <h3 className="text-4xl font-bold text-primary mt-1">
                  {safeHouse.occupied} / {safeHouse.capacity}
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 font-medium">
                  Bed Terisi
                </p>
              </div>
              <div
                className={`p-2 rounded-lg ${
                  safeHouse.status === "TERSEDIA"
                    ? "bg-secondary-container text-on-secondary-container"
                    : "bg-error-container text-on-error-container"
                }`}
              >
                {safeHouse.status === "TERSEDIA" ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <AlertCircle className="w-6 h-6" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase">
                <span>Kapasitas</span>
                <span>{Math.round(occupancyPercent)}%</span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    occupancyPercent > 80 ? "bg-error" : "bg-primary"
                  }`}
                  style={{ width: `${occupancyPercent}%` }}
                ></div>
              </div>
            </div>

            <OccupancyActions
              id={id}
              occupied={safeHouse.occupied}
              capacity={safeHouse.capacity}
            />
          </div>
        </Card>

        {/* Location & Contact Info */}
        <Card
          title="Detail Lokasi"
          subtitle="Hanya untuk akses internal terbatas"
          className="lg:col-span-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="p-2 bg-surface-container rounded-lg h-fit">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Alamat / Koordinat
                  </label>
                  <p className="text-on-surface font-medium mt-1 leading-relaxed">
                    {safeHouse.location ||
                      "Data lokasi tidak tersedia (Rahasia)"}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="p-2 bg-surface-container rounded-lg h-fit">
                  <Shield className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Sertifikasi Keamanan
                  </label>
                  <p className="text-on-surface font-medium mt-1">
                    Level {formatEnum(safeHouse.safetyLevel)} - Audit Terakhir
                    10 Mei 2026
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low p-4 rounded-xl space-y-4 border border-outline-variant">
              <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                Kontak Darurat Lokasi
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant">
                    Penanggung Jawab
                  </span>
                  <span className="text-sm font-bold">Ibu Rahmawati</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant">
                    Nomor Siaga
                  </span>
                  <span className="text-sm font-bold text-primary">
                    0811-9988-7766
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant">
                    Polsek Terdekat
                  </span>
                  <span className="text-sm font-bold">
                    Sektor Selatan (2km)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Real Occupants List */}
      <Card
        title="Daftar Penghuni Saat Ini"
        subtitle="Data inisial untuk perlindungan privasi"
      >
        <div className="overflow-x-auto mt-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="text-left py-3 text-sm font-bold text-on-surface">
                  ID Kasus
                </th>
                <th className="text-left py-3 text-sm font-bold text-on-surface">
                  Inisial
                </th>
                <th className="text-left py-3 text-sm font-bold text-on-surface">
                  Tanggal Masuk
                </th>
                <th className="text-left py-3 text-sm font-bold text-on-surface">
                  Prioritas
                </th>
                <th className="text-right py-3 text-sm font-bold text-on-surface">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {safeHouse.residents.length > 0 ? (
                safeHouse.residents.map((resident: any) => (
                  <tr
                    key={resident.id}
                    className="hover:bg-surface-container-low transition-colors group"
                  >
                    <td className="py-4 text-sm font-bold text-primary">
                      {resident.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-4 text-sm font-bold">
                      {resident.victimInitials}
                    </td>
                    <td className="py-4 text-sm text-on-surface-variant">
                      {new Date(resident.date).toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          resident.priority === "TINGGI" ||
                          resident.priority === "SANGAT_TINGGI"
                            ? "bg-error-container text-on-error-container"
                            : "bg-surface-container-high text-on-surface"
                        }`}
                      >
                        {formatEnum(resident.priority)}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-right">
                      <div className="flex justify-end gap-2">
                        <ResidentActions
                          safeHouseId={id}
                          reportId={resident.id}
                        />
                        <Link href={`/dashboard/krisis/${resident.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 group-hover:bg-primary group-hover:text-on-primary transition-all"
                          >
                            <Eye className="w-4 h-4" /> Detail
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-on-surface-variant italic"
                  >
                    Belum ada penghuni aktif yang terdaftar di sistem untuk
                    lokasi ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
