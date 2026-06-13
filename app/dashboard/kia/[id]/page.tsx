import React from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import {
  ArrowLeft,
  User,
  Fingerprint,
  Baby,
  Activity,
  Calendar,
  FileText,
  Plus,
  ClipboardList,
  Edit2,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DownloadRecapButton } from "@/components/DownloadRecapButton";
import { formatEnum } from "@/lib/formatters";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MedicalRecordPage({ params }: PageProps) {
  const { id } = await params;
  
  let patient;
  try {
    patient = await api.getPatient(id);
  } catch (error) {
    console.error("Failed to fetch patient:", error);
    notFound();
  }

  if (!patient) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/kia">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-on-surface">Rekam Medis</h1>
            <p className="text-on-surface-variant flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Pasien: <span className="font-bold">{patient.name}</span>
            </p>
          </div>
        </div>
        <Link href={`/dashboard/kia/${id}/checkup`}>
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" /> Input Pemeriksaan
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Identity Card */}
        <Card className="lg:col-span-1 border-t-4 border-t-primary">
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center text-primary text-4xl">
                {patient.category === "ANAK" ? (
                  <Baby className="w-12 h-12" />
                ) : (
                  <User className="w-12 h-12" />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Fingerprint className="w-5 h-5 text-on-surface-variant" />
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase">
                    NIK
                  </p>
                  <p className="text-sm font-bold">{patient.nik}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ClipboardList className="w-5 h-5 text-on-surface-variant" />
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase">
                    Kategori
                  </p>
                  <p className="text-sm font-bold">
                    {formatEnum(patient.category)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-on-surface-variant" />
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase">
                    Status Gizi Saat Ini
                  </p>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase inline-block mt-1 ${
                      patient.nutritionStatus === "PERLU_PERHATIAN" ||
                      patient.nutritionStatus === "RISIKO_TINGGI"
                        ? "bg-error-container text-on-error-container"
                        : "bg-secondary-container text-on-secondary-container"
                    }`}
                  >
                    {formatEnum(patient.nutritionStatus)}
                  </span>
                </div>
              </div>
            </div>

            <Link href={`/dashboard/kia/${id}/edit`}>
              <Button variant="outline" className="w-full gap-2">
                <Edit2 className="w-4 h-4" /> Edit Identitas
              </Button>
            </Link>
          </div>
        </Card>

        {/* Checkup History */}
        <Card
          title="Riwayat Pemeriksaan"
          subtitle="Catatan medis berkala pasien"
          className="lg:col-span-2"
        >
          <div className="overflow-x-auto mt-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="text-left py-3 text-sm font-bold text-on-surface">
                    Tanggal
                  </th>
                  <th className="text-left py-3 text-sm font-bold text-on-surface">
                    Status
                  </th>
                  <th className="text-left py-3 text-sm font-bold text-on-surface">
                    Catatan / Hasil
                  </th>
                  <th className="text-left py-3 text-sm font-bold text-on-surface">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {patient.checkups && patient.checkups.length > 0 ? (
                  patient.checkups.map((checkup: any) => (
                    <tr
                      key={checkup.id}
                      className="hover:bg-surface-container-low transition-colors group"
                    >
                      <td className="py-4 text-sm whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          {new Date(checkup.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="py-4 text-sm">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            checkup.status === "NORMAL"
                              ? "bg-secondary-container text-on-secondary-container"
                              : "bg-error-container text-on-error-container"
                          }`}
                        >
                          {formatEnum(checkup.status)}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-on-surface-variant max-w-xs truncate">
                        {checkup.notes || "-"}
                      </td>
                      <td className="py-4 text-sm">
                        <Link
                          href={`/dashboard/kia/${id}/checkup/${checkup.id}`}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 hover:bg-primary cursor-pointer"
                          >
                            <FileText className="w-3 h-3" /> Detail
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-on-surface-variant italic"
                    >
                      Belum ada riwayat pemeriksaan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {patient.checkups && patient.checkups.length > 0 && (
            <DownloadRecapButton
              patientName={patient.name}
              checkups={patient.checkups}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
